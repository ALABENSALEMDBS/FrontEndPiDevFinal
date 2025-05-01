

export class FicheMedical {
  idFicheMedicale!: number;
  poidsFicheMedicale!: number; 
  tailleFicheMedicale!: number; 
  dateBlessure!: Date; 
  gravite!: string; 
  type!: string; 
  joueurId!: number;
  joueurficheMedicale: any;
  joueurNom?: string;  // Facultatif
  joueurPrenom?: string;  // Facultatif
  idExerciceRetablissement!: number;
  
  }