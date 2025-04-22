// import { CommonModule } from "@angular/common";
// import { Component, OnInit } from "@angular/core";
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
// import { ActivatedRoute, Router } from "@angular/router";
// import { CompetitionService } from "src/app/services/serviceCompetition/competition.service";
// import { ClubsService } from "src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service";
// import { Clubs } from "src/core/models/clubs";
// import { Competition } from "src/core/models/competition";

// @Component({
//   selector: "app-update-competition",
//   standalone: true,
//   templateUrl: "./update-competition.component.html",
//   styleUrls: ["./update-competition.component.css"],
//   imports: [CommonModule, ReactiveFormsModule],
// })
// export class UpdateCompetitionComponent implements OnInit {
//   competitionForm!: FormGroup;
//   competitionId!: number;
//   competition!: Competition;
//   participatingClubs: Clubs[] = [];
//   submitted = false;
//   loading = false;
//   loadingData = true;
//   error = "";
//   successMessage = "";

//   // Competition type options
//   competitionTypes = ["Ligue", "Coupe", "Amical"];

//   constructor(
//     private formBuilder: FormBuilder,
//     private competitionService: CompetitionService,
//     private route: ActivatedRoute,
//     private router: Router,
//   ) {}

//   ngOnInit(): void {
//     this.initForm();
//     this.competitionId = +this.route.snapshot.paramMap.get("id")!;
//     this.loadCompetition();
//   }

//   initForm(): void {
//     this.competitionForm = this.formBuilder.group({
//       nameCompetition: ["", Validators.required],
//       typeC: ["", Validators.required],
//     });
//   }

//   loadCompetition(): void {
//     this.loadingData = true;
//     this.competitionService.getCompetitionById(this.competitionId).subscribe({
//       next: (data) => {
//         this.competition = data;
//         this.populateForm();
//         this.loadParticipatingClubs();
//       },
//       error: (err) => {
//         this.error = "Failed to load competition details. Please try again.";
//         console.error(err);
//         this.loadingData = false;
//       },
//     });
//   }

//   loadParticipatingClubs(): void {
//     this.competitionService.getParticipatingClubs(this.competitionId).subscribe({
//       next: (data) => {
//         this.participatingClubs = data;
//         this.loadingData = false;
//       },
//       error: (err) => {
//         this.error = "Failed to load participating clubs. Please try again.";
//         console.error(err);
//         this.loadingData = false;
//       },
//     });
//   }

//   populateForm(): void {
//     this.competitionForm.patchValue({
//       nameCompetition: this.competition.nameCompetition,
//       typeC: this.competition.TypeC,
//     });
//   }

//   // Convenience getter for easy access to form fields
//   get f() {
//     return this.competitionForm.controls;
//   }

//   onSubmit(): void {
//     this.submitted = true;
//     this.error = "";
//     this.successMessage = "";

//     // Stop here if form is invalid
//     if (this.competitionForm.invalid) {
//       return;
//     }

//     this.loading = true;

//     // Create competition object with original club IDs
//     const competitionData = {
//       idCompetition: this.competitionId,
//       nameCompetition: this.f["nameCompetition"].value,
//       TypeC: this.f["typeC"].value,
//       // Keep the original clubs - we're not modifying them
//       clubIds: this.participatingClubs.map(club => club.idClub),
//     };

//     this.competitionService.updateCompetition(competitionData as Competition).subscribe({
//       next: (updatedData) => {
//         if (updatedData) {
//           this.competition = updatedData;
//         } else {
//           this.competition = { ...competitionData } as Competition;
//         }
        
//         this.loading = false;
//         this.successMessage = "Competition updated successfully!";
        
//         setTimeout(() => {
//           this.successMessage = "";
//           this.router.navigate(["../../"], { relativeTo: this.route });
//         }, 1500);
//       },
//       error: (err) => {
//         this.loading = false;
//         this.error = "Failed to update competition. Please try again.";
//         this.successMessage = "";
//         console.error(err);
//       },
//     });
//   }

//   cancel(): void {
//     this.router.navigate(["../../"], { relativeTo: this.route });
//   }
// }












import { CommonModule } from "@angular/common"
import { HttpClient } from "@angular/common/http"
import { Component, type OnInit } from "@angular/core"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { catchError, of, retry } from "rxjs"
import { CompetitionService } from "src/app/services/serviceCompetition/competition.service"
import { Clubs } from "src/core/models/clubs"
import { Competition } from "src/core/models/competition"








