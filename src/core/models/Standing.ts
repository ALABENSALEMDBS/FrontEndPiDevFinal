import { Clubs } from "./clubs";
import { Competition } from "./competition";

export interface Standing {
  id: number;
  club: Clubs;
  competition: Competition;
  points: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}