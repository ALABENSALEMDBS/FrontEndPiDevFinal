import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercices } from 'src/core/models/exercice';

@Injectable({
  providedIn: 'root'
})
export class ExerciceService {

  constructor(private http:HttpClient) { }


  getAllExercices(): Observable<Exercices[]> {
    return this.http.get<Exercices[]>("http://localhost:8089/PiDevBackEndProject/Exercices/retrieve-all-exercices");
  }

  delExercices(id:any):Observable<Exercices[]>{
    return this.http.delete<Exercices[]>("http://localhost:8089/PiDevBackEndProject/Exercices/remove-exercices"+"/"+id)
  }


  addExercices(e:Exercices):Observable<Exercices[]>{
    return this.http.post<Exercices[]>("http://localhost:8089/PiDevBackEndProject/Exercices/add-exercices",e)
  }

  getbyidExercices(idExercices:any):Observable<Exercices[]>{
    return this.http.get<Exercices[]>( "http://localhost:8089/PiDevBackEndProject/Exercices/retrieve-exercices/"+idExercices)
  }


  updateExercices(idExercices:any,Exercices:Exercices):Observable<Exercices[]>{
    return this.http.put<Exercices[]>("http://localhost:8089/PiDevBackEndProject/Exercices/modify-exercices"+'/'+idExercices,Exercices)
  }
}
