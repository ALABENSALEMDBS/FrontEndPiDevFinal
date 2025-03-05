import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { formation } from 'src/core/models/formation';

@Injectable({
  providedIn: 'root'
})
export class FormationService {

  constructor(private http:HttpClient) { }

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


  private apiUrl = 'http://localhost:8089/PiDevBackEndProject/Formations/affecter-joueursAFormation';

affecterjoueursAformation( idFormation: any, numeroJoueur: any[]): Observable<any[]> {
  const url = `${this.apiUrl}/${idFormation}`;

  return this.http.post<any[]>(url, numeroJoueur);
}


dessaffecterJoueurAFormation(idFormation:number, idJoueur:number):Observable<any[]>{
  return this.http.post<any[]>("http://localhost:8089/PiDevBackEndProject/Formations/desaffecterJoueurAFormation/"+idFormation+'/'+idJoueur,null);
}
}
