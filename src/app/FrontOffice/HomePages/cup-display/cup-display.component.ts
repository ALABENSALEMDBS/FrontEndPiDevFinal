import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { RouterModule } from "@angular/router"
import { CupService } from "src/app/services/serviceCup/cup.service"
import { Cup } from "src/core/models/cup"

@Component({
  selector: "app-cup-display",
  standalone: true,
  templateUrl: "./cup-display.component.html",
  styleUrls: ["./cup-display.component.css"],
  imports: [CommonModule, RouterModule],
})
export class CupDisplayComponent implements OnInit {
  cups: Cup[] = []
  featuredCup: Cup | null = null
  loading = true
  error = ""
  currentPage = "Cups"

  constructor(private cupService: CupService) {}

  ngOnInit(): void {
    this.loadCups()
  }

  loadCups(): void {
    this.loading = true
    this.cupService.getAllCups().subscribe({
      next: (data) => {
        this.cups = data

        // Set the first cup as the featured one if available
        if (this.cups.length > 0) {
          this.featuredCup = this.cups[0]
        }

        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load cups. Please try again."
        console.error(err)
        this.loading = false
      },
    })
  }

  /*getMatchCount(cup: Cup): number {

    this.cupService.getMatchesOfCup(cup.idCup).subscribe({
      next: (clubs) => {
        console.log("number of matches");
      },
      error: (err) => {
        console.error("Failed to load matcehs", err);
      }
    })
    
  }*/


  getClubCount(cupId: number): void {
    this.cupService.getParticipatingClubs(cupId).subscribe({
      next: (clubs) => {
        console.log("Number of clubs:", clubs.length);
        // Tu peux stocker ce nombre dans un tableau ou un objet si nécessaire
      },
      error: (err) => {
        console.error("Failed to load participating clubs", err);
      }
    });
  }

  clubCounts: { [cupId: number]: number } = {};

loadClubCount(cupId: number): void {
  this.cupService.getParticipatingClubs(cupId).subscribe({
    next: (clubs) => {
      this.clubCounts[cupId] = clubs.length;
    },
    error: () => {
      this.clubCounts[cupId] = 0;
    }
  });
}

  

  /*getClubCount(cup: Cup): number {
    // This is a placeholder. You might need to implement a method to get the club count
    // or add a property to the Cup model that includes this information
    return this.cupService.getParticipatingClubs().
    return cup.clubs?.length || 0
  }*/
}
