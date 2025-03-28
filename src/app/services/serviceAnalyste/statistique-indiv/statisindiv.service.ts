import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatistiqueIndiv } from 'src/core/models/StatistiqueIndiv';

@Injectable({
  providedIn: 'root'
})
export class StatisindivService {

  constructor(private http:HttpClient) { }

  //http://localhost:8089/PiDevBackEndProject/statistiqueIndiv/getStatistiqueIndivByJoueurNumero/{{numeroJoueur}}

  getStatIndivByNumeroJoueur( numerojoueur: number): Observable<StatistiqueIndiv[]> {
      return this.http.get<StatistiqueIndiv[]>("http://localhost:8089/PiDevBackEndProject/statistiqueIndiv/getStatistiqueIndivByJoueurNumero/"+numerojoueur);
    }
}
