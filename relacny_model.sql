-- POZNAMKY
    -- !!! pri importe pridat možnosť vytbrať si do ktorého semestra importujeme (ZS/LS ROK) !!
    -- percentily importovať uplne celé, nie len niektoré predmety
    -- staré dáta (napr. ked mením nieco na studentovi treba davat do historie - ais_students_history)

    -- ULOHY
      -- zjednotit parametre medzi tabulkami (aby sedeli dátové typy)
      -- studenta z pri importe prijimaciek pridat len ak nastupil a bol prijaty (atributy bunky BF - nastupil/nensatupil, BJ - prijaty/neprijaty)


-- KONIEC POZNAMOK

-- OTAZKY
    -- NA PISTEKA
      -- hodnoty za jednotlivé ukazovatele vs. doplnujuce udaje k hodnotam vyznam??

-- KONIEC OTAZOK

DROP TABLE ineko_additional_data;
DROP TABLE ineko_individual_pointers_values;

-- CISELNIKY

CREATE TABLE attendances_types (-- ucast
  ID   Serial,

  name varchar(255),

  PRIMARY KEY (ID)
);

CREATE TABLE high_school_type ( -- druh strednej skoly
  ID   Serial,

  name varchar(255),

  PRIMARY KEY (ID)
);

CREATE TABLE forms_of_study ( -- Forma
  ID   Serial,

  name varchar(255),

  PRIMARY KEY (ID)
);

CREATE TABLE schedule_action ( -- rozvrhova akcia
  ID   Serial,

  name varchar(255),

  PRIMARY KEY (ID)
);

-- INEKO tables -----------------------------------------------------------------------------------------

-- zdroj: http://skoly.ineko.sk/metodika/#data

CREATE TABLE ineko_schools (
  ID            Serial,

  okres         varchar(255),
  kraj          varchar(255),
  zriadovatel   varchar(255),
  druh_skoly    varchar(255),
  jazyk         varchar(255),
  typ_skoly     varchar(255),
  nazov         varchar(255),
  ulica         varchar(255),
  obec          varchar(255),
  PSC           varchar(255),
  sur_x         varchar(255),
  sur_y         varchar(255),
  tel_predvobla varchar(255),
  tel_cislo     varchar(255),
  tel_cislo2    varchar(255),
  tel_cislo3    varchar(255),
  fax_cislo     varchar(255),
  email         varchar(255),
  email2        varchar(255),
  email3        varchar(255),
  adresa_www    varchar(255),
  kod_kodsko    varchar(255),
  postih        varchar(255),
  postih1_nazov varchar(255),
  postih2_nazov varchar(255),
  postih3_nazov varchar(255),
  postih4_nazov varchar(255),

  PRIMARY KEY (ID)
);

CREATE TABLE ineko_total_rating (
  ID                         Serial,
  school_id                  integer REFERENCES ineko_schools (ID),

  typ                        varchar(255),  -- koncorocne/polrocne - pridat tuto možnosť pri importovani
  OBDOBIE                    varchar(255),  -- pozor, tu sa neurčuje semester, ale len školský rok
  celkove_hodnotenie         numeric,
  maturity                   numeric,
  testovanie9                numeric,
  matematika                 numeric,
  vyucovaci_jazyk            numeric,
  cudzie_jazyky              numeric,
  mimoriadne_vysledky        numeric,
  nezamestnanost_absolventov numeric,
  vysledky_inspekcie         numeric,
  ucasti_na_sutaziach        numeric,
  prijimanie_na_VS           numeric,
  pedagogicky_zbor           numeric,
  financne_zdroje            numeric,

  PRIMARY KEY (ID)
);

CREATE TABLE ineko_percentils (
  ID             Serial,
  school_id      integer REFERENCES ineko_schools (ID),

  typ            varchar(255),  -- koncorocne/polrocne - pridat tuto možnosť pri importovani
  OBDOBIE        varchar(255),  -- pozor, tu sa neurčuje semester, ale len školský rok
  Mat_SJ         numeric,
  Mat_M          numeric,
  Mat_MJ         numeric,
  Mat_SJaSL      numeric,
  Mat_AJB1       numeric,
  Mat_AJB2       numeric,
  Mat_AJC1       numeric,
  Mat_NJB1       numeric,
  Mat_NJB2       numeric,
  Mat_NJC1       numeric,
  T9_SJ          numeric,
  T9_M           numeric,
  T9_MJ          numeric,
  T9_SJaSL       numeric,
  riad_skoly     numeric,
  podm_VaV       numeric,
  VV_proces      numeric,
  insp_9R_SJ     numeric,
  insp_4R_Pri    numeric,
  insp_9r_Fyz    numeric,
  insp_9R_Pri    numeric,
  ucasti         numeric,
  Kom_M          numeric,
  Kom_SJ         numeric,
  mimo_vysl      numeric,
  nezam          numeric,
  nezam_okres    numeric,
  prijati_VS     numeric,
  uspesnost_VS   numeric,
  poc_ucitelov   numeric,
  IKT            numeric,
  kval           numeric,
  rozpocet       numeric,
  vlastne_zdroje numeric,

  PRIMARY KEY (ID)
);

