import { ExerciseType } from "./ExerciseType";
import { seance } from "./seance";
import { sousgroup } from "./sousgroup";

export class Exercices {
  idExercice!: number;
  nameExercice!: string;
  descriptionExercice!: string;
  videoExercice!: string;
  photoExercice!: string;
  seanceExercice!: seance; // Ajout de la relation avec Seance
  sousGroupExercice!: sousgroup; // Ajout de la relation avec SousGroup
  exercicetype!:ExerciseType
}

