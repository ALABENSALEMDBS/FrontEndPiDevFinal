// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Cup } from 'src/core/models/cup';
// import { Match } from 'src/core/models/match';


// @Injectable({
//   providedIn: 'root',
// })
// export class CupService {
//   private apiUrl = 'http://localhost:8089/PiDevBackEndProject/cup'; // Cup API URL

//   constructor(private http: HttpClient) {}

//   // Get all cups
//   getAllCups(): Observable<Cup[]> {
//     return this.http.get<Cup[]>(`${this.apiUrl}/all`);
//   }

//   // Get cup by ID
//   getCupById(id: number): Observable<Cup> {
//     return this.http.get<Cup>(`${this.apiUrl}/retrieve-cup/${id}`);
//   }

//   // Create a new cup
//   createCup(name: string, clubIds: number[]): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/createCup`, { name, clubIds });
//   }

//   // Delete cup
//   deleteCup(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/deleteCup/${id}`);
//   }

//   // Get matches of a cup grouped by round
//   getMatchesByRound(id: number): Observable<Record<string, Match[]>> {
//     return this.http.get<Record<string, Match[]>>(`${this.apiUrl}/cups/${id}/matches-by-round`);
//   }

//   // Generate next round
//   generateNextRound(id: number): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/next-round/${id}`, {});
//   }

//   // Update match goals
//   updateMatchGoals(matchId: number, goals1: number, goals2: number): Observable<Match> {
//     return this.http.put<Match>(`${this.apiUrl}/update-match-goals/${matchId}`, { goals1, goals2 });
//   }
// }









import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Clubs } from 'src/core/models/clubs';
import { Cup } from 'src/core/models/cup';
import { Match } from 'src/core/models/match';

@Injectable({
  providedIn: 'root',
})
export class CupService {
  private apiUrl = 'http://localhost:8089/PiDevBackEndProject/cup'; // Cup API URL

  constructor(private http: HttpClient) { }

  // Get all cups
  /*getAllCups(): Observable<Cup[]> {
    return this.http.get<Cup[]>(`${this.apiUrl}/getAllCups`);
  }*/


  getAllCups(): Observable<Cup[]> {
    return this.http.get<Cup[]>(`${this.apiUrl}/getAllCups`);
  }

  // Get cup by ID
  getCupById(id: number): Observable<Cup> {
    return this.http.get<Cup>(`${this.apiUrl}/getCup/${id}`);
  }

  // Create a new cup with participating clubs
  createCup(cupData: { name: string, clubIds: number[] }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createCup`, cupData);
  }

  // Delete a cup
  deleteCup(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteCup/${id}`);
  }

  // Generate next round matches
  generateNextRound(cupId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/next-round/${cupId}`, {});
  }


  // Get matches grouped by round
  getMatchesByRound(cupId: number): Observable<Record<string, Match[]>> {
    return this.http.get<Record<string, Match[]>>(`${this.apiUrl}/cups/${cupId}/matches-by-round`);
  }


  // Get participating clubs
  getParticipatingClubs(cupId: number): Observable<Clubs[]> {
    return this.http.get<Clubs[]>(`${this.apiUrl}/getParticipatingClubs/${cupId}`);
  }


  // Update cup
  updateCup(id: number, cup: Cup): Observable<Cup> {
    return this.http.put<Cup>(`${this.apiUrl}/updateCup/${id}`, cup);
  }

  
}