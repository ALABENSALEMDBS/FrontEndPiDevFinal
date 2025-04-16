import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { Clubs } from "src/core/models/clubs"
import { Competition } from "src/core/models/competition"
import { Match } from "src/core/models/match"
// import type { HttpClient } from "@angular/common/http"
// import type { Observable } from "rxjs"
// import type { Competition } from "src/core/models/competition"
// //import { environment } from "src/environments/environment"
// import type { Match } from "src/core/models/match"
// import type { Clubs } from "src/core/models/clubs"

@Injectable({
  providedIn: "root",
})
export class CompetitionService {
  //private apiUrl = environment.apiUrl + "/competition"

  private apiUrl = "http://localhost:8089/PiDevBackEndProject/competition" // Update with your backend URL


  constructor(private http: HttpClient) {}

  // Get all competitions
  getAllCompetitions(): Observable<Competition[]> {
    return this.http.get<Competition[]>(`${this.apiUrl}/allCompetition`)
  }

  // Get competition by ID
  getCompetitionById(id: number): Observable<Competition> {
    return this.http.get<Competition>(`${this.apiUrl}/retrieve-competition/${id}`)
  }

  // Create a new competition
  createCompetition(competitionData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createCompetition`, competitionData)
  }

  // Update competition
  updateCompetition(competition: Competition): Observable<Competition> {
    return this.http.put<Competition>(`${this.apiUrl}/modify-club`, competition)
  }

  // Delete competition
  deleteCompetition(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-club/${id}`)
  }

  // Get matches of a competition
  getMatchesOfCompetition(id: number): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/getMatchsOfCompetition/${id}`)
  }

  // Get participating clubs of a competition
  getParticipatingClubs(id: number): Observable<Clubs[]> {
    return this.http.get<Clubs[]>(`${this.apiUrl}/getParticipatedClubs/${id}`)
  }

  // Get participating club names of a competition
  getParticipatingClubNames(id: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/getParticipatedClubsNames/${id}`)
  }
}
