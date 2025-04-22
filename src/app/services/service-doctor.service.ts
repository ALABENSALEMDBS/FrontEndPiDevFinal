import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Consultation } from 'src/core/models/Consultation';
import { ExerciceRetablissements } from 'src/core/models/ExerciceRetablissement';
import { FicheMedical } from 'src/core/models/ficheMedical';
import { Joueur } from 'src/core/models/Joueurs';
import { Nouriture } from 'src/core/models/nouriture';

@Injectable({
  providedIn: 'root'
})
export class ServiceDoctorService {
  private apiUrl = 'http://localhost:8089/PiDevBackEndProject';

  constructor( private http:HttpClient) { }

  //ubdate creatiche fiche 

  // addFicheMedical(ficheMedical: FicheMedical, name: string, prenom: string): Observable<FicheMedical> {
  //   return this.http.post<FicheMedical>(`${this.apiUrl}/${name}/${prenom}`, ficheMedical, {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  //   });
  // }
  // addFicheMedicalByIdJoueurs(ficheMedicale: FicheMedical): Observable<FicheMedical> {
  //   return this.http.post<FicheMedical>(`${this.apiUrl}/add`, ficheMedicale);
  // }
  // addFicheMedical(ficheMedical: FicheMedical, idPlayer: number): Observable<FicheMedical> {
  //   return this.http.post<FicheMedical>(`${this.apiUrl}/FicheMedicales/addfichebyplayer/${idPlayer}`, ficheMedical);
  // }
  
  addFicheMedical(ficheMedical: FicheMedical, idPlayer: number,idExerciceRetablissement:number): Observable<FicheMedical> {
    return this.http.post<FicheMedical>(`${this.apiUrl}/FicheMedicales/add-FicheMedicales/${idPlayer}/${idExerciceRetablissement}`, ficheMedical); }


    
     updateFicheMedical(ficheMedical: FicheMedical): Observable<FicheMedical> {
          return this.http.put<FicheMedical>(`${this.apiUrl}/FicheMedicales/modify-ficheMedicales`, ficheMedical);
        }

getalljoueur():Observable<Joueur[]>{
  return this.http.get<Joueur[]>(`${this.apiUrl}/joueurs/retrieve-all-joueurs`);
}


getAllJoueurWithoutFiche():Observable<Joueur[]>{
  return this.http.get<Joueur[]>(`${this.apiUrl}/joueurs/retrieve-all-joueurs-without-fiche`);
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


  //nouriture create
  addnouriture(nouriture:Nouriture):Observable<Nouriture>{
    return this.http.post<Nouriture>(`${this.apiUrl}/Nouriture/add-nouriture`,nouriture
      
    );
  }

//delete nouriture 

deletNouriturebyid(idNourriture :number): Observable<void[]>{
  return this.http.delete<void[]>(`${this.apiUrl}/Nouriture/remove-nouriture/${idNourriture}`);
}


//getAllnouriture
getAllNouriture(): Observable<Nouriture[]> {
  return this.http.get<Nouriture[]>(`${this.apiUrl}/Nouriture/retrieve-all-nouriture`);
}

//get by id nouriture
getNouritureById(id: number): Observable<Nouriture> {
  return this.http.get<Nouriture>(`${this.apiUrl}/Nouriture/retrieve-nouriture/${id}`);
}

//updatenouriture

updateNourritures(nouriture: Nouriture): Observable<Nouriture> {
  return this.http.put<Nouriture>(`${this.apiUrl}/Nouriture/modify-nouriture`, nouriture);
}

//uploade-file-exerciceretablissement
// upload CSV file
uploadExerciceFile(file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post(`${this.apiUrl}/files/upload`, formData, {
    responseType: 'text' // pour retourner juste un message
  });
}


//chartjs pourcentage de gravite player 
getGraviteStatsByPlayer(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/FicheMedicales/count-by-gravite`);
  
}

//consultation
addConsultation(consultation: Consultation): Observable<Consultation> {
  return this.http.post<Consultation>(`${this.apiUrl}/consultation/add`, consultation);
}

getAllConsultations(): Observable<Consultation[]> {
  return this.http.get<Consultation[]>(`${this.apiUrl}/consultation/all`);
}
updateConsultation(consultation: Consultation): Observable<Consultation> {
  return this.http.put<Consultation>(
    `${this.apiUrl}/consultation/update/${consultation.id}`,
    consultation
  );

}}
