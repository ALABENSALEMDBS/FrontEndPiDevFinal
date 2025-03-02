import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Joueurs } from 'src/core/models/joueur';
import { Users } from 'src/core/models/Users';

@Injectable({
  providedIn: 'root'
})
export class JoueurService {

  constructor(private http:HttpClient) { }
  private apiUrl = 'http://localhost:8089/PiDevBackEndProject/joueurs/retrieve-all-joueurs'; // Remplace par l'URL correcte de ton backend
  private apiUrlUpDate='http://localhost:8089/PiDevBackEndProject/joueurs/modify-joueurs';

    getAllJoueurs(): Observable<Joueurs[]> {
      return this.http.get<Joueurs[]>(this.apiUrl);
    }

    addJoueur(j:Joueurs):Observable<Joueurs[]>{
      return this.http.post<Joueurs[]>("http://localhost:8089/PiDevBackEndProject/joueurs/add-joueurs",j)
    }
      updateJoueur(id:any,j:Joueurs):Observable<Joueurs[]>{
       return this.http.put<Joueurs[]>(this.apiUrlUpDate +'/'+id,j)
     }

     // Get joueur by numeroJoueur

    getbyidjoueur(numeroJoueur: number) {
      return this.http.get(`http://localhost:8089/PiDevBackEndProject/joueurs/retrieve-joueurs/${numeroJoueur}`);
}

  delJoueur(numeroJoueur: number):Observable<Joueurs[]>{
    return this.http.delete<Joueurs[]>("http://localhost:8089/PiDevBackEndProject/Exercices/remove-exercices"+"/"+numeroJoueur)
  }


//*************************************************** */
  getJoueursByIdformation(idFormation:any):Observable<Users[]>{
    return this.http.get<Users[]>( "http://localhost:8089/PiDevBackEndProject/Formations/retrieve-joueurs/"+idFormation)
  }

}
