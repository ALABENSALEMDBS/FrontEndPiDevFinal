// import { Clubs } from "./clubs";

import { Clubs } from "./clubs"
import { Competition } from "./competition"
import { Cup } from "./cup"

// export class Match {
//   idMatch!: number;
//   resultatMatch!: string;
//   dateMatch!: string;  // Nouveau attribut pour la date du match
//   lieuMatch!: string;  // Nouveau attribut pour le lieu du match
//   statusMatch!: string; // Nouveau attribut pour l'état du match (par exemple "en cours", "terminé")
//   typeMatch!: string;   // Nouveau attribut pour le type du match (par exemple "amical", "championnat")
//   arbitre!: string;
//   // equipe1!: string;
//   // equipe2!: string;
//   club1!: Clubs;
//   club2!: Clubs
//   goals1! :number;
//   goals2! :number;

//   //displayPicture!: string;

// }






export class Match {
  idMatch!: number
  resultatMatch!: string
  dateMatch!: string // Date of the match
  lieuMatch!: string // Location of the match
  statusMatch!: string // Status of the match (e.g., "in progress", "completed")
  typeMatch!: string // Type of the match (e.g., "friendly", "championship")
  arbitre!: string // Referee
  goals1!: number | null
  goals2!: number | null

  competition!: Competition | null;  
  club1!: Clubs
  club2!: Clubs



  cup?: Cup;
  roundName?: string | null;
  winner?: Clubs | undefined | null;


}

