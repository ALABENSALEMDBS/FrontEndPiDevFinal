import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tactic } from 'src/core/models/tactic';

@Injectable({
  providedIn: 'root'
})
export class TacticService {

  constructor(private http:HttpClient) { }

  private baseUrl = "http://localhost:8089/PiDevBackEndProject/tactics";


   getAlltactic(): Observable<tactic[]> {
      return this.http.get<tactic[]>("http://localhost:8089/PiDevBackEndProject/tactics/retrieve-all-tactics");
    }
  
    deltactic(id:any):Observable<tactic[]>{
  
      return this.http.delete<tactic[]>("http://localhost:8089/PiDevBackEndProject/tactics/remove-tactics/"+id)
   }


  
  addtactic(tac:tactic):Observable<tactic[]>{
    return this.http.post<tactic[]>("http://localhost:8089/PiDevBackEndProject/tactics/add-tactics",tac)
  }


  addtacticandAssignedFormation(tac:tactic , idFormation:number):Observable<tactic[]>{
    return this.http.post<tactic[]>("http://localhost:8089/PiDevBackEndProject/tactics/add-tactic-affecterFormation/"+idFormation, tac)
  }



  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);  // 'file' must match @RequestParam name on backend
    return this.http.post(`${this.baseUrl}/upload`, formData); //, { headers });
  }

}
