export interface User {
  access: boolean
  admin?: boolean
  created_at?: any
  email: string
  id: number | string  // alebo sa da definovat
  updated_at?: any
}

export interface Exam {
  id: number;
  obdobie: string;
  celeMenoSTitulmi: string;
  riesitel: string;
  aisId: string;
  identifikaciaStudia: string; 
  obhajoba: string;
  zaverecnaPracaNazov: string;
  veduci: string;
  veduciY: string;
  oponent: string;
  stav: string;
  vspStudium: string | number;
  vspStudBpo: string | number;
  veduciHodnotenie: string;
  oponentHodnotenie: string;
  vysledneHodnotenie: string;
  studProg: string;
  dna: string;
  komisia: string;
  predseda: string;
  tajomnik: string;
  podozrenie?: string;
}

export interface ExamIng {
  id: number;
  obdobie: string;
  celeMenoSTitulmi: string;
  student: string;
  aisId: string;
  identifikaciaStudia: string; 
  obhajoba: string;
  zaverecnaPracaNazov: string;
  nazovDiplomPrace: string;
  veduci: string;
  veduciY: string;
  oponent: string;
  oponentY: string;
  stav: string;
  vspStudium: string | number;
  vspStudBpo: string | number;
  veduciHodnotenie: string;
  oponentHodnotenie: string;
  vysledneHodnotenie: string;
  studProg: string;
  datum: string;
  komisia: string;
  predseda: string;
  tajomnik: string;
  podozrenie?: string;
}

export interface Param {
  crVsp: number;
  crCelkovo: string
  pldVeduci?: string;
  pldOponent: string;
  pldCelkovo: string;
  pldNavrh: number;
  mclVsp: number;
  mclVeduci?: string;
  mclOponent: string;
  mclCelkovo: string;
  clVsp: number;
  clVeduci?: string;
  clOponent: string;
  clCelkovo: string;
}

export interface Student {
  id: number;
  obdobie: string;
  semester: string;
  aisId: number;
  celeMenoSTitulmi: string;
  rokAbsVs: number;
  stat: string;
  dlzkaPrerusMesiac: number;
  datumPrerusenia: string;
  datumSplnenia: string;
  roky: number;
  kodFinancovania: number;
  identifikStud: string;
  nastup: string;
  obhajoba: string;
  obdobie2: string;
  semester2: string;
  aisId2: number;
  celeMenoSTitulmi2: string;
  pohlavie: string;
  predmetyVysvedVysledky: string;
  studProg: string;
  prveStudium: string;
  rocnik: number;
  znamkaSZS: string;
  studPlan: string;
  titul: string;
  typUkoncenia: string;
  vyradenieDatum: string;
  druhZaverecnejPrace: string;
}
