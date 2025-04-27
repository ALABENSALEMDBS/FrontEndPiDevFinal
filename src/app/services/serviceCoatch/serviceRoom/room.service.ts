import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from 'src/core/models/Room ';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private apiUrl = `http://localhost:8089/PiDevBackEndProject/api/rooms`;

  constructor(private http: HttpClient) { }

  createRoom(name: string): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, { name });
  }

  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }

  getActiveRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/active`);
  }

  getRoom(id: string): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  activateRoom(id: string): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivateRoom(id: string): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/${id}/deactivate`, {});
  }
}
