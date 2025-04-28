import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercices } from 'src/core/models/exercice';
import { Joueurs } from 'src/core/models/joueur';
import { Joueur } from 'src/core/models/Joueurs';
import { Rapport } from 'src/core/models/rapport';
import { seance } from 'src/core/models/seance';
import { sousgroup } from 'src/core/models/sousgroup';

@Injectable({
  providedIn: 'root'
})
export class RapportService {

  constructor(private http:HttpClient) { }
  private apiUrl = 'http://localhost:8089/PiDevBackEndProject/rapports';


  getAllExercices(): Observable<Exercices[]> {
      return this.http.get<Exercices[]>("http://localhost:8089/PiDevBackEndProject/Exercices/retrieve-all-exercices");
    }
    
 getAllRapport(): Observable<Rapport[]> {
    return this.http.get<Rapport[]>("http://localhost:8089/PiDevBackEndProject/rapports/retrieve-all-rapports");
  }
  
  delRapport(id:any):Observable<Rapport[]>{
    return this.http.delete<Rapport[]>("http://localhost:8089/PiDevBackEndProject/rapports/remove-rapports"+"/"+id)
  }
  getAllSeances(): Observable<seance[]> {
      return this.http.get<seance[]>("http://localhost:8089/PiDevBackEndProject/seances/retrieve-all-seances");
    }
  
  addRapport(rapport: Rapport, numeroJoueur: number, nameSousGroup: string, titleSeance: string): Observable<Rapport[]> {
    return this.http.post<Rapport[]>(
      `http://localhost:8089/PiDevBackEndProject/rapports/addRapports/${numeroJoueur}/${nameSousGroup}/${titleSeance}`,
      rapport
    );
  }
   getAllSousGroupes(): Observable<sousgroup[]> {
       return this.http.get<sousgroup[]>("http://localhost:8089/PiDevBackEndProject/sousGroupes/retrieve-all-sousGroupes");
     }
  
  getbyidRapport(idseance:any):Observable<Rapport[]>{
    return this.http.get<Rapport[]>( "http://localhost:8089/PiDevBackEndProject/rapports/retrieve-rapports/"+idseance)
  }
  getAllJoueurs(): Observable<Joueurs[]> {
    return this.http.get<Joueurs[]>('http://localhost:8089/PiDevBackEndProject/joueurs/retrieve-all-joueurs');
  }
  getRapportbynumerojoueur(numeroJoueur:any):Observable<Rapport[]>{
    return this.http.get<Rapport[]>( "http://localhost:8089/PiDevBackEndProject/rapports/show/"+numeroJoueur)
  }

  findJoueursRapports(idRapport: number, numeroJoueur: number): Observable<Rapport[]> {
    const url = `http://localhost:8089/PiDevBackEndProject/joueurs/findJoueursByidRapportnumeroJoueur/${idRapport}/${numeroJoueur}`;
    return this.http.get<Rapport[]>(url);
  }
  
  findJoueursRapportsnumeroJoueurposteJoueur(
    numeroJoueur: number,
    posteJoueur: string,
  ): Observable<Rapport[]> {
    const url = `http://localhost:8089/PiDevBackEndProject/joueurs/findJoueursRapportsnumeroJoueurposteJoueur/${numeroJoueur}/${posteJoueur}`
    return this.http.get<Rapport[]>(url)
  }
  
  findSousGroupestitleSeance(titleSeance:any):Observable<Rapport[]>{
    return this.http.get<Rapport[]>( "http://localhost:8089/PiDevBackEndProject/sousGroupes/findSousGroupestitleSeance/"+titleSeance)
  }

  findJoueursBynameSousGroup(nameSousGroup:any):Observable<Rapport[]>{
    return this.http.get<Rapport[]>( "http://localhost:8089/PiDevBackEndProject/joueurs/findJoueursBynameSousGroup/"+nameSousGroup)
  }  
  getRapportbytitleSeance(titleSeance:any):Observable<Rapport[]>{
    return this.http.get<Rapport[]>( "http://localhost:8089/PiDevBackEndProject/rapports/findRapportBytitleSeance/"+titleSeance)
  }  
  getRapportbytitleSousGroup(nameSousGroup:any):Observable<Rapport[]>{
    return this.http.get<Rapport[]>( "http://localhost:8089/PiDevBackEndProject/rapports/findRapportBySousGroupe/"+nameSousGroup)
  }  
 getjoueurbyidrapport(id:any):Observable<Joueurs[]>{
    return this.http.get<Joueurs[]>( "http://localhost:8089/PiDevBackEndProject/joueurs/getbyrapports/"+id)
  }  
  // Add this method to your RapportService
savePlayerComparison(comparisonData: any): Observable<any> {
  return this.http.post<any>('your-api-endpoint/player-comparisons', comparisonData);
}
  updateRapport(id:any,Rapport:Rapport):Observable<Rapport[]>{
    return this.http.put<Rapport[]>("http://localhost:8089/PiDevBackEndProject/rapports/modify-rapports"+'/'+id,Rapport)
  }
  getBestByPosteAndSeance(posteJoueur: string, titleSeance: string): Observable<Rapport> {
    const params = new HttpParams()
      .set('posteJoueur', posteJoueur)
      .set('titleSeance', titleSeance);
    return this.http.get<Rapport>(`${this.apiUrl}/meilleur/par-poste-et-seance`, { params });
  }

  // 2. Meilleur joueur par séance uniquement
  getBestBySeance(titleSeance: string): Observable<Rapport[]> {
    const params = new HttpParams().set('titleSeance', titleSeance);
    return this.http.get<Rapport[]>(`${this.apiUrl}/meilleur/par-seance`, { params });
  }

  // 3. Meilleur joueur par poste, séance, et sous-groupe
  getBestByPosteSeanceSousGroupe(posteJoueur: string, titleSeance: string, nomSousGroupe: string): Observable<Rapport> {
    const params = new HttpParams()
      .set('posteJoueur', posteJoueur)
      .set('titleSeance', titleSeance)
      .set('nomSousGroupe', nomSousGroupe);
    return this.http.get<Rapport>(`${this.apiUrl}/meilleur/par-poste-seance-sousgroupe`, { params });
  }

  // 4. Joueurs en mauvais état (BAD) par poste
  getBadReportsByPoste(poste: string): Observable<Rapport[]> {
    return this.http.get<Rapport[]>(`${this.apiUrl}/bad/poste/${poste}`);
  }

  getSimilarRapports(poste: string, numero: number): Observable<Rapport[]> {
    const params = new HttpParams()
      .set('poste', poste)
      .set('numero', numero.toString());

    return this.http.get<Rapport[]>(`${this.apiUrl}/similar`, { params });
  }

  getRapportsSuspectsEtatGood(poste: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/suspect/good/${poste}`);
  }

 
}
