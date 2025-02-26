import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coach } from 'src/core/models/coach';

@Injectable({
  providedIn: 'root'
})
export class GerercoatchService {

  constructor(private http:HttpClient) { }

  private apiUrl ='http://localhost:8089/PiDevBackEndProject/users/retrieve-all-user'
      getAllCach(): Observable<Coach[]> {
        return this.http.get<Coach[]>(this.apiUrl);
      }

      addCoach(c:Coach):Observable<Coach[]>{
        return this.http.post<Coach[]>("http://localhost:8089/PiDevBackEndProject/users/add-user",c)
      }

      delCoach(id:any):Observable<Coach[]>{
          return this.http.delete<Coach[]>("http://localhost:8089/PiDevBackEndProject/users/remove-user"+"/"+id)
      }

        getbyidCoach(idUser:any):Observable<Coach[]>{
          return this.http.get<Coach[]>( "http://localhost:8089/PiDevBackEndProject/users/retrieve-user/"+idUser)
        }


        updateCoach(idUser:any,coach:Coach):Observable<Coach[]>{
          return this.http.put<Coach[]>("http://localhost:8089/PiDevBackEndProject/users/modify-user"+'/'+idUser,coach)
        }
}
