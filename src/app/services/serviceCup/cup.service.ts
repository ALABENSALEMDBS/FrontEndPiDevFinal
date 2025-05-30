// // import { HttpClient } from '@angular/common/http';
// // import { Injectable } from '@angular/core';
// // import { Observable } from 'rxjs';
// // import { Cup } from 'src/core/models/cup';
// // import { Match } from 'src/core/models/match';


// // @Injectable({
// //   providedIn: 'root',
// // })
// // export class CupService {
// //   private apiUrl = 'http://localhost:8089/PiDevBackEndProject/cup'; // Cup API URL

// //   constructor(private http: HttpClient) {}

// //   // Get all cups
// //   getAllCups(): Observable<Cup[]> {
// //     return this.http.get<Cup[]>(`${this.apiUrl}/all`);
// //   }

// //   // Get cup by ID
// //   getCupById(id: number): Observable<Cup> {
// //     return this.http.get<Cup>(`${this.apiUrl}/retrieve-cup/${id}`);
// //   }

// //   // Create a new cup
// //   createCup(name: string, clubIds: number[]): Observable<any> {
// //     return this.http.post<any>(`${this.apiUrl}/createCup`, { name, clubIds });
// //   }

// //   // Delete cup
// //   deleteCup(id: number): Observable<void> {
// //     return this.http.delete<void>(`${this.apiUrl}/deleteCup/${id}`);
// //   }

// //   // Get matches of a cup grouped by round
// //   getMatchesByRound(id: number): Observable<Record<string, Match[]>> {
// //     return this.http.get<Record<string, Match[]>>(`${this.apiUrl}/cups/${id}/matches-by-round`);
// //   }

// //   // Generate next round
// //   generateNextRound(id: number): Observable<any> {
// //     return this.http.post<any>(`${this.apiUrl}/next-round/${id}`, {});
// //   }

// //   // Update match goals
// //   updateMatchGoals(matchId: number, goals1: number, goals2: number): Observable<Match> {
// //     return this.http.put<Match>(`${this.apiUrl}/update-match-goals/${matchId}`, { goals1, goals2 });
// //   }
// // }









// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { Clubs } from 'src/core/models/clubs';
// import { Cup } from 'src/core/models/cup';
// import { Match } from 'src/core/models/match';

// @Injectable({
//   providedIn: 'root',
// })
// export class CupService {
//   private apiUrl = 'http://localhost:8089/PiDevBackEndProject/cup'; // Cup API URL

//   constructor(private http: HttpClient) { }

//   // Get all cups
//   /*getAllCups(): Observable<Cup[]> {
//     return this.http.get<Cup[]>(`${this.apiUrl}/getAllCups`);
//   }*/


//   getAllCups(): Observable<Cup[]> {
//     return this.http.get<Cup[]>(`${this.apiUrl}/getAllCups`);
//   }

//   // Get cup by ID
//   getCupById(id: number): Observable<Cup> {
//     return this.http.get<Cup>(`${this.apiUrl}/getCup/${id}`);
//   }

//   // Create a new cup with participating clubs
//   createCup(cupData: { name: string, clubIds: number[] }): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/createCup`, cupData);
//   }

//   // Delete a cup
//   deleteCup(id: number): Observable<any> {
//     return this.http.delete<any>(`${this.apiUrl}/deleteCup/${id}`);
//   }

//   // Generate next round matches
//   generateNextRound(cupId: number): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/next-round/${cupId}`, {});
//   }





//   // // Get matches grouped by round
//   // getMatchesByRound(cupId: number): Observable<Record<string, Match[]>> {
//   //   return this.http.get<Record<string, Match[]>>(`${this.apiUrl}/cups/${cupId}/matches-by-round`);
//   // }


//   // // Get participating clubs
//   // getParticipatingClubs(cupId: number): Observable<Clubs[]> {
//   //   return this.http.get<Clubs[]>(`${this.apiUrl}/getParticipatingClubs/${cupId}`);
//   // }


