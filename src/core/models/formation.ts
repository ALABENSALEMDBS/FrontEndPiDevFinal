import { Joueurs } from "./joueur";
import { tactic } from "./tactic";

export class formation{
    idFormation!: number;
    nameFormation!: string;
    descriptionFormation!: string;

    tactics?: tactic[];
    joueurs?: Joueurs[];
    }
