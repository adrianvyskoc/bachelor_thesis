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
  riesitel: string;
  aisId: string;
  identifikaciaStudia: string; 
  obhajoba: string;
  zaverecnaPracaNazov: string;
  veduci: string;
  oponent: string;
  stav: string;
  vspStudium: string | number;
  vspStudBpo: string | number;
  veduciHodnotenie: string;
  oponentHodnotenie: string;
  vysledneHodnotenie: string;
  dna: string;
  komisia: string;
  predseda: string;
  tajomnik: string;
}
