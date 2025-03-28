import { Joueurs } from "./joueur";


export class StatistiqueIndiv {
    idStatistiqueIndiv!: number;
    vitesseStatistiqueIndiv!: number;
    endurenceStatistiqueIndiv!: string;
    buts!: number;
    passesDecisives!: number;
    tirs!: number;
    tirsCadres!: number;
    tacles!: number;
    fautesCommises!: number;
    cartonsJaunes!: number;
    cartonsRouges!: number;
    passesReussies!: number;
    dribblesReussis!: number;
    duelsGagnes!: number;
    distanceParcourue!: number;

    joueurstatistiqueIndiv!: Joueurs;
}