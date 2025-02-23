import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { sousgroup } from 'src/core/models/sousgroup';
import { formation } from 'src/core/models/formation';
import { seance } from 'src/core/models/seance';
import { Exercices } from 'src/core/models/exercice';

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
//**************************** formation ****************************** */

getAllFormation(): Observable<formation[]> {
  return this.http.get<formation[]>("http://localhost:8089/PiDevBackEndProject/Formations/retrieve-all-formation");
}

delFormation(id:any):Observable<formation[]>{
  return this.http.delete<formation[]>("http://localhost:8089/PiDevBackEndProject/Formations/remove-formation"+"/"+id)
}


addformation(f:formation):Observable<formation[]>{
  return this.http.post<formation[]>("http://localhost:8089/PiDevBackEndProject/Formations/add-formations",f)
}

getbyidformation(idFormation:any):Observable<formation[]>{
  return this.http.get<formation[]>( "http://localhost:8089/PiDevBackEndProject/Formations/retrieve-formations/"+idFormation)
}

updateformation(id:any,forma:formation):Observable<formation[]>{
  return this.http.put<formation[]>("http://localhost:8089/PiDevBackEndProject/Formations/modify-formations"+'/'+id,forma)
}

//********************************************************** */

getAllSeances(): Observable<seance[]> {
  return this.http.get<seance[]>("http://localhost:8089/PiDevBackEndProject/seances/retrieve-all-seances");
}

delSeances(id:any):Observable<seance[]>{
  return this.http.delete<seance[]>("http://localhost:8089/PiDevBackEndProject/seances/remove-seances"+"/"+id)
}


addSeances(f:seance):Observable<seance[]>{
  return this.http.post<seance[]>("http://localhost:8089/PiDevBackEndProject/seances/add-seances",f)
}


getbyidSeances(idseance:any):Observable<formation[]>{
  return this.http.get<formation[]>( "http://localhost:8089/PiDevBackEndProject/seances/retrieve-seances/"+idseance)
}


updateSeances(id:any,seance:seance):Observable<seance[]>{
  return this.http.put<seance[]>("http://localhost:8089/PiDevBackEndProject/seances/modify-seances"+'/'+id,seance)
}

//********************************************************** */

getAllExercices(): Observable<Exercices[]> {
  return this.http.get<Exercices[]>("http://localhost:8089/PiDevBackEndProject/Exercices/retrieve-all-exercices");
}

delExercices(id:any):Observable<Exercices[]>{
  return this.http.delete<Exercices[]>("http://localhost:8089/PiDevBackEndProject/Exercices/remove-exercices"+"/"+id)
}


addExercices(e:Exercices):Observable<Exercices[]>{
  return this.http.post<Exercices[]>("http://localhost:8089/PiDevBackEndProject/Exercices/add-exercices",e)
}

getbyidExercices(idExercices:any):Observable<formation[]>{
  return this.http.get<formation[]>( "http://localhost:8089/PiDevBackEndProject/Exercices/retrieve-exercices/"+idExercices)
}


updateExercices(idExercices:any,Exercices:Exercices):Observable<Exercices[]>{
  return this.http.put<Exercices[]>("http://localhost:8089/PiDevBackEndProject/Exercices/modify-exercices"+'/'+idExercices,Exercices)
}


}
