import { Exercices } from "./exercice"

export class seance{
  dateSeance(dateSeance: any) {
    throw new Error("Method not implemented.")
  }
  idSeance!: number
  titleSeance!: string
  jourSeance!: string
  heureDebut!: string
  heureFin!: string
  typeSeance!: string
  description!: string
  location!: string
  durationMinutes!: number
  intensityLevel!: number
  exercises!: Exercices[];  // Liste des exercices liés (remplacé par un tableau d'objets)

  }
  
  
  