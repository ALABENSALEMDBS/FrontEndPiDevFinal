import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Clubs } from '../../../../core/models/clubs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClubsService {

  constructor(private http:HttpClient) { }

  private apiUrl = 'http://localhost:8089/PiDevBackEndProject/club/allClubs'; // Remplace par l'URL correcte de ton backend
  private apiUrlDeletee='http://localhost:8089/PiDevBackEndProject/club/remove-club';
  private apiUrlUpDate='http://localhost:8089/PiDevBackEndProject/club/modify-matchs';
  private apiUrlGetById='http://localhost:8089/PiDevBackEndProject/club/retrieve-matchs';


  private apiUrlll = 'http://localhost:8089/PiDevBackEndProject/club'; 



    getAllClubs(): Observable<Clubs[]> {
       return this.http.get<Clubs[]>(this.apiUrl);
     }


     deleteClub(id: number): Observable<void> {
      console.log("Sending DELETE request for club with ID:", id); // Vérifie l'ID dans la console
      return this.http.delete<void>(`http://localhost:8089/PiDevBackEndProject/club/remove-club/${id}`);
    }
    

  //      // Method to delete a club
  // deleteClub(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/remove-club/${id}`);
  // }
     
  
    //  delClubs(id:any):Observable<Clubs[]>{ // ce quoi l'erreue da NullInjector Error dans Angular
    //     return this.http.delete<Clubs[]>("http://localhost:8089/PiDevBackEndProject/club/remove-club"+"/"+id)
    // }

    // delClubs(id: any): Observable<void> {
    //   return this.http.delete<void>(`http://localhost:8089/PiDevBackEndProject/club/remove-club/${id}`);
    // }

      // delExercices(id:any):Observable<Exercices[]>{
      //   return this.http.delete<Exercices[]>("http://localhost:8089/PiDevBackEndProject/Exercices/remove-exercices"+"/"+id)
      // }
    


    updateClubs(id:any,res:Clubs):Observable<Clubs[]>{
     return this.http.put<Clubs[]>(this.apiUrlUpDate +'/'+id,res)
   }
  
  
    getbyidClubs(idSousGroup:any):Observable<Clubs[]>{
     return this.http.get<Clubs[]>(this.apiUrlGetById+'/'+idSousGroup)
   }
  
    addClubs(m:Clubs):Observable<Clubs[]>{
     return this.http.post<Clubs[]>("http://localhost:8089/PiDevBackEndProject/club/add-matchs",m)
   }
  
  
    createClubs(clubsData: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('club', JSON.stringify(clubsData));  // Match data as JSON
    formData.append('file', file);  // The image file
  
    return this.http.post<any>("http://localhost:8089/PiDevBackEndProject/club/saveClub", formData);
  }




}
