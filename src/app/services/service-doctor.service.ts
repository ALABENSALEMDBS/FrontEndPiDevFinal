import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExerciceRetablissements } from 'src/core/models/ExerciceRetablissement';
import { FicheMedical } from 'src/core/models/ficheMedical';
import { Joueur } from 'src/core/models/Joueurs';

@Injectable({
  providedIn: 'root'
})
export class ServiceDoctorService {
  private apiUrl = 'http://localhost:8089/PiDevBackEndProject';

  constructor( private http:HttpClient) { }

  // addFicheMedicalByIdJoueurs(ficheMedicale: FicheMedical): Observable<FicheMedical> {
  //   return this.http.post<FicheMedical>(`${this.apiUrl}/add`, ficheMedicale);
  // }
  // addFicheMedical(ficheMedical: FicheMedical, idPlayer: number): Observable<FicheMedical> {
  //   return this.http.post<FicheMedical>(`${this.apiUrl}/FicheMedicales/addfichebyplayer/${idPlayer}`, ficheMedical);
  // }
  
  addFicheMedical(ficheMedical: FicheMedical, idPlayer: number): Observable<FicheMedical> {
       return this.http.post<FicheMedical>(`${this.apiUrl}/FicheMedicales/add-FicheMedicales/${idPlayer}`, ficheMedical);
     }

     updateFicheMedical(ficheMedical: FicheMedical): Observable<FicheMedical> {
          return this.http.put<FicheMedical>(`${this.apiUrl}/FicheMedicales/modify-ficheMedicales`, ficheMedical);
        }

getalljoueur():Observable<Joueur[]>{
  return this.http.get<Joueur[]>(`${this.apiUrl}/joueurs/retrieve-all-joueurs`);
}
  
  getFichesMedicales(): Observable<FicheMedical[]> {
    return this.http.get<FicheMedical[]>(`${this.apiUrl}/FicheMedicales/retrieve-all-ficheMedicales`);
  }

 //gett by id 
 getFicheMedicaleById(id: number): Observable<FicheMedical> {
  return this.http.get<FicheMedical>(`${this.apiUrl}/FicheMedicales/retrieve-ficheMedicales/${id}`);
}

deletfichemedicalbyid(id :number): Observable<void[]>{
  return this.http.delete<void[]>(`${this.apiUrl}/FicheMedicales/remove-ficheMedicales/${id}`);
}




  
  //creationexerciceretablissement
  addexercice(exerciceretablissement:ExerciceRetablissements):Observable<ExerciceRetablissements>{
    return this.http.post<ExerciceRetablissements>(`${this.apiUrl}/ExerciceRetablissements/add-exerciceRetablissements`,exerciceretablissement);
  }

  //lister 
  getAllExercices(): Observable<ExerciceRetablissements[]> {
    return this.http.get<ExerciceRetablissements[]>(`${this.apiUrl}/ExerciceRetablissements/retrieve-all-exerciceRetablissements`);
  }

  //delete get by id exercice 

  deletexercicebyid(exerciceId :number): Observable<void[]>{
    return this.http.delete<void[]>(`${this.apiUrl}/ExerciceRetablissements/remove-exerciceRetablissements/${exerciceId}`);
  }

  //update 
  // updateExercice(id: string, exerciceretablissement: ExerciceRetablissements): Observable<ExerciceRetablissements> {
  //   return this.http.put<ExerciceRetablissements>(`${this.apiUrl}/ExerciceRetablissements/modify-exerciceRetablissements/${id}`, exerciceretablissement);
  // }
  updateExercice(id: string, exerciceretablissement: ExerciceRetablissements): Observable<ExerciceRetablissements> {
    // Retirer idExerciceRetablissement de l'objet exerciceretablissement pour éviter la duplication
    const { idExerciceRetablissement, ...rest } = exerciceretablissement;
  
    // Ajouter l'ID à l'objet sans duplication
    const requestPayload = { idExerciceRetablissement: id, ...rest };
  
    return this.http.put<ExerciceRetablissements>(`${this.apiUrl}/ExerciceRetablissements/modify-exerciceRetablissements`, requestPayload);
  }
  

  //gett by id 
  getExerciceById(id: number): Observable<ExerciceRetablissements> {
    return this.http.get<ExerciceRetablissements>(`${this.apiUrl}/ExerciceRetablissements/retrieve-exerciceRetablissements/${id}`);
  }
}
