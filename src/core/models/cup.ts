// // import { Match } from "./match";


// // export class Cup {
// //   idCup!: number;
// //   name!: string;
// //   matchs?: Match[];
// // }

// // // Interface for grouping matches by round
// // export interface MatchesByRound {
// //   [roundName: string]: Match[];
// // }

// // // Interface for cup creation request
// // export interface CupCreationRequest {
// //   name: string;
// //   clubIds: number[];
// // }





// import { Match } from './match';

// export class Cup {
//   idCup!: number;
//   name!: string;
//   matchesByRound?: Record<string, Match[]>;  // Using the same structure from your component
// }

// // Interface for grouping matches by round
// export interface MatchesByRound {
//   [roundName: string]: Match[];
// }

// // Interface for cup creation request
// export interface CupCreationRequest {
//   name: string;
//   clubIds: number[];
// }



// src/core/models/cup.ts
import { Clubs } from "./clubs";
import { Match } from "./match";

export class Cup {
  idCup!: number;
  name!: string;
  matchs?: Match[];
}
