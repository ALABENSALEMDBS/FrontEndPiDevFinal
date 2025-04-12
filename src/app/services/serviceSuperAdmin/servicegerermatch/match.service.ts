import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Match } from '../../../../core/models/match';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
 constructor(private http:HttpClient) { }
   private apiUrl = 'http://localhost:8089/PiDevBackEndProject/matchs/retrieve-all-Matchs'; // Remplace par l'URL correcte de ton backend
   private apiUrlDelete='http://localhost:8089/PiDevBackEndProject/matchs/remove-matchs';
   private apiUrlUpDate='http://localhost:8089/PiDevBackEndProject/matchs/modify-matchs';
   private apiUrlGetById='http://localhost:8089/PiDevBackEndProject/matchs/retrieve-matchs';


   getAllMatchs(): Observable<Match[]> {
     return this.http.get<Match[]>(this.apiUrl);
   }

   delMatchs(id:any):Observable<Match[]>{ // ce quoi l'erreue da NullInjector Error dans Angular

     return this.http.delete<Match[]>(this.apiUrlDelete+"/"+id)

  }

  updateMatchs(id:any,res:Match):Observable<Match[]>{
   return this.http.put<Match[]>(this.apiUrlUpDate +'/'+id,res)
 }

 


 getbyidMatchs(idSousGroup:any):Observable<Match[]>{
   return this.http.get<Match[]>(this.apiUrlGetById+'/'+idSousGroup)
 }

 addMatchs(m:Match):Observable<Match[]>{
   return this.http.post<Match[]>("http://localhost:8089/PiDevBackEndProject/matchs/add-matchs",m)
 }


 createMatch(matchData: any, file: File): Observable<any> {
  const formData = new FormData();
  formData.append('match', JSON.stringify(matchData));  // Match data as JSON
  formData.append('file', file);  // The image file

  return this.http.post<any>("http://localhost:8089/PiDevBackEndProject/matchs/saveMatch", formData);
}


}