import { Clubs } from "./clubs";

export class Match {
  idMatch!: number;
  resultatMatch!: string;
  dateMatch!: string;  // Nouveau attribut pour la date du match
  lieuMatch!: string;  // Nouveau attribut pour le lieu du match
  statusMatch!: string; // Nouveau attribut pour l'état du match (par exemple "en cours", "terminé")
  typeMatch!: string;   // Nouveau attribut pour le type du match (par exemple "amical", "championnat")
  arbitre!: string;
  equipe1!: string;
  equipe2!: string;
  club1!: Clubs;
  club2!: Clubs
  displayPicture!: string;

}
