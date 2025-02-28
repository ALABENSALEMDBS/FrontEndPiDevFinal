import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rapport } from 'src/core/models/rapport';

@Injectable({
  providedIn: 'root'
})
export class RapportService {

  constructor(private http:HttpClient) { }


 getAllRapport(): Observable<Rapport[]> {
    return this.http.get<Rapport[]>("http://localhost:8089/PiDevBackEndProject/rapports/retrieve-all-rapports");
  }
  
  delRapport(id:any):Observable<Rapport[]>{
    return this.http.delete<Rapport[]>("http://localhost:8089/PiDevBackEndProject/rapports/remove-rapports"+"/"+id)
  }
  
  
  addRapport(f:Rapport):Observable<Rapport[]>{
    return this.http.post<Rapport[]>("http://localhost:8089/PiDevBackEndProject/rapports/add-rapports",f)
  }
  
  
  getbyidRapport(idseance:any):Observable<Rapport[]>{
    return this.http.get<Rapport[]>( "http://localhost:8089/PiDevBackEndProject/rapports/retrieve-rapports/"+idseance)
  }
  
  
  updateRapport(id:any,seance:Rapport):Observable<Rapport[]>{
    return this.http.put<Rapport[]>("http://localhost:8089/PiDevBackEndProject/rapports/modify-rapports"+'/'+id,seance)
  }
}
