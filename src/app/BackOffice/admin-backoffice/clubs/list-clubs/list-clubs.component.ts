import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ClubsService } from 'src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service';
import { Clubs } from 'src/core/models/clubs';

@Component({
  selector: 'app-list-clubs',
  //imports: [],
  templateUrl: './list-clubs.component.html',
  styleUrl: './list-clubs.component.css',
  imports: [RouterModule, CommonModule],
})
export class ListClubsComponent implements OnInit{

  clubs: Clubs[] = [];

  constructor(private clubService: ClubsService , private http:HttpClient) {}

  ngOnInit(): void {
    this.getClubs();
  }

  // Fetch all clubs from the service
  // getClubs(): void {
  //   this.clubService.getAllClubs().subscribe(data => {
  //     this.clubs = data;
  //     this.clubs.forEach(club=>{
  //       this.clubService.getImage(club.mediaUrl!).subscribe((imageBlob) => {
  //         console.log('Image blob:', imageBlob);
  //         const imageUrl = URL.createObjectURL(imageBlob);
  //         this.imageUrls.push(imageUrl);

  //     })
  //   });
  // }

  imageUrls:string[]=[];

  getClubs(): void {
    this.clubService.getAllClubs().subscribe(data => {
      this.clubs = data;
     // this.imageUrls = []; // Vider d'abord pour éviter de cumuler si tu rappelles la méthode
      this.clubs.forEach(club => {
        if (club.mediaUrl) {
          this.clubService.getImage(club.mediaUrl).subscribe(imageBlob => {
            const imageUrl = URL.createObjectURL(imageBlob);
            this.imageUrls.push(imageUrl);
          });
        }
      });
    });
  }
  
  
  //Delete a club by id
  // deleteClub(id:any){
  //   this.clubService.delClubs(id).subscribe(() => {
  //     console.log('Club deleted!');
  //     window.location.reload(); // Reload the page after deletion
  //   });
  // }


  private apiUrl = 'http://localhost:8089/PiDevBackEndProject/club'; 

  // deleteClub(id: number): Observable<void> {
  //   console.log('Deleting club with ID:', id);  // Add this line
  //   return this.http.delete<void>(`${this.apiUrl}/remove-club/${id}`);
  // }


  // deleteClub(id: number): void {
  //   console.log(this.clubs[id]);  // Add this line
  // }


  deleteClub(id: number): void {
    console.log("Deleting club with ID:", id);  // Vérifie si l'ID est bien passé
    this.clubService.deleteClub(id).subscribe(() => {
      console.log(`Club with ID ${id} deleted successfully.`);
      // Remove the deleted club from the list
      this.clubs = this.clubs.filter(club => club.idClub !== id);
    }, (error) => {
      console.error(`Error deleting club with ID ${id}:`, error);
    });
  }



  showId(idClubs: number): void {
    console.log('Club ID:', idClubs);
  }
  

  logClubId(emailClub: string): void {
    console.log('Club ID:', emailClub);
  }

  showAll(team: Clubs): void {
    console.log('Club ID:', team);
    console.log(team.adressClub);
    console.log(team.idClub);
    console.log(team.nameClub);

  }
  
}

