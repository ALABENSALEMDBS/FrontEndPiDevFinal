import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tactic } from 'src/core/models/tactic';

@Injectable({
  providedIn: 'root'
})
export class TacticService {

  constructor(private http:HttpClient) { }

   getAlltactic(): Observable<tactic[]> {
      return this.http.get<tactic[]>("http://localhost:8089/PiDevBackEndProject/tactics/retrieve-all-tactics");
    }
  
    deltactic(id:any):Observable<tactic[]>{
  
      return this.http.delete<tactic[]>("http://localhost:8089/PiDevBackEndProject/tactics/remove-tactics/"+id)
   }

  
  // getbyidsousgroup(idSousGroup:any):Observable<sousgroup[]>{
  //   return this.http.get<sousgroup[]>(this.apiUrlGetById+'/'+idSousGroup)
  // }
  
  // addsousgroup(sg:sousgroup):Observable<sousgroup[]>{
  //   return this.http.post<sousgroup[]>("http://localhost:8089/PiDevBackEndProject/sousGroupes/add-sousGroupes",sg)
  // }
}
