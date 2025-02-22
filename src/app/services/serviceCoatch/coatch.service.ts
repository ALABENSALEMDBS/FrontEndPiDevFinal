import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { sousgroup } from 'src/core/models/sousgroup';
import { formation } from 'src/core/models/formation';

@Injectable({
  providedIn: 'root'
})
export class CoatchService {

  constructor(private http:HttpClient) { }
  private apiUrl = 'http://localhost:8089/PiDevBackEndProject/sousGroupes/retrieve-all-sousGroupes'; // Remplace par l'URL correcte de ton backend
  private apiUrlDelete='http://localhost:8089/PiDevBackEndProject/sousGroupes/remove-sousGroupes';
  private apiUrlUpDate='http://localhost:8089/PiDevBackEndProject/sousGroupes/modify-sousGroupes';
  private apiUrlGetById='http://localhost:8089/PiDevBackEndProject/sousGroupes/retrieve-sousGroupes';


  getAllSousGroupes(): Observable<sousgroup[]> {
    return this.http.get<sousgroup[]>(this.apiUrl);
  }

  delsousGroup(id:any):Observable<sousgroup[]>{ // ce quoi l'erreue da NullInjector Error dans Angular

    return this.http.delete<sousgroup[]>(this.apiUrlDelete+"/"+id)

 }

 updatesousgroup(id:any,res:sousgroup):Observable<sousgroup[]>{
  return this.http.put<sousgroup[]>(this.apiUrlUpDate +'/'+id,res)
}


getbyidsousgroup(idSousGroup:any):Observable<sousgroup[]>{
  return this.http.get<sousgroup[]>(this.apiUrlGetById+'/'+idSousGroup)
}

addsousgroup(sg:sousgroup):Observable<sousgroup[]>{
  return this.http.post<sousgroup[]>("http://localhost:8089/PiDevBackEndProject/sousGroupes/add-sousGroupes",sg)
}
//********************************************************** */

getAllFormation(): Observable<formation[]> {
  return this.http.get<formation[]>("http://localhost:8089/PiDevBackEndProject/Formations/retrieve-all-formation");
}

delFormation(id:any):Observable<formation[]>{
  return this.http.delete<formation[]>("http://localhost:8089/PiDevBackEndProject/Formations/remove-formation"+"/"+id)
}


addformation(f:formation):Observable<formation[]>{
  return this.http.post<formation[]>("http://localhost:8089/PiDevBackEndProject/Formations/add-formations",f)
}



}
