// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { Observable } from 'rxjs';
// import { ClubsService } from 'src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service';
// import { Clubs } from 'src/core/models/clubs';

// @Component({
//   selector: 'app-list-clubs',
//   //imports: [],
//   templateUrl: './list-clubs.component.html',
//   styleUrl: './list-clubs.component.css',
//   imports: [RouterModule, CommonModule],
// })
// export class ListClubsComponent implements OnInit{

//   clubs: Clubs[] = [];

//   constructor(private clubService: ClubsService , private http:HttpClient) {}

//   ngOnInit(): void {
//     this.getClubs();
//   }

//   // Fetch all clubs from the service
//   // getClubs(): void {
//   //   this.clubService.getAllClubs().subscribe(data => {
//   //     this.clubs = data;
//   //     this.clubs.forEach(club=>{
//   //       this.clubService.getImage(club.mediaUrl!).subscribe((imageBlob) => {
//   //         console.log('Image blob:', imageBlob);
//   //         const imageUrl = URL.createObjectURL(imageBlob);
//   //         this.imageUrls.push(imageUrl);

//   //     })
//   //   });
//   // }

//   imageUrls:string[]=[];

//   getClubs(): void {
//     this.clubService.getAllClubs().subscribe(data => {
//       this.clubs = data;
//      // this.imageUrls = []; // Vider d'abord pour éviter de cumuler si tu rappelles la méthode
//       this.clubs.forEach(club => {
//         if (club.mediaUrl) {
//           this.clubService.getImage(club.mediaUrl).subscribe(imageBlob => {
//             const imageUrl = URL.createObjectURL(imageBlob);
//             this.imageUrls.push(imageUrl);
//           });
//         }
//       });
//     });
//   }
  
  
//   //Delete a club by id
//   // deleteClub(id:any){
//   //   this.clubService.delClubs(id).subscribe(() => {
//   //     console.log('Club deleted!');
//   //     window.location.reload(); // Reload the page after deletion
//   //   });
//   // }


//   private apiUrl = 'http://localhost:8089/PiDevBackEndProject/club'; 

//   // deleteClub(id: number): Observable<void> {
//   //   console.log('Deleting club with ID:', id);  // Add this line
//   //   return this.http.delete<void>(`${this.apiUrl}/remove-club/${id}`);
//   // }


//   // deleteClub(id: number): void {
//   //   console.log(this.clubs[id]);  // Add this line
//   // }


//   deleteClub(id: number): void {
//     console.log("Deleting club with ID:", id);  // Vérifie si l'ID est bien passé
//     this.clubService.deleteClub(id).subscribe(() => {
//       console.log(`Club with ID ${id} deleted successfully.`);
//       // Remove the deleted club from the list
//       this.clubs = this.clubs.filter(club => club.idClub !== id);
//     }, (error) => {
//       console.error(`Error deleting club with ID ${id}:`, error);
//     });
//   }



//   showId(idClubs: number): void {
//     console.log('Club ID:', idClubs);
//   }
  

//   logClubId(emailClub: string): void {
//     console.log('Club ID:', emailClub);
//   }

//   showAll(team: Clubs): void {
//     console.log('Club ID:', team);
//     console.log(team.adressClub);
//     console.log(team.idClub);
//     console.log(team.nameClub);

//   }
  
// }














import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgModel, NgModelGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ClubsService } from 'src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service';
import { Clubs } from 'src/core/models/clubs';


@Component({
  selector: 'app-list-clubs',
  templateUrl: './list-clubs.component.html',
  styleUrls: ['./list-clubs.component.css'],
  imports: [RouterModule, CommonModule,FormsModule],
})
export class ListClubsComponent implements OnInit {
  clubs: Clubs[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  filteredClubs: Clubs[] = [];

  constructor(
    private clubsService: ClubsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadClubs();
  }

  loadClubs(): void {
    this.loading = true;
    this.clubsService.getAllClubs().subscribe({
      next: (data) => {
        this.clubs = data;
        this.filteredClubs = [...this.clubs];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load clubs. Please try again.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  deleteClub(id: number): void {
    if (confirm('Are you sure you want to delete this club?')) {
      this.clubsService.deleteClub(id).subscribe({
        next: () => {
          this.clubs = this.clubs.filter(club => club.idClub !== id);
          this.filteredClubs = this.filteredClubs.filter(club => club.idClub !== id);
        },
        error: (err) => {
          this.error = 'Failed to delete club. Please try again.';
          console.error(err);
        }
      });
    }
  }

  updateClub(id: number): void {
    this.router.navigate(['update', id], { relativeTo: this.route });
    this.scrollToBottom();
  }


  @ViewChild('bottomOfPage') bottomOfPage!: ElementRef;

  scrollToBottom() {
    this.bottomOfPage.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  addNewClub(): void {
    this.router.navigate(['addclubs'], { relativeTo: this.route });
  }

  searchClubs(): void {
    if (!this.searchTerm.trim()) {
      this.filteredClubs = [...this.clubs];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredClubs = this.clubs.filter(club => 
      club.nameClub.toLowerCase().includes(term) || 
      club.emailClub.toLowerCase().includes(term) ||
      club.adressClub.toLowerCase().includes(term)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredClubs = [...this.clubs];
  }

  // Helper method to get image URL
  getClubLogoUrl(club: Clubs): string {
    if (club.mediaUrl) {
      // Extract filename from path
      const cleanFilename = club.mediaUrl.replace(/^\.\/uploadss\\/i, '');
      return `http://localhost:8089/PiDevBackEndProject/club/uploads/${cleanFilename}`;
    }
    return 'assets/images/default-club-logo.png';
  }
}