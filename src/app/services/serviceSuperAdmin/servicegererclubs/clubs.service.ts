import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Clubs } from 'src/core/models/clubs';

@Injectable({
  providedIn: 'root'
})
export class ClubsService {
  private baseUrl = 'http://localhost:8089/PiDevBackEndProject/club';

  constructor(private http: HttpClient) { }

  // Get all clubs
  getAllClubs(): Observable<Clubs[]> {
    return this.http.get<Clubs[]>(`${this.baseUrl}/allClubs`);
  }

  // Get club by ID
  getClubById(id: number): Observable<Clubs> {
    return this.http.get<Clubs>(`${this.baseUrl}/retrieve-club/${id}`);
  }

  // Create club with file in the same request
  createClubs(club: Clubs, file: File): Observable<Clubs> {
    // Create FormData and add both parts
    const formData = new FormData();
    
    // Convert the club object to JSON string
    const clubJson = JSON.stringify(club);
    
    // Add the club JSON as a part named 'club'
    formData.append('club', clubJson);
    
    // Add the file as a part named 'file'
    formData.append('file', file);
    
    return this.http.post<Clubs>(`${this.baseUrl}/saveClub`, formData);
  }

  // Update club
  updateClub(id: number, club: Clubs): Observable<Clubs> {
    return this.http.put<Clubs>(`${this.baseUrl}/updateClub/${id}`, club);
  }

  // Delete club
  deleteClub(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove-club/${id}`);
  }

  // Upload club logo (for update only)
  uploadPostPicture(clubId: number, file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/picture/${clubId}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  // Get image by filename
  getImage(filename: string): Observable<Blob> {
    // Extract filename from path if it's in the format "./uploadss\filename.png"
    const cleanFilename = filename.replace(/^\.\/uploadss\\/i, '');
    return this.http.get(`${this.baseUrl}/uploads/${cleanFilename}`, {
      responseType: 'blob'
    });
  }
}