import { Match } from "./match";


export interface Competition {
  idCompetition: number
  nameCompetition: string
  TypeC: string
  matchesTournoi?: Match[];

}