CREATE TABLE ineko_additional_data (
  ID Serial,
  school_id      integer REFERENCES ineko_schools (ID),

  typ             varchar(255),  -- koncorocne/polrocne - pridat tuto možnosť pri importovani
  OBDOBIE         varchar(255),  -- pozor, tu sa neurčuje semester, ale len školský rok
  Mat_SJ          numeric,
  Mat_M           numeric,
  Mat_MJ          numeric,
  Mat_SJaSL       numeric,
  Mat_AJB1        numeric,
  Mat_AJB2        numeric,
  Mat_AJC1        numeric,
  Mat_NJB1        numeric,
  Mat_NJB2        numeric,
  Mat_NJC1        numeric,
  T9_SJ           numeric,
  T9_M            numeric,
  T9_MJ           numeric,
  T9_SJaSL        numeric,
  riad_skoly      numeric,
  podm_VaV        numeric,
  VV_proces       numeric,
  insp_9R_SJ      numeric,
  insp_4R_Pri     numeric,
  insp_9r_Fyz     numeric,
  insp_9R_Pri     numeric,
  ucasti          numeric,
  Kom_M           numeric,
  Kom_SJ          numeric,
  mimo_vysl       numeric,
  nezam           numeric,
  nezam_okres     numeric,
  prijati_VS      numeric,
  uspesnost_VS    numeric,
  poc_ucitelov    numeric,
  IKT             numeric,
  kval            numeric,
  rozpocet        numeric,
  vlastne_zdroje  numeric,

  PRIMARY KEY (ID)
);

CREATE TABLE ineko_individual_pointers_values (
  ID Serial,
  school_id      integer REFERENCES ineko_schools (ID),

  typ             varchar(255),  -- koncorocne/polrocne - pridat tuto možnosť pri importovani
  OBDOBIE         varchar(255),  -- pozor, tu sa neurčuje semester, ale len školský rok
  Mat_SJ          numeric,
  Mat_M           numeric,
  Mat_MJ          numeric,
  Mat_SJaSL       numeric,
  Mat_AJB1        numeric,
  Mat_AJB2        numeric,
  Mat_AJC1        numeric,
  Mat_NJB1        numeric,
  Mat_NJB2        numeric,
  Mat_NJC1        numeric,
  T9_SJ           numeric,
  T9_M            numeric,
  T9_MJ           numeric,
  T9_SJaSL        numeric,
  riad_skoly      numeric,
  podm_VaV        numeric,
  VV_proces       numeric,
  insp_9R_SJ      numeric,
  insp_4R_Pri     numeric,
  insp_9r_Fyz     numeric,
  insp_9R_Pri     numeric,
  ucasti          numeric,
  Kom_M           numeric,
  Kom_SJ          numeric,
  mimo_vysl       numeric,
  nezam           numeric,
  nezam_okres     numeric,
  prijati_VS      numeric,
  uspesnost_VS    numeric,
  poc_ucitelov    numeric,
  IKT             numeric,
  kval            numeric,
  rozpocet        numeric,
  vlastne_zdroje  numeric,

  PRIMARY KEY (ID)
);

-- AIS tables -----------------------------------------------------------------------------------------

CREATE TABLE ais_subjects ( -- predmety
  ID      Serial,

  PREDMET varchar(255),
  KOD     varchar(255),
  KREDITY integer,

  PRIMARY KEY (ID)
);

CREATE TABLE ais_subjects_history (
  ID      Serial,
  SUBJECT_ID integer REFERENCES ais_subjects(ID),

  PREDMET varchar(255),
  KOD     varchar(255),
  KREDITY integer,

  PRIMARY KEY (ID)
);

CREATE TABLE ais_students (
  AIS_ID     Serial,
  SCHOOL_ID  integer REFERENCES ineko_schools(ID),

  MENO       varchar(255),
  PRIEZVISKO varchar(255),
  STUDIUM    varchar(255),
  ROCNIK     integer,

  PRIMARY KEY (AIS_ID)
);

CREATE TABLE ais_students_history (
  AIS_ID     Serial,
  STUDENT_ID integer REFERENCES ais_students (AIS_ID),

  MENO varchar (255),
  PRIEZVISKO varchar(255),
  STUDIUM    varchar(255),
  ROCNIK     integer,

  PRIMARY KEY (AIS_ID)
);

CREATE TABLE ais_attendances (
  ID                 Serial,
  AIS_ID             integer REFERENCES ais_students(AIS_ID),
  ROZVRHOVA_AKCIA_ID integer REFERENCES schedule_action (id),
  UCAST_ID           integer REFERENCES attendances_types (ID),
  PREDMET_ID         integer REFERENCES ais_subjects (ID),

  OBDOBIE            varchar (255),
  KOD                varchar(255),
  PORADI             integer,

  PRIMARY KEY (ID)
);

