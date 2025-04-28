// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Clubs } from '../../../../core/models/clubs';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ClubsService {

//   constructor(private http:HttpClient) { }

//   private apiUrl = 'http://localhost:8089/PiDevBackEndProject/club/allClubs'; // Remplace par l'URL correcte de ton backend
//   private apiUrlDeletee='http://localhost:8089/PiDevBackEndProject/club/remove-club';
//   private apiUrlUpDate='http://localhost:8089/PiDevBackEndProject/club/modify-matchs';
//   private apiUrlGetById='http://localhost:8089/PiDevBackEndProject/club/retrieve-matchs';


//   private apiUrlll = 'http://localhost:8089/PiDevBackEndProject/club'; 



//     getAllClubs(): Observable<Clubs[]> {
//        return this.http.get<Clubs[]>(this.apiUrl);
//      }


//      deleteClub(id: number): Observable<void> {
//       console.log("Sending DELETE request for club with ID:", id); // Vérifie l'ID dans la console
//       return this.http.delete<void>(`http://localhost:8089/PiDevBackEndProject/club/remove-club/${id}`);
//     }
    


//     updateClubs(id:any,res:Clubs):Observable<Clubs[]>{
//      return this.http.put<Clubs[]>(this.apiUrlUpDate +'/'+id,res)
//    }
  
  
//     getbyidClubs(idSousGroup:any):Observable<Clubs[]>{
//      return this.http.get<Clubs[]>(this.apiUrlGetById+'/'+idSousGroup)
//    }
  
//     addClubs(m:Clubs):Observable<Clubs[]>{
//      return this.http.post<Clubs[]>("http://localhost:8089/PiDevBackEndProject/club/add-matchs",m)
//    }
  
  
//     createClubs(clubsData: any, file: File): Observable<any> {
//     const formData = new FormData();
//     formData.append('club', JSON.stringify(clubsData));  // Match data as JSON
//     formData.append('file', file);  // The image file
  
//     return this.http.post<any>("http://localhost:8089/PiDevBackEndProject/club/saveClub", formData);
//   }




// }




import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Clubs } from '../../../../core/models/clubs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClubsService {

  private baseUrl = 'http://localhost:8089/PiDevBackEndProject/club';

  constructor(private http: HttpClient) {}

  getAllClubs(): Observable<Clubs[]> {
    return this.http.get<Clubs[]>(`${this.baseUrl}/allClubs`);
  }

  deleteClub(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-club/${id}`);
  }

  // updateClub(id: any, club: Clubs): Observable<Clubs[]> {
  //   return this.http.put<Clubs[]>(`${this.baseUrl}/modify-club/${id}`, club);
  // }


  /*updateClub(idClub: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/modify-club/${idClub}`, formData);
  }*/
  

// In ClubsService
getClubById(id: number): Observable<Clubs> {
  return this.http.get<Clubs>(`${this.baseUrl}/retrieve-club/${id}`);
}


  addClubs(club: Clubs): Observable<Clubs[]> {
    return this.http.post<Clubs[]>(`${this.baseUrl}/add-club`, club);
  }


  //hedhi
  createClubs(clubsData: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('club', JSON.stringify(clubsData));
    formData.append('file', file);
    return this.http.post<any>(`${this.baseUrl}/saveClub`, formData);
  }
  

  /*updateClub(clubId: number, clubsData: any, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('club', JSON.stringify(clubsData));
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<any>(`${this.baseUrl}/updateClub/${clubId}`, formData);
  }*/
  


  getImage(filename: string): Observable<Blob> {
    const cleanFilename = filename.replace(/^\.\/uploadss\\/i, ''); 
    return this.http.get(`http://localhost:8089/PiDevBackEndProject/club/uploads/${cleanFilename}`, { responseType: 'blob' });
  }
  uploadPostPicture(postId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/picture/${postId}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }


  updateClub(clubId: number, clubsData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/updateClub/${clubId}`, clubsData);
  }
  
}


