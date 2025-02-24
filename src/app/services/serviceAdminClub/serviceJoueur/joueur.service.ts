import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Joueurs } from 'src/core/models/joueur';

@Injectable({
  providedIn: 'root'
})
export class JoueurService {

  constructor(private http:HttpClient) { }
  private apiUrl = 'http://localhost:8089/PiDevBackEndProject/joueurs/retrieve-all-joueurs'; // Remplace par l'URL correcte de ton backend

    getAllJoueurs(): Observable<Joueurs[]> {
      return this.http.get<Joueurs[]>(this.apiUrl);
    }

    addJoueur(j:Joueurs):Observable<Joueurs[]>{
      return this.http.post<Joueurs[]>("http://localhost:8089/PiDevBackEndProject/joueurs/add-joueurs",j)
    }
}