CREATE TABLE ais_admissions (
  id                              Serial,
  AIS_ID                          integer references ais_students(AIS_ID),
  high_school_type_id             integer references  high_school_type(ID),

  Por                             integer,
  Priezvisko                      varchar(255),
  Meno                            varchar(255),
  Absolvovaná_VŠ                  varchar(255),
  Abs_VŠ_program_odbor_text       varchar(255),
  Abs_VŠ_program_odbor            varchar(255),
  Abs_VŠ                          varchar(255),
  Alt_pr_1                        varchar(255),
  Alternatívny_program_1          varchar(255),
  Body_celkom                     numeric,
  Body                            numeric,
  Narodenie                       varchar(255),
  Prevedené                       varchar(255),
  Prijaté                         varchar(255),
  Maturita                        varchar(255),
  -- Druh_SŠ varchar(255), namiesto tohto mame high_school_type_id
  E_mail                          varchar(255),
  Et                              varchar(255),
  Fakulta                         varchar(255),
  Forma                           varchar(255),
  Forma_1                         varchar(255),
  -- tu bolo id
  Kompl                           varchar(255),
  Kontaktná_adresa                varchar(255),
  č_d                             integer,
  Kontaktná_adresa_obec           varchar(255),
  Kont_adresa_obec                varchar(255),
  Kont_adresa_okres               varchar(255),
  Kont_adr_pozn                   varchar(255),
  PSČ                             varchar(255),
  Kont_adresa_štát                varchar(255),
  Kont_adresa_ulica               varchar(255),
  Kont_adresa_ulica_1             varchar(255),
  Kontaktný_tel                   varchar(255),
  Metóda                          varchar(255),
  Miesto_narodenia                varchar(255),
  Miesto_výučby                   varchar(255),
  Modifikácia_PK                  varchar(255),
  Najvyššie_dosiahnuté_vzdelanie  varchar(255),
  Občianstvo                      varchar(255),
  Odbor_na_SŠ                     varchar(255),
  Odbor_SŠ                        integer,
  Odkiaľ_sa_hlási                 varchar(255),
  Odvolanie                       varchar(255),
  --Používateľ_podľa_RČ varchar(255), - odtialto mame AIS_ID, je tam ešte meno ale to je už v atibutoch meno a priezvisko
  Pohlavie                        varchar(255),
  Štúdium                         varchar(255),
  Priemer_SŠ                      varchar(255),
  Priemer_SŠ_1                    varchar(255),
  Prijatie_na_program             varchar(255),
  Prijatie_na_program_1           varchar(255),
  Program                         varchar(255),
  Program_1                       varchar(255),
  Program_2                       varchar(255),
  Reg_č                           varchar(255),
  Stav                            varchar(255),
  Rodné_číslo                     varchar(255),
  Maturita_1                      integer,
  Rozhodnutie_o_prijatí           varchar(255), -- toto dame asi radšej do čiselníku (vypitat si od peta ake su tam ešte cisla
  Rozh                            integer,
  Stredná_škola                   varchar(255),
  Stredná_škola_adresa            varchar(255),
  SŠ_kód                          integer,
  Stredná_škola_1                 varchar(255),
  Stredná_škola_cudzinci          varchar(255),
  Súčasné_štúdium                 varchar(255),
  Súhlas_ZS                       varchar(255),
  Študijný_odbor                  varchar(255),
  Termín                          varchar(255),
  Čas                             varchar(255),
  Dátum                           varchar(255),
  Miestnosť                       varchar(255),
  Titul                           varchar(255),
  Titul_za                        varchar(255),
  Adresa_trvalého_pobytu          varchar(255),
  č_d_1                           integer,
  Trvalý_pobyt_obec               varchar(255),
  Trv_pobyt_obec                  varchar(255),
  Trv_pobyt_okres                 varchar(255),
  Trv_pobyt_pozn                  varchar(255),
  PSČ_1                           varchar(255),
  Trv_pobyt_štát                  varchar(255),
  Trv_pobyt_ulica                 varchar(255),
  Trv_pobyt_ulica_1               varchar(255),
  Predmety                        varchar(255),
  Zameranie                       varchar(255),
  Zapl                            varchar(255),
  Zvol_predmet                    varchar(255),
  Zvol_predmet_1                  varchar(255),

  PRIMARY KEY (id)
);

CREATE TABLE ais_grades (
  ID               Serial,
  AIS_ID           integer REFERENCES ais_students (AIS_ID),
  PREDMET_ID       integer REFERENCES ais_subjects (ID),

  OBDOBIE          varchar(255),
  RCS              varchar(255), -- rodné číslo
  ZAP_VYSLEDOK     varchar(255), -- mozno by som zmenil na boolean
  PREDMET_VYSLEDOK varchar(255),
  POCET_ZAPISOV    integer,

  PRIMARY KEY (ID)
);

CREATE TABLE ais_statnice_scenario (
  ID      Serial,

  OBDOBIE varchar (255)
);

