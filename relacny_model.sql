CREATE TABLE attendances_types { -- ucast
	ID Serial,

	PRIMARY KEY(ID)
}

CREATE TABLE high_school_type { -- druh SŠ
	ID Serial,

	PRIMARY KEY(ID)
}

CREATE TABLE forms_of_study { -- Forma
	ID Serial,
	name varchar(256),

	PRIMARY KEY(ID)
}

CREATE TABLE subjects { -- predmety
	ID Serial, 
	PREDMET varchar(256),
	KOD varchar(256),
	KREDITY integer,

	PRIMARY KEY(ID)
}

CREATE TABLE students {
	AIS_ID Serial,
	MENO varchar(256) NOT NULL,
	PRIEZVISKO varchar(256) NOT NULL,
	STUDIUM varchar(256) NOT NULL,
	ROCNIK integer,

	PRIMARY KEY(AIS_ID)
}

CREATE TABLE attendances {
	ID Serial,
	AIS_ID integer REFERENCES students(AIS_ID),
	ROZVRHOVA_AKCIA_ID integer REFERENCES rozvrhova_akcia(id),
	UCAST_ID integer REFERENCES ucast(id),

	OBDOBIE varchar(256),
	KOD varchar(256),
	PREDMET varchar(256), -- mozno do ciselnika,
	PORADI integer,

	PRIMARY KEY(ID)
}

CREATE TABLE admissions {
	ID Serial,
	Adresa_trvalého_pobytu varchar(256),
	Alt_pr_1 varchar(256),
	Alternatívy_program_1 varchar(256),
	Body numeric,
	Body_celkom numeric,
	Druh_SŠ varchar(256), -- asi ciselnik
	E-mail varchar(256),
	Et varchar(256),  --neviem co zmanena, mozno pokus? 
	Fakulta varchar(256),	-- tento atribut by som asi yvhodil, kedze robime system len pre fiit,
	Forma varchar(256), -- mozno ciselnik
	Forma_1 varchar(256), -- takisto mozno nepotrebny atribut - rovnake info ako Forma ale kratsie
	Kompl varchar(256), -- neviem co znamena, ale asi ci je prihlaska kompletna
	Kont_adr_-_pozn varchar(256), -- asi poznamka k kontaktnej adrese? nestastný nazov asi by som vyhodil nema pre nas moc prinos
	Kont_adr_-_obec varchar(256), -- upravit pomlcku
	Kont_adr_-okres varchar(256),
	Kont_adr_-_ulica varchar(256),
	Kont_adr_-_ulica_1 varchar(256), -- asi by som vyhodil, lebo rovnake info ma Kont_adr_-_ulica ale ma navyse cislo domu
	Kont_adr_-_štát varchar(256),
	Kontaktná_adresa varchar(256), -- kontaktne atributy by som mozno vyohdilkvoli tomuto atributu kde je vsetko v jednom, nepotrebujeme to mat rozdelene do jedneho
	Kontaktný_tel varchar(256),
	Maturita varchar(256),
	Maturita_1 varchar(256), --rok maturity
	MENO varchar(256), -- moozno nebude potrebne, lebo cez AIS ID foreign key to namapujeme (uvidime)
	Metóda varchar(256), -- to iste co forma, netreba
	Miesto_narodenia varchar(256),
	Miesto_výučby varchar(256), -- asi nepotrebne, kazdy z FIIT studuje v BA 
	Modifikácia_PK varchar(256), -- konvertovat na boolean asi
	Najvyššie_dosiahnuté_vzdelanie varchar(256),
	Narodenie varchar(256),
	Občianstvo varchar(256),
	Odbor_SŠ varchar(256),
	Odkiaľ_sa_hlási varchar(256),
	Odvolanie varchar(256), -- prekonvertovať na boolean
	PSČ varchar(256),
	PSČ_1 varchar(256), -- to iste čo PSČ
	Pohlavie varchar(256),
	Por integer,
	Používateľ_(podľa_RČ) varchar(256), -- obsahuje AIS ID - možme považovať za foreign key k tabulke študentov po rozparsovaní
	Prevedené varchar(256),
 	Priemer_SŠ varchar(256), -- je dane ako string, asi radšej ako numeric
 	Priemer_SŠ_1 varchar(256), -- to isté ako Priemer_SŠ, len tam je vždy +0,01 - nerozumiem
 	Priezvisko varchar(256), -- v prípade, že budeme mat AIS ID ako foreign key možme vyhodit
 	Prijatie_na_program varchar(256), -- na aký program bol študent prijatý
 	Prijatie_na_program_1 varchar(256), -- to isté ako Prijatie_na_program ale v dlhom tvare
 	Prijaté varchar(256), 
 	Program varchar(256), 
 	Program_1 varchar(256),
 	Program_2 varchar(256), -- dané tri programy su to iste len inak zapísané
 	Reg_č varchar(256),
 	Rodné_číslo varchar(256),
 	Rozh integer,	-- pojde z ciselniku, v Rozhodnutie_o_prijatí su vysvetlene tie cisla
 	Rozhodnutie_o_prijatí varchar(256),
 	Stav varchar(256),
 	Stredná_škola varchar(256),	-- obsahuje aj adresu - toto asi vyhodime, lebo adresu mame v samostatnom atribute
 	Stredná_škola_(adresa) varchar(256),
 	Stredná_škola_1 varchar(256), -- bez adresy
 	Súhlas_ZS varchar(256),
 	SŠ_(kód) integer,
 	Trv_pobyt_-_obec varchar(256),
 	Trv_pobyt_-_okres varchar(256),
 	Trv_pobyt_-_pozn varchar(256), -- vymazat
 	Trv_pobyt_-_ulica varchar(256), -- ponechat obsahuje aj cislo domu
 	Trv_pobyt_-_ulica_1 varchar(256), -- zmazat - toto info mame v Trv_pobyt_-_ulica
 	Trv_pobyt_-_štát varchar(256), 
 	Trvalý_pobyt_-_obec varchar(256), -- duplikatny udaj s Trv_pobyt_-_obec
 	Zapl varchar(256), --previest na boolean
 	č_d integer, -- asi enpotrebujeme - obsiahnute v poličku s adresou
 	č_d_1 integer, -- rovnake ako č_D
 	Študijný_odbor varchar(256), -- asi v milion atributoch predtým,
 	Štúdium varchar(256), -- neviem co znamena, ak ponechame, tak prevedieme na boolean

 	PRIMARY KEY(ID)
}

