import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface WeatherResponse {
  description: string;
  temperature: number;
  city: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'http://localhost:8089/PiDevBackEndProject/api/weather';

  constructor(private http: HttpClient) {}

  getWeather(lat: number, lon: number): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(`${this.apiUrl}?lat=${lat}&lon=${lon}`);
  }

}
