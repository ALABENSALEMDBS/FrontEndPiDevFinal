import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { seance } from 'src/core/models/seance';

@Injectable({
  providedIn: 'root'
})
export class SeanceService {

  constructor(private http:HttpClient) { }


  getAllSeances(): Observable<seance[]> {
    return this.http.get<seance[]>("http://localhost:8089/PiDevBackEndProject/seances/retrieve-all-seances");
  }
  
  delSeances(id:any):Observable<seance[]>{
    return this.http.delete<seance[]>("http://localhost:8089/PiDevBackEndProject/seances/remove-seances"+"/"+id)
  }
  
  
  addSeances(f:seance):Observable<seance[]>{
    return this.http.post<seance[]>("http://localhost:8089/PiDevBackEndProject/seances/add-seances",f)
  }
  
  
  getbyidSeances(idseance:any):Observable<seance[]>{
    return this.http.get<seance[]>( "http://localhost:8089/PiDevBackEndProject/seances/retrieve-seances/"+idseance)
  }
  
  
  updateSeances(id:any,seance:seance):Observable<seance[]>{
    return this.http.put<seance[]>("http://localhost:8089/PiDevBackEndProject/seances/modify-seances"+'/'+id,seance)
  }
}
