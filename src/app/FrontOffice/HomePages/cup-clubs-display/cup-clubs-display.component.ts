import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { CupService } from "src/app/services/serviceCup/cup.service"
import { Clubs } from "src/core/models/clubs"
import { Cup } from "src/core/models/cup"

@Component({
  selector: "app-cup-clubs-display",
  standalone: true,
  templateUrl: "./cup-clubs-display.component.html",
  styleUrls: ["./cup-clubs-display.component.css"],
  imports: [CommonModule, RouterModule],
})
export class CupClubsDisplayComponent implements OnInit {
  cupId!: number
  cup: Cup | null = null
  clubs: Clubs[] = []
  loading = true
  error = ""
  currentPage = ""

  constructor(
    private cupService: CupService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cupId = +this.route.snapshot.paramMap.get("id")!
    this.loadCup()
    this.loadClubs()
  }

  loadCup(): void {
    this.cupService.getCupById(this.cupId).subscribe({
      next: (data) => {
        this.cup = data
        this.currentPage = `${data.name} - Participating Clubs`
      },
      error: (err) => {
        this.error = "Failed to load cup details."
        console.error(err)
      },
    })
  }

  loadClubs(): void {
    this.loading = true
    this.cupService.getParticipatingClubs(this.cupId).subscribe({
      next: (data) => {
        this.clubs = data
        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load participating clubs. Please try again."
        console.error(err)
        this.loading = false
      },
    })
  }

  formatDate(dateString: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}
