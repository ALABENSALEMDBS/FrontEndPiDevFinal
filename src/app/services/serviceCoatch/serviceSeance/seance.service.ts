import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import type { Observable } from "rxjs"
import type { Exercices } from "src/core/models/exercice"
import type { seance } from "src/core/models/seance"

@Injectable({
  providedIn: "root",
})
export class SeanceService {
  private baseUrl = "http://localhost:8089/PiDevBackEndProject/seances"
  private exercicesUrl = "http://localhost:8089/PiDevBackEndProject/Exercices"

  constructor(private http: HttpClient) {}

  getAllSeances(): Observable<seance[]> {
    return this.http.get<seance[]>(`${this.baseUrl}/retrieve-all-seances`)
  }

  delSeances(id: any): Observable<seance[]> {
    return this.http.delete<seance[]>(`${this.baseUrl}/remove-seances/${id}`)
  }

  addSeances(f: seance): Observable<seance[]> {
    return this.http.post<seance[]>(`${this.baseUrl}/add-seances`, f)
  }

  getbyidSeances(idseance: any): Observable<seance[]> {
    return this.http.get<seance[]>(`${this.baseUrl}/retrieve-seances/${idseance}`)
  }

  updateSeances(id: any, seance: seance): Observable<seance[]> {
    return this.http.put<seance[]>(`${this.baseUrl}/modify-seances/${id}`, seance)
  }

  // Fixed URL duplication issue
  affecterExercisesASeance(idSeance: number, exerciceIds: number[]): Observable<void> {
    const url = `${this.baseUrl}/affecter-exerciseaseance/${idSeance}/${exerciceIds.join(",")}`
    return this.http.post<void>(url, {})
  }

  // Changed back to GET since the backend uses @GetMapping
  findBySeanceExerciceIdSeance(seanceId: number): Observable<Exercices[]> {
    return this.http.get<Exercices[]>(`${this.exercicesUrl}/findBySeanceExerciceIdSeance/${seanceId}`)
  }
  private apiUrl = 'http://localhost:8089/PiDevBackEndProject/sousGroupes'; // Remplacez par l'URL de votre backend
  private apiUrl1 = 'http://localhost:8089/PiDevBackEndProject/seances/'; // Remplacez par l'URL de votre backend
  private apiUrl2 = 'http://localhost:8089/PiDevBackEndProject/joueurs/'; // Remplacez par l'URL de votre backend

  findSousGroupesJoueurs(idExercice: number): Observable<any> {
    return this.http.get(`${this.apiUrl1}/findSousGroupesJoueurs/${idExercice}`);
  }

  findSousGroupesidExercice(idExercice: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/findSousGroupesidExercice/${idExercice}`);
  }

  findSousGroupesJoueursSeance(idExercice: number): Observable<any> {
    return this.http.get(`${this.apiUrl2}/findSousGroupesJoueurs/${idExercice}`);
  }
  desafecterMultipleExercisesToSeance(idExercice: number,idSeance: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/desafecterMultipleExercisesToSeance/${idExercice}/${idSeance}`);
  }
  // Added method to get all exercises
  getAllExercices(): Observable<Exercices[]> {
    return this.http.get<Exercices[]>(`${this.exercicesUrl}/retrieve-all-exercices`)
  }



  findBySeanceId(seanceId: number): Observable<Exercices[]> {
    return this.http.get<Exercices[]>(`${this.exercicesUrl}/findBySeanceExercice_IdSeance/${seanceId}`);
  }

  findExercicesWithNoSeance(): Observable<Exercices[]> {
    return this.http.get<Exercices[]>(`${this.exercicesUrl}/findExercicesWithNoSeance`);
  }

  findExercicesAssignedToOtherSeances(seanceId: number): Observable<Exercices[]> {
    return this.http.get<Exercices[]>(`${this.exercicesUrl}/findExercicesAssignedToOtherSeances/${seanceId}`);
  }

  findAvailableExercices(seanceId: number): Observable<Exercices[]> {
    return this.http.get<Exercices[]>(`${this.exercicesUrl}/findAvailableExercices/${seanceId}`);
  }
  getCompatibleExercices(seanceId: number): Observable<Exercices[]> {
    return this.http.get<Exercices[]>(`${this.exercicesUrl}/compatible/${seanceId}`);
  }
}

