import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private baseUrl = 'http://localhost:8089/PiDevBackEndProject/api/videos';

  constructor(private http: HttpClient) {}

  uploadVideo(file: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, 'recorded-video.webm');
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  getAllVideos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/all`);
  }

  streamVideo(filename: string): string {
    return `${this.baseUrl}/stream/${filename}`;
  }
}
