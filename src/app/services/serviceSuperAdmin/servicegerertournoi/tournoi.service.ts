import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tournois } from 'src/core/models/tournois';

@Injectable({
  providedIn: 'root'
})
export class TournoiService {

  constructor(private http:HttpClient) { }


  getAllTournoi(): Observable<Tournois[]> {
    return this.http.get<Tournois[]>("http://localhost:8089/PiDevBackEndProject/tournois/retrieve-all-tournois");
  }
  
  delTournoi(id:any):Observable<Tournois[]>{
    return this.http.delete<Tournois[]>("http://localhost:8089/PiDevBackEndProject/tournois/remove-tournois"+"/"+id)
  }
  
  
  addTournoi(t:Tournois):Observable<Tournois[]>{
    return this.http.post<Tournois[]>("http://localhost:8089/PiDevBackEndProject/tournois/add-tournois",t)
  }
  
  getbyidTournoi(id:any):Observable<Tournois[]>{
    return this.http.get<Tournois[]>( "http://localhost:8089/PiDevBackEndProject/tournois/retrieve-tournois/"+id)
  }
  
  
  updatetournoi(id:any,tournoi:Tournois):Observable<Tournois[]>{
    return this.http.put<Tournois[]>("http://localhost:8089/PiDevBackEndProject/tournois/modify-tournois"+'/'+id,tournoi)
  }
}
