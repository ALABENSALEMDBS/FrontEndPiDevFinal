import { EtatPlayer } from "./EtatPlayer";
import { Joueurs } from "./joueur";
import { seance } from "./seance";
import { sousgroup } from "./sousgroup";

export class Rapport {
    idRapport!: number;             // Unique identifier (int)
    speedRapport!: number;          // Speed report
    accelerationRapport!: number;   // Acceleration report
    endurance!: number;             // Stamina over time
    muscularEndurance!: number;     // Muscle fatigue resistance
    aerobicCapacity!: number;       // Oxygen efficiency
    anaerobicCapacity!: number;     // Short burst power

    // Strength-based attributes
    strength!: number;              // Maximum force
    power!: number;                 // Strength + speed
    explosiveness!: number;         // Ability to produce a powerful movement instantly
    verticalJump!: number;          // Jump height
    horizontalJump!: number;        // Horizontal jump distance
    agility!: number;               // Quick direction changes
    balance!: number;               // Stability
    coordination!: number;          // Efficient synchronization of body movements
    reactionTime!: number;          // Time to respond
    reactivity!: number;            // Adjusting movements

    etatRapport!: EtatPlayer;           // State of the report (string)
    blessureRapport!: string;       // Injury report (string)
    joueurrapport?: Joueurs;
    dateRapport!: Date;           // State of the report (string) 
    sousGroupesrapport?: sousgroup;
    seancesrapport?: seance;
  joueursrapport: Joueurs | undefined;

}
