import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { CompetitionService } from "src/app/services/serviceCompetition/competition.service"
import { ClubsService } from "src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service"
import { Clubs } from "src/core/models/clubs"
import { Competition } from "src/core/models/competition"
import { NavbarHomeComponent } from "../navbar-home/navbar-home.component";


@Component({
  selector: "app-competition-clubs-display",
  standalone: true,
  templateUrl: "./competition-clubs-display.component.html",
  styleUrls: ["./competition-clubs-display.component.css"],
  imports: [CommonModule, RouterModule, NavbarHomeComponent],
})
export class CompetitionClubsDisplayComponent implements OnInit {
  competitionId!: number
  competition: Competition | null = null
  clubs: Clubs[] = []
  loading = true
  error = ""
  currentPage = ""
  imageUrls: string[] = []

  constructor(
    private competitionService: CompetitionService,
    private route: ActivatedRoute,
    private router: Router,
    private clubService: ClubsService,
  ) {}

  ngOnInit(): void {
    this.competitionId = +this.route.snapshot.paramMap.get("id")!
    this.loadCompetition()
    this.loadClubs()
  }

  loadCompetition(): void {
    this.competitionService.getCompetitionById(this.competitionId).subscribe({
      next: (data) => {
        this.competition = data
        this.currentPage = `${data.nameCompetition} - Clubs`
      },
      error: (err) => {
        this.error = "Failed to load competition details."
        console.error(err)
      },
    })
  }

  loadClubs(): void {
    this.loading = true
    this.competitionService.getParticipatingClubs(this.competitionId).subscribe({
      next: (data) => {
        this.clubs = data

        this.clubs.forEach((club) => {
          if (club.mediaUrl) {
            this.clubService.getImage(club.mediaUrl).subscribe((imageBlob) => {
              const imageUrl = URL.createObjectURL(imageBlob)
              this.imageUrls.push(imageUrl)
            })
          }
        })

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
