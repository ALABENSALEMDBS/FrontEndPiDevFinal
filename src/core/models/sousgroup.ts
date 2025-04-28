import { Exercices } from "./exercice";
import { Joueurs } from "./joueur";


export class sousgroup{
  idSousGroup!: number;
  nameSousGroup!: string;
  nbrJoueurSousGroup!: number;
  joueurs?: Joueurs[];
  exercices?: Exercices[];}


