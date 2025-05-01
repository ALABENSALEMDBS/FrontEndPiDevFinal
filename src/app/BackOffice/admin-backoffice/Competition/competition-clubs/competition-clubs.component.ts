import { CommonModule } from "@angular/common"
import { Component, OnInit} from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { CompetitionService } from "src/app/services/serviceCompetition/competition.service"
import { ClubsService } from "src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service"
import { Clubs } from "src/core/models/clubs"
import { Competition } from "src/core/models/competition"


@Component({
  selector: "app-competition-clubs",
  standalone: true,
  templateUrl: "./competition-clubs.component.html",
  styleUrls: ["./competition-clubs.component.css"],
  imports: [CommonModule],
})
export class CompetitionClubsComponent implements OnInit {
  competitionId!: number
  competition: Competition | null = null
  clubs: Clubs[] = []
  loading = true
  error = ""

  constructor(
    private competitionService: CompetitionService,
    private route: ActivatedRoute,
    private router: Router,
    private clubService : ClubsService
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
      },
      error: (err) => {
        this.error = "Failed to load competition details."
        console.error(err)
      },
    })
  }
  imageUrls:string[]=[];

  loadClubs(): void {
    this.loading = true
    this.competitionService.getParticipatingClubs(this.competitionId).subscribe({
      next: (data) => {
        this.clubs = data


        this.clubs.forEach(club => {
          if (club.mediaUrl) {
            this.clubService.getImage(club.mediaUrl).subscribe(imageBlob => {
              const imageUrl = URL.createObjectURL(imageBlob);
              this.imageUrls.push(imageUrl);
            });
          }
        });

        
        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load participating clubs. Please try again."
        console.error(err)
        this.loading = false
      },
    })
  }

  goBack(): void {
    this.router.navigate(["/superadmin/showcompetition"])
  }

  formatDate(dateString: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }
}