//   // // Update cup
//   // updateCup(id: number, cup: Cup): Observable<Cup> {
//   //   return this.http.put<Cup>(`${this.apiUrl}/updateCup/${id}`, cup);
//   // }




  
//   // Get matches grouped by round
//   getMatchesByRound(cupId: number): Observable<Record<string, Match[]>> {
//     return this.http.get<Record<string, Match[]>>(`${this.apiUrl}/cups/${cupId}/matches-by-round`).pipe(
//       catchError((error) => {
//         console.error(`Error fetching matches by round for cup ID ${cupId}:`, error)
//         return throwError(() => new Error("Failed to load matches. Please try again."))
//       }),
//     )
//   }

//   // Get all matches for a cup
//   getMatchesOfCup(cupId: number): Observable<Match[]> {
//     return this.http.get<Match[]>(`${this.apiUrl}/getMatchesOfCup/${cupId}`).pipe(
//       catchError((error) => {
//         console.error(`Error fetching matches for cup ID ${cupId}:`, error)
//         return throwError(() => new Error("Failed to load matches. Please try again."))
//       }),
//     )
//   }

//   // Get participating clubs
//   getParticipatingClubs(cupId: number): Observable<Clubs[]> {
//     return this.http.get<Clubs[]>(`${this.apiUrl}/getParticipatingClubs/${cupId}`).pipe(
//       catchError((error) => {
//         console.error(`Error fetching participating clubs for cup ID ${cupId}:`, error)
//         return throwError(() => new Error("Failed to load participating clubs. Please try again."))
//       }),
//     )
//   }

//   // Update cup
//   updateCup(id: number, cup: Cup): Observable<Cup> {
//     return this.http.put<Cup>(`${this.apiUrl}/modify-cup/${id}`, cup).pipe(
//       catchError((error) => {
//         console.error(`Error updating cup with ID ${id}:`, error)
//         return throwError(() => new Error("Failed to update cup. Please try again."))
//       }),
//     )
//   }

//   // Get the winner ID of the cup
// getWinnerId(cupId: number): Observable<number | null> {
//   return this.http.get<number | null>(`${this.apiUrl}/getCupWinner/${cupId}`).pipe(
//     catchError((error) => {
//       console.error(`Error fetching winner ID for cup ID ${cupId}:`, error);
//       return throwError(() => new Error("Failed to fetch winner ID. Please try again."));
//     })
//   );
// }


  
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

  getAllCups(): Observable<Cup[]> {
    return this.http.get<Cup[]>(`${this.apiUrl}/getAllCups`).pipe(
      catchError(this.handleError)
    );
  }

  getCupById(id: number): Observable<Cup> {
    return this.http.get<Cup>(`${this.apiUrl}/getCup/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createCup(cupData: { name: string, clubIds: number[] }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createCup`, cupData).pipe(
      catchError(this.handleError)
    );
  }

  deleteCup(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteCup/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  generateNextRound(cupId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/next-round/${cupId}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  getMatchesByRound(cupId: number): Observable<Record<string, Match[]>> {
    return this.http.get<Record<string, Match[]>>(`${this.apiUrl}/cups/${cupId}/matches-by-round`).pipe(
      catchError(this.handleError)
    );
  }

  getMatchesOfCup(cupId: number): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/getMatchesOfCup/${cupId}`).pipe(
      catchError(this.handleError)
    );
  }

  getParticipatingClubs(cupId: number): Observable<Clubs[]> {
    return this.http.get<Clubs[]>(`${this.apiUrl}/getParticipatingClubs/${cupId}`).pipe(
      catchError(this.handleError)
    );
  }

  updateCup(id: number, cup: Cup): Observable<Cup> {
    return this.http.put<Cup>(`${this.apiUrl}/modify-cup/${id}`, cup).pipe(
      catchError(this.handleError)
    );
  }

  getWinnerId(cupId: number): Observable<number | null> {
    return this.http.get<number | null>(`${this.apiUrl}/getCupWinner/${cupId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error(error);
    return throwError(() => new Error('An error occurred. Please try again.'));
  }
}
