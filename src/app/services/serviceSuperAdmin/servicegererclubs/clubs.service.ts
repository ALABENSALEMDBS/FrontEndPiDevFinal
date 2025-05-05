// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Clubs } from '../../../../core/models/clubs';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ClubsService {

//   private baseUrl = 'http://localhost:8089/PiDevBackEndProject/club';

//   constructor(private http: HttpClient) {}

//   getAllClubs(): Observable<Clubs[]> {
//     return this.http.get<Clubs[]>(`${this.baseUrl}/allClubs`);
//   }

//   deleteClub(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.baseUrl}/remove-club/${id}`);
//   }

//   // updateClub(id: any, club: Clubs): Observable<Clubs[]> {
//   //   return this.http.put<Clubs[]>(`${this.baseUrl}/modify-club/${id}`, club);
//   // }


//   /*updateClub(idClub: number, formData: FormData): Observable<any> {
//     return this.http.put<any>(`${this.baseUrl}/modify-club/${idClub}`, formData);
//   }*/
  

// // In ClubsService
// getClubById(id: number): Observable<Clubs> {
//   return this.http.get<Clubs>(`${this.baseUrl}/retrieve-club/${id}`);
// }


//   addClubs(club: Clubs): Observable<Clubs[]> {
//     return this.http.post<Clubs[]>(`${this.baseUrl}/add-club`, club);
//   }


//   //hedhi
//   createClubs(clubsData: any, file: File): Observable<any> {
//     const formData = new FormData();
//     formData.append('club', JSON.stringify(clubsData));
//     formData.append('file', file);
//     return this.http.post<any>(`${this.baseUrl}/saveClub`, formData);
//   }
  

//   /*updateClub(clubId: number, clubsData: any, file?: File): Observable<any> {
//     const formData = new FormData();
//     formData.append('club', JSON.stringify(clubsData));
//     if (file) {
//       formData.append('file', file);
//     }
//     return this.http.put<any>(`${this.baseUrl}/updateClub/${clubId}`, formData);
//   }*/
  


  // getImage(filename: string): Observable<Blob> {
  //   const cleanFilename = filename.replace(/^\.\/uploadss\\/i, ''); 
  //   return this.http.get(`http://localhost:8089/PiDevBackEndProject/club/uploads/${cleanFilename}`, { responseType: 'blob' });
  // }
  // uploadPostPicture(postId: number, file: File) {
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   return this.http.post(`${this.baseUrl}/picture/${postId}`, formData, {
  //     reportProgress: true,
  //     observe: 'events'
  //   });
  // }


//   updateClub(clubId: number, clubsData: any): Observable<any> {
//     return this.http.put<any>(`${this.baseUrl}/updateClub/${clubId}`, clubsData);
//   }
  
// }
















import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
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

  // Create a new club (without image)
  createClubs(club: Clubs): Observable<Clubs> {
    return this.http.post<Clubs>(`${this.baseUrl}/updateClub/0`, club);
  }

  // Update club
  updateClub(id: number, club: Clubs): Observable<Clubs> {
    return this.http.put<Clubs>(`${this.baseUrl}/updateClub/${id}`, club);
  }

  // Upload club logo
  uploadPostPicture(postId: number, file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.baseUrl}/picture/${postId}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  // Get image as blob
  getImage(filename: string): Observable<Blob> {
    const cleanFilename = filename.replace(/^\.\/uploadss\\/i, ''); 
    return this.http.get(`${this.baseUrl}/uploads/${cleanFilename}`, { responseType: 'blob' });
  }

  // Delete club
  deleteClub(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/remove-club/${id}`);
  }

  // Helper method to get image URL from mediaUrl
  getImageUrl(mediaUrl: string | undefined): string {
    if (!mediaUrl) return 'assets/images/default-club-logo.png';
    
    // Extract filename from path
    const cleanFilename = mediaUrl.replace(/^\.\/uploadss\\/i, '');
    return `${this.baseUrl}/uploads/${cleanFilename}`;
  }
}