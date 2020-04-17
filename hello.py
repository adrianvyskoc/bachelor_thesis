from flask import Flask
from flask import request
import json
import psycopg2   # kniznica na pracu s postrgresql
import pandas as pd
from sklearn import preprocessing
from pandas import DataFrame
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
#treba nainstalovat cez pip psycopg2 aj pandas aj scikit-learn

#Toto doriesit asi nejak lepsie
database_name = "bakalarka"
database_user = "postgres"
database_password = "elahop"
database_port = 5432

#globalne premenne
slovnik = [ ('ais_admissions', '', ', "Body_celkom", "Body", "Pohlavie"'),
           ('ineko_schools', 'FULL OUTER JOIN ineko_schools on ais_admissions.school_id = ineko_schools.kod_kodsko', ', okres, kraj, typ_skoly'),
           ('ineko_total_ratings', 'FULL OUTER JOIN ineko_total_ratings on ais_admissions.school_id = ineko_total_ratings.school_id', ', celkove_hodnotenie, maturity, matematika, vyucovaci_jazyk, mimoriadne_vysledky, nezamestnanost_absolventov, "prijimanie_na_VS", pedagogicky_zbor, financne_zdroje'),
           ('ineko_percentils', 'FULL OUTER JOIN ineko_percentils on ais_admissions.school_id = ineko_percentils.school_id', ', "Mat_SJ", "Mat_M", poc_ucitelov')
          ]

#POMOCNE FUNKCIE

# -------------SPOLOCNE----------------------------
def odstranenie_None(val):
    if val is None:
        val = np.nan
    return val

def zakladne_predspracovanie(data, pole_tabuliek):
    data = data.apply(pd.to_numeric, errors='ignore')
    if('ais_admissions' in pole_tabuliek):
        data["Body_navyse"] = data["Body_celkom"] - data["Body"]
        data.drop(columns = "Body_celkom", inplace=True)
    for column in data.columns:
        data[column] = data[column].apply(odstranenie_None)
    return data

# ----------------pre predikciu-------------------------

def predikcia_vytvorenie_sql_stringu(pouzite_tabulky):
    sql_query_string = 'SELECT ais_admissions."AIS_ID"'
    for tabulka in slovnik:
        if (tabulka[0] in pouzite_tabulky):
            sql_query_string = sql_query_string + tabulka[2]
            
    sql_query_string = sql_query_string + ' FROM ais_admissions '
    for tabulka in slovnik:
        if (tabulka[0] in pouzite_tabulky):
            sql_query_string = sql_query_string + tabulka[1] + " "
    sql_query_string = sql_query_string + ' WHERE ais_admissions."OBDOBIE" = %s AND (ais_admissions."Rozh" = 10 OR ais_admissions."Rozh" = 11) AND ais_admissions."Štúdium" = \'áno\' AND ais_admissions.stupen_studia = \'Bakalársky\' '
    return sql_query_string

def prediction_uprava_kategoricke_na_numericke(data, cur, id_modelu):
    cur.execute('SELECT encoder FROM prediction_models WHERE id = %s', (id_modelu,))
    if (cur.rowcount == 0):
        print("Nepodarilo sa najst encoder")
    encoder = pickle.loads(cur.fetchone()[0].tobytes())
    
    kategoricke = data.select_dtypes(include = ['object'])
    transformovane = encoder.transform(kategoricke)
    transf_data_df = pd.DataFrame(transformovane.toarray())
    transf_data_df.columns = encoder.get_feature_names()
    numericke = data.select_dtypes(include=['float64', 'int64'])
    final_data = pd.merge(numericke, transf_data_df, left_index=True, right_index=True)
    return final_data

# -------------pre vytvaranie modelu----------------------------
def uprava_znamok_pre_binarnu_klas(vyber):
    vyber.loc[vyber["PREDMET_VYSLEDOK"] == 'A', ["PREDMET_VYSLEDOK"]] = 0.0
    vyber.loc[vyber["PREDMET_VYSLEDOK"] == 'B', ["PREDMET_VYSLEDOK"]] = 0.0
    vyber.loc[vyber["PREDMET_VYSLEDOK"] == 'C', ["PREDMET_VYSLEDOK"]] = 0.0
    vyber.loc[vyber["PREDMET_VYSLEDOK"] == 'D', ["PREDMET_VYSLEDOK"]] = 0.0
    vyber.loc[vyber["PREDMET_VYSLEDOK"] == 'E', ["PREDMET_VYSLEDOK"]] = 1.0
    vyber.loc[vyber["PREDMET_VYSLEDOK"] == 'FX', ["PREDMET_VYSLEDOK"]] = 1.0
    vyber.loc[vyber["PREDMET_VYSLEDOK"] == 'FN', ["PREDMET_VYSLEDOK"]] = 1.0
    return vyber

def fit_transform_save_imputers(data, model_id, conn):
    counter = 0
    for column in data.columns:
        if (data[column].dtype == np.float64):
            imp = SimpleImputer(missing_values = np.nan, strategy = 'mean')
            imp.fit(data[[column]])
            data[column] = imp.transform(data[[column]])
        else:
            imp = SimpleImputer(missing_values = np.nan, strategy = 'most_frequent')
            imp.fit(data[[column]])
            data[column] = imp.transform(data[[column]])
        imp_ulozenie = pickle.dumps(imp)
        cur = conn.cursor()
        cur.execute('INSERT INTO imputers VALUES (DEFAULT, %s, %s, %s)', (model_id, column, imp_ulozenie))
        if (cur.rowcount == 1):
            counter += 1
        conn.commit()
    if (counter == len(data.columns)):
        return True
    else:
        return False

def create_model_categoric_to_num(data):
    data = uprava_znamok_pre_binarnu_klas(data)
    data["PREDMET_VYSLEDOK"] = data["PREDMET_VYSLEDOK"].apply(pd.to_numeric, errors='ignore')
    encoder = OneHotEncoder(categories = 'auto', handle_unknown = 'ignore')
    kategoricke = data.select_dtypes(include = ['object'])
    encoder = encoder.fit(kategoricke)
    transformovane = encoder.transform(kategoricke)
    transf_data_df = pd.DataFrame(transformovane.toarray())
    transf_data_df.columns = encoder.get_feature_names()
    numericke = data.select_dtypes(include=['float64', 'int64'])
    final_data = pd.merge(numericke, transf_data_df, left_index=True, right_index=True)
    return final_data, encoder

def vytvorenie_sql_stringu_simple_model(pole_vybranych_tabuliek, obdobia):
    sql_query_string = 'SELECT "PREDMET_VYSLEDOK"'
    for tabulka in slovnik:
        if (tabulka[0] in pole_vybranych_tabuliek):
            sql_query_string = sql_query_string + tabulka[2]
    sql_query_string = sql_query_string + ' FROM ais_admissions JOIN ais_grades ag on ag."AIS_ID" = ais_admissions."AIS_ID"'
    for tabulka in slovnik:
        if (tabulka[0] in pole_vybranych_tabuliek):
            sql_query_string = sql_query_string + tabulka[1] + " "
    sql_query_string = sql_query_string + """WHERE "PREDMET_ID" = %s AND ais_admissions."OBDOBIE" = ag."OBDOBIE" AND ag."SEMESTER" = 'winter' AND ("""
    for i, obdobie in enumerate(obdobia):
        if (i == (len(obdobia) - 1)):
            sql_query_string = sql_query_string + 'ais_admissions."OBDOBIE" = \'' + obdobie + '\''
        else:
            sql_query_string = sql_query_string + 'ais_admissions."OBDOBIE" = \'' + obdobie + '\' OR '
    sql_query_string = sql_query_string + ')'
    return sql_query_string

def zisti_obdobia_na_trenovanie(sql_string, predmet_id):
    sql_1 = sql_string.replace('SELECT', 'SELECT ais_admissions."OBDOBIE", ')
    sql_obdobia = 'SELECT distinct a."OBDOBIE" FROM (' + sql_1 + ") as a"
    conn = psycopg2.connect(host="localhost", port = database_port, database=database_name, user=database_user, password=database_password)
    cur = conn.cursor()
    cur.execute(sql_obdobia, (predmet_id,))
    
    pole_obdobi = []
    data = cur.fetchall()
    for row in data:
        pole_obdobi.append(row[0])
    print(pole_obdobi)
    conn.commit()
    conn.close()
    return ','.join(pole_obdobi)


def create_simple_model(pole_vybranych_tabuliek, predmet_id, obdobia, nazov_modelu):
    sql_string = vytvorenie_sql_stringu_simple_model(pole_vybranych_tabuliek, obdobia)
    print(sql_string)
    #pripojenie na databazu
    conn = psycopg2.connect(host="localhost", port = database_port, database=database_name, user=database_user, password=database_password)
    cur = conn.cursor()
    #vytiahnutie trenovacich dat
    cur.execute(sql_string, (predmet_id, ))
    conn.commit()
    data = DataFrame(cur.fetchall())
    colnames = [desc[0] for desc in cur.description]
    data.columns = colnames
    
    #prve vlozenie modelu do dB
    cur.execute('INSERT INTO prediction_models (id, name, subject_id, type, used_years, used_tables) VALUES (DEFAULT, %s, %s, %s, %s, %s)', (nazov_modelu, predmet_id, 'simple', zisti_obdobia_na_trenovanie(sql_string, predmet_id), ','.join(pole_vybranych_tabuliek)))
    conn.commit()
    if (cur.rowcount == 0):
        return "nepodarilo sa vlozit model do DB"
    cur.execute('SELECT id FROM prediction_models WHERE name = %s', (nazov_modelu,))
    conn.commit()
    id_modelu = cur.fetchone()[0]
    print(id_modelu)
    
    #zakladne_predspracovanie
    data = zakladne_predspracovanie(data, pole_vybranych_tabuliek)
    
    print(data.info())

    #imputery
    if (fit_transform_save_imputers(data, id_modelu, conn) == False):
        return "chyba v imputeroch"
    
    #encoder
    final_data, one_hot_encoder = create_model_categoric_to_num(data)
    
    print(final_data.columns)
    #rozdelenie na x a y
    x = final_data.copy()
    y = final_data[["PREDMET_VYSLEDOK"]]
    x.drop(columns = "PREDMET_VYSLEDOK", inplace=True)
    
    #rozdelenie dat na trenovacie a testovacie
    X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.33, random_state=42)
    
    #ZATIAL DEFAULTNY STROM
    strom = DecisionTreeClassifier()
    strom.fit(X_train, y_train)
    y_pred = strom.predict(X_test)
    
    #metriky
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    
    #ulozenie modelu do DB
    encoder_ulozenie = pickle.dumps(one_hot_encoder)
    model_ulozenie = pickle.dumps(strom)

    pocet_trenovacich_zaznamov = len(y_train.index)
    
    cur.execute('UPDATE prediction_models SET size_of_training_set = %s, accuracy = %s, f1 = %s, precision = %s, recall = %s, model = %s, encoder=%s WHERE id = %s', (pocet_trenovacich_zaznamov, accuracy, f1, precision, recall, model_ulozenie, encoder_ulozenie, id_modelu))
    conn.commit()
    if (cur.rowcount == 1):
        return "OK"
    else:
        return "dajaka chyba"
    
    conn.close()


app = Flask(__name__)

@app.route('/')
def hello():
    odpoved = "hello from python"
    return json.dumps(
        {
            'odpoved': odpoved
        }
    )

@app.route('/prediction')
def prediction():
    rok = request.args.get('school_year')
    id_model = request.args.get('model')
    print('%s rok', rok)
    print('id_model: %s', id_model)
    conn = psycopg2.connect(host="localhost", port = database_port, database=database_name, user=database_user, password=database_password)
    cur = conn.cursor()

    #vytiahnutie modelu z DB
    cur.execute("SELECT * FROM prediction_models WHERE id = %s", (id_model,))
    if (cur.rowcount == 0):
        print("neexistujuci model")
    
    model_z_databazy = DataFrame(cur.fetchall())
    model_z_databazy.columns = [desc[0] for desc in cur.description]
    pouzite_tabulky = model_z_databazy.used_tables[0].split(",")

    #vytiahnutie dat o studentoch z DB
    sql_string = predikcia_vytvorenie_sql_stringu(pouzite_tabulky)
    cur.execute(sql_string, (rok,))
    data_studenti = DataFrame(cur.fetchall())
    data_studenti.columns = [desc[0] for desc in cur.description]
    
    #predspracovanie dat
    data_studenti = zakladne_predspracovanie(data_studenti, pouzite_tabulky)
    
    #pouzitie imputerov
    for column in data_studenti.columns:
        if (column != 'AIS_ID'):
            cur.execute('SELECT imputer FROM imputers WHERE column_name = %s AND id_model = %s', (column, id_model))
            if (cur.rowcount == 0):
                print("nenasiel sa imputer")
            loaded_imputer = pickle.loads(cur.fetchone()[0].tobytes())
            data_studenti[column] = loaded_imputer.transform(data_studenti[[column]])

    ais_id = DataFrame(data_studenti.loc[:, "AIS_ID"])

    data_studenti.drop(columns = ['AIS_ID'], inplace = True)
    data_studenti_enc = prediction_uprava_kategoricke_na_numericke(data_studenti, cur, id_model)
    
    #predikcia
    predikcny_model = pickle.loads(model_z_databazy.model[0].tobytes())
    predicted = predikcny_model.predict(data_studenti_enc)
    ais_id["predikovana_hodnota"] = predicted
    rizikovi = ais_id[ais_id['predikovana_hodnota'] == 1]
    rizikovi['AIS_ID'] = rizikovi["AIS_ID"].astype(str)
    return ','.join(rizikovi['AIS_ID'].to_list())

    

@app.route('/create_model', methods=['GET'])
def create_model():
    selected_tables_string = request.args.get('selected_tables')
    years_string = request.args.get('years')
    subject_id = request.args.get('subject_id')
    name_of_model = request.args.get('name_of_model')
    type_of_model = request.args.get('type_of_model')    

    #rozdelenie na simple a komplex
    if (type_of_model == 'simple'):
        selected_tables = selected_tables_string.split(',')
        years = years_string.split(',')
        print(selected_tables)
        print(years)
        
        return (create_simple_model(selected_tables, subject_id, years, name_of_model))

if __name__ == "__main__":
    app.run()

