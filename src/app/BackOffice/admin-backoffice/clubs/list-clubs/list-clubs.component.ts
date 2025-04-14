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
  getClubs(): void {
    this.clubService.getAllClubs().subscribe(data => {
      this.clubs = data;
      console.log(this.clubs);
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
  
  
  
  


  // deleteClub(id: number) {
  //   // Call your service to delete the club by id
  //   this.clubService.deleteClub(id).subscribe(
  //     () => {
  //       console.log(`Club with id ${id} deleted successfully.`);
  //       // Remove the deleted club from the list
  //       this.clubs = this.clubs.filter(club => club.idCLubs !== id);
  //     },
  //     (error) => {
  //       console.error(`Error deleting club with id ${id}:`, error);
  //     }
  //   );
  // }


  // deleteExercices(id:any){
  //   this.coatchService.delExercices(id).subscribe(()=>{
  //     console.log("deleted exercices !!!!")
  //     window.location.reload()
  //   })
  // }




  // deleteClub(id: any) {
  //   console.log("Deleting club with ID:", id); // ✅ See if ID is undefined
  //   this.clubService.delClubs(id).subscribe(() => {
  //     console.log('Club deleted!');
  //     window.location.reload();
  //   }, error => {
  //     console.error('Error deleting club:', error);
  //   });
  // }
  







  /*getAllClubLogos(): string[] {
    return this.clubs.map(club => 'data:image/jpeg;base64,' + club.logo);
  }*/

    // Service Method

}

