// // import { Injectable } from '@angular/core';
// // import { Observable } from 'rxjs';
// // import { Match } from '../../../../core/models/match';
// // import { HttpClient } from '@angular/common/http';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class MatchService {
// //  constructor(private http:HttpClient) { }
// //    private apiUrl = 'http://localhost:8089/PiDevBackEndProject/matchs/retrieve-all-Matchs'; // Remplace par l'URL correcte de ton backend
// //    private apiUrlDelete='http://localhost:8089/PiDevBackEndProject/matchs/remove-matchs';
// //    private apiUrlUpDate='http://localhost:8089/PiDevBackEndProject/matchs/modify-matchs';
// //    private apiUrlGetById='http://localhost:8089/PiDevBackEndProject/matchs/retrieve-matchs';


// //    getAllMatchs(): Observable<Match[]> {
// //      return this.http.get<Match[]>(this.apiUrl);
// //    }

// //    delMatchs(id:any):Observable<Match[]>{ // ce quoi l'erreue da NullInjector Error dans Angular

// //      return this.http.delete<Match[]>(this.apiUrlDelete+"/"+id)

// //   }

// //   updateMatchs(id:any,res:Match):Observable<Match[]>{
// //    return this.http.put<Match[]>(this.apiUrlUpDate +'/'+id,res)
// //  }


// //  getbyidMatchs(idSousGroup:any):Observable<Match[]>{
// //    return this.http.get<Match[]>(this.apiUrlGetById+'/'+idSousGroup)
// //  }

// //  addMatchs(m:Match):Observable<Match[]>{
// //    return this.http.post<Match[]>("http://localhost:8089/PiDevBackEndProject/matchs/add-matchs",m)
// //  }


// //  createMatch(matchData: any, file: File): Observable<any> {
// //   const formData = new FormData();
// //   formData.append('match', JSON.stringify(matchData));  // Match data as JSON
// //   formData.append('file', file);  // The image file
// //   return this.http.post<any>("http://localhost:8089/PiDevBackEndProject/matchs/saveMatch", formData);
// // }


// // }
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Match } from '../../../../core/models/match';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class MatchService {
//   constructor(private http: HttpClient) {}

//   private baseUrl = 'http://localhost:8089/PiDevBackEndProject/matchs';

//   getAllMatchs(): Observable<Match[]> {
//     return this.http.get<Match[]>(`${this.baseUrl}/retrieve-all-Matchs`);
//   }

//   delMatchs(id: any): Observable<void> {
//     return this.http.delete<void>(`${this.baseUrl}/remove-matchs/${id}`);
//   }

//   updateMatchs(id: any, res: Match): Observable<Match> {
//     return this.http.put<Match>(`${this.baseUrl}/modify-matchs/${id}`, res);
//   }

//   getbyidMatchs(idSousGroup: any): Observable<Match> {
//     return this.http.get<Match>(`${this.baseUrl}/retrieve-matchs/${idSousGroup}`);
//   }

//   addMatchs(m: Match): Observable<Match> {
//     return this.http.post<Match>(`${this.baseUrl}/add-matchs`, m);
//   }

//   // ✅ UPDATED: Send only JSON body, no file
//   createMatch(matchData: Match): Observable<Match> {
//     return this.http.post<Match>(`${this.baseUrl}/saveMatch`, matchData);
//   }
// }



import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { Clubs } from "src/core/models/clubs"
import { Match } from "src/core/models/match"

@Injectable({
  providedIn: "root",
})
export class MatchService {
  private baseUrl = "http://localhost:8089/PiDevBackEndProject/matchs" // Update with your backend URL

  constructor(private http: HttpClient) {}

  // Get all clubs for dropdown selection
  getAllClubs(): Observable<Clubs[]> {
    return this.http.get<Clubs[]>(`${this.baseUrl.replace("/matchs", "/clubs")}/retrieve-all-clubs`)
  }

  // Create a new match
  createMatch(match: Match): Observable<Match> {
    return this.http.post<Match>(`${this.baseUrl}/saveMatch`, match)
  }

  // Get all matches
  getAllMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.baseUrl}/retrieve-all-Matchs`)
  }

  // Get match by ID
  getMatchById(id: number): Observable<Match> {
    return this.http.get<Match>(`${this.baseUrl}/retrieve-matchs/${id}`)
  }

  // Update match
  updateMatch(id: number, match: Match): Observable<Match> {
    return this.http.put<Match>(`${this.baseUrl}/modify-matchs/${id}`, match)
  }

  // Delete match
  deleteMatch(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-matchs/${id}`)
  }

  // Update goals
  updateGoals(id: number, goals1: number, goals2: number): Observable<Match> {
    return this.http.patch<Match>(`${this.baseUrl}/goals/${id}`, { goals1, goals2 })
  }

  // Get played matches
  getPlayedMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.baseUrl}/playedMatchs`)
  }

  // Get not yet played matches
  getNotYetPlayedMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.baseUrl}/notYedPlayedMatchs`)
  }
}