@Component({
  selector: "app-update-competition",
  standalone: true,
  templateUrl: "./update-competition.component.html",
  styleUrls: ["./update-competition.component.css"],
  imports: [CommonModule, ReactiveFormsModule],
})
export class UpdateCompetitionComponent implements OnInit {
  competitionForm!: FormGroup
  competitionId!: number
  competition!: Competition
  participatingClubs: Clubs[] = []
  submitted = false
  loading = false
  loadingData = true
  error = ""
  successMessage = ""

  competitionTypes = ["Ligue", "Coupe", "Amical"]

  constructor(
    private formBuilder: FormBuilder,
    private competitionService: CompetitionService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.competitionId = +this.route.snapshot.paramMap.get("id")!
    this.loadCompetition()
  }

  initForm(): void {
    this.competitionForm = this.formBuilder.group({
      nameCompetition: ["", Validators.required],
      //typeC: ["", Validators.required],
    })
  }

  loadCompetition(): void {
    this.loadingData = true
    this.error = ""

    this.competitionService.getCompetitionById(this.competitionId)
      .pipe(
        retry(2),
        catchError((err) => {
          this.error = "Failed to load competition data."
          this.loadingData = false
          return of(null)
        })
      )
      .subscribe((data) => {
        if (data) {
          this.competition = data
          this.populateForm()
          this.loadParticipatingClubs()
        }
        this.loadingData = false
      })
  }

  populateForm(): void {
    if (this.competition) {
      this.competitionForm.patchValue({
        nameCompetition: this.competition.nameCompetition ?? "",
        //typeC: this.competition.TypeC ?? "",
      })
    }
  }

  loadParticipatingClubs(): void {
    this.competitionService.getParticipatingClubs(this.competitionId)
      .pipe(
        catchError(() => of([]))
      )
      .subscribe((data) => {
        this.participatingClubs = data
      })
  }

  get f() {
    return this.competitionForm.controls
  }

  // onSubmit(): void {
  //   this.submitted = true
  //   this.error = ""
  //   this.successMessage = ""

  //   if (this.competitionForm.invalid) {
  //     return
  //   }

  //   const updatedCompetition: Competition = {
  //     ...this.competition,
  //     idCompetition: this.competitionId,
  //     nameCompetition: this.f["nameCompetition"].value,
  //     //TypeC: this.f["typeC"].value,
  //   }

  //   this.competitionService.updateCompetition(this.competitionId, updatedCompetition)
  //     .pipe(
  //       catchError((err) => {
  //         this.error = "Update failed."
  //         return of(null)
  //       })
  //     )
  //     // .subscribe((res) => {
  //     //   if (res) {
  //     //     this.successMessage = "Competition updated successfully!"
  //     //     setTimeout(() => {
  //     //       this.router.navigate(["../../"], { relativeTo: this.route })
  //     //     }, 1500)
  //     //   }
  //     // })




  //     .subscribe((res) => {
  //       if (res) {
  //         this.successMessage = "Competition updated successfully!";
  //         setTimeout(() => {
  //           window.location.reload(); // Reload the page after 1.5 seconds
  //         }, 1500);
  //       }
  //     });
      
  //       }




  onSubmit(): void {
    this.submitted = true;
    this.error = "";
    this.successMessage = "";
  
    if (this.competitionForm.invalid) {
      return;
    }
  
    const updatedCompetition: Competition = {
      ...this.competition,
      idCompetition: this.competitionId,
      nameCompetition: this.f["nameCompetition"].value,
      // TypeC: this.f["typeC"].value,
    };
  
    this.competitionService.updateCompetition(this.competitionId, updatedCompetition)
      .pipe(
        catchError((err) => {
          this.error = "Update failed.";
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          this.successMessage = "Competition updated successfully!";
          setTimeout(() => {
            // First navigate back to the previous route
            this.router.navigate(["../../"], { relativeTo: this.route }).then(() => {
              // Reload the page once you've navigated
              window.location.reload();
            });
          }, 1500);
        }
      });
  }
  

  cancel(): void {
    this.router.navigate(["../../"], { relativeTo: this.route })
  }
}
