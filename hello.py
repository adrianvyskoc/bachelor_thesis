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
#treba nainstalovat cez pip psycopg2 aj pandas aj scikit-learn

#Toto doriesit asi nejak lepsie
database_name = "bakalarka"
database_user = "postgres"
database_password = "elahop"
database_port = 5432

#POMOCNE FUNKCIE

def odstranenie_None(val):
    if val is None:
        val = np.nan
    return val

def prediction_predspracovanie(data):
    data = data.apply(pd.to_numeric, errors='ignore')
    data.reset_index(inplace=True)
    data["Body_navyse"] = data["Body_celkom"] - data["Body"]
    data.drop(columns = "Body_celkom", inplace=True)
    data["okres"] = data["okres"].apply(odstranenie_None)
    data["kraj"] = data["kraj"].apply(odstranenie_None)
    data["typ_skoly"] = data["typ_skoly"].apply(odstranenie_None)
    data.drop(columns = ["index"], inplace=True)
    return data

def prediction_imputers_transform(data, id_model, conn):
    for column in data.columns:
        cur = conn.cursor()
        cur.execute('SELECT imputer FROM imputers WHERE column_name = %s AND id_model = %s', (column, id_model))
        conn.commit()
        if (cur.rowcount == 0):
            print("nenasiel sa imputer")
            return 0
        loaded_imputer = pickle.loads(cur.fetchone()[0].tobytes())
        data[column] = loaded_imputer.transform(data[[column]])

def prediction_uprava_kategoricke_na_numericke(data, conn, id_modelu):
    cur = conn.cursor()
    cur.execute('SELECT encoder FROM prediction_models WHERE id = %s', (id_modelu,))
    conn.commit()
    if (cur.rowcount == 0):
        print("Nepodarilo sa najst encoder")
        return 1
    encoder = pickle.loads(cur.fetchone()[0].tobytes())
    
    kategoricke = data.select_dtypes(include = ['object'])
    transformovane = encoder.transform(kategoricke)
    transf_data_df = pd.DataFrame(transformovane.toarray())
    transf_data_df.columns = encoder.get_feature_names()
    numericke = data.select_dtypes(include=['float64', 'int64'])
    final_data = pd.merge(numericke, transf_data_df, left_index=True, right_index=True)
    return final_data

def uprava_znamok_pre_binarnu_klas(vyber):
    vyber.loc[vyber["PREDMET_VYSLEDOK"] == 'A', ["PREDMET_VYSLEDOK"]] = 0.0
    vyber.loc[vyber["PREDMET_VYSLEDOK"] == 'B', ["PREDMET_VYSLEDOK"]] = 0.0
    vyber.loc[vyber["PREDMET_VYSLEDOK"] == 'C', ["PREDMET_VYSLEDOK"]] = 0.0
    vyber.loc[vyber["PREDMET_VYSLEDOK"] == 'D', ["PREDMET_VYSLEDOK"]] = 0.0
    vyber.loc[vyber["PREDMET_VYSLEDOK"] == 'E', ["PREDMET_VYSLEDOK"]] = 1.0
    vyber.loc[vyber["PREDMET_VYSLEDOK"] == 'FX', ["PREDMET_VYSLEDOK"]] = 1.0
    vyber.loc[vyber["PREDMET_VYSLEDOK"] == 'FN', ["PREDMET_VYSLEDOK"]] = 1.0
    return vyber

  


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
    model = request.args.get('model')
    app.logger.error('%s rok', rok)
    app.logger.error('model: %s', model)
    conn = psycopg2.connect(host="localhost", port = database_port, database=database_name, user=database_user, password=database_password)
    cur = conn.cursor()

    #vytiahnutie dat o studentoch z databazy
    cur.execute("""
        SELECT ais_admissions."AIS_ID", "Meno", "Priezvisko", "Body_celkom", "Body", "Pohlavie", okres, kraj, typ_skoly, celkove_hodnotenie, maturity, matematika, vyucovaci_jazyk, mimoriadne_vysledky, nezamestnanost_absolventov, "prijimanie_na_VS", pedagogicky_zbor, financne_zdroje, "Mat_SJ", "Mat_M", poc_ucitelov
        FROM ais_admissions
        LEFT JOIN ineko_schools i on ais_admissions.school_id = i.kod_kodsko
        LEFT JOIN ineko_total_ratings on i.kod_kodsko = ineko_total_ratings.school_id
        LEFT JOIN ineko_percentils ip on i.kod_kodsko = ip.school_id
        WHERE ais_admissions."OBDOBIE" = %s AND (ais_admissions."Rozh" = 10 OR ais_admissions."Rozh" = 11) AND ais_admissions."Štúdium" = 'áno' AND ais_admissions.stupen_studia = 'Bakalársky'

    """, (rok,))
    conn.commit()

    app.logger.error('%d', cur.rowcount)
    data = DataFrame(cur.fetchall())
    data.columns = [desc[0] for desc in cur.description]

    meno_priezvisko = data[["AIS_ID", "Meno", "Priezvisko"]]    #toto si z dat odlozim a na konci k tomu prilepim predikciu
    data.drop(columns = ["AIS_ID", "Meno", "Priezvisko"], inplace=True)
    data = prediction_predspracovanie(data)
    prediction_imputers_transform(data, model, conn)        #pouzitie imputerov
    final_data = prediction_uprava_kategoricke_na_numericke(data, conn, model)

    cur.execute('SELECT model FROM prediction_models WHERE id = %s', (model,))
    conn.commit()

    loaded_model = pickle.loads(cur.fetchone()[0].tobytes())

    predicted = loaded_model.predict(final_data)
    meno_priezvisko["predikovana_hodnota"] = predicted
    rizikovi = meno_priezvisko[meno_priezvisko['predikovana_hodnota'] == 1]



    return json.dumps (rizikovi.to_json(orient='records'))
    

if __name__ == "__main__":
    app.run()

