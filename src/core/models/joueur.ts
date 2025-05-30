import { Rapport } from "./rapport";

export class Joueurs {

  idUser!: number;
    nameUsers!: string;
    prenomUser!: string;
    emailUser!: string;
    telephoneUser!: string;
    photoUser!: string | null; // Assuming photoUser can be null
    posteJoueur!: string;
    numeroJoueur!: number;
    debutContratJoueur!: Date;
    finContratJoueur!: Date;
    rapports?: Rapport[];
    tituliare!: boolean;

}