CREATE TABLE grades {
	ID Serial,
	AIS_ID integer REFERENCES students(AIS_ID),
	PREDMET_ID integer REFERENCES subjects(ID),
	RCS varchar(256), -- neviem čo znamena
	ZAP_VYSLEDOK varchar(256), -- mozno by som zmenil na boolean
	PREDMET_VYSLEDOK varchar(256), -- asi zbytočne davat do číselnika
	POCET_ZAPISOV integer,


	PRIMARY KEY(ID),
}

CREATE TABLE schools {
	ID Serial,
	okres varchar(256),
	kraj varchar(256),
	zriadovatel varchar(256),
	druh_skoly varchar(256),
	jazyk varchar(256),
	typ_skoly varchar(256),
	nazov varchar(256),
	ulica varchar(256),
	obec varchar(256),
	PSC varchar(256),
	sur_x varchar(256),
	sur_y varchar(256),
	tel_predvobla varchar(256),
	tel_cislo varchar(256),
	tel_cislo2 varchar(256),
	tel_cislo3 varchar(256),
	fax_cislo varchar(256),
	email varchar(256),
	email2 varchar(256),
	email3 varchar(256),
	adresa_www varchar(256),
	kod_kodsko varchar(256),
	postih varchar(256),
	postih1_nazov varchar(256),
	postih2_nazov varchar(256),
	postih3_nazov varchar(256),
	postih4_nazov varchar(256),

	PRIMARY KEY(ID)
}