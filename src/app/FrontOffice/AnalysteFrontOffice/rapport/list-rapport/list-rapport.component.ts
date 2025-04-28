import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router"
import { FormsModule } from "@angular/forms"

import type { Rapport } from "src/core/models/rapport"
import type { Joueurs } from "src/core/models/joueur"
import { UpdateRapportComponent } from "../update-rapport/update-rapport.component"
import { PlayerRapportDetailsComponent } from "../player-rapport-details/player-rapport-details.component"
import { JoueurService } from "src/app/services/serviceAdminClub/serviceJoueur/joueur.service"
import { RapportService } from "src/app/services/serviceAnalyste/gerer-rapport/rapport.service"


@Component({
  selector: "app-list-rapport",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, UpdateRapportComponent, PlayerRapportDetailsComponent, FormsModule],
  templateUrl: "./list-rapport.component.html",
  styleUrl: "./list-rapport.component.css",
})
export class ListRapportComponent implements OnInit {
  // Players and their reports
  players: Joueurs[] = []
  playersWithReports: Joueurs[] = []
  allReports: Rapport[] = []
  playersList: Joueurs[] = [] // List of all players for the combobox

  // Filter variables
  sessionTitleFilter = ""
  sousGroupFilter = ""
  playerNumberFilter: number | null = null
  isFiltered = false
  originalPlayersWithReports: Joueurs[] = []

  // Combobox options
  sessionTitles: string[] = []
  sousGroups: string[] = []

  // Selected player and report for details view
  selectedPlayer: Joueurs | null = null
  selectedReport: Rapport | null = null

  // UI control flags
  showReportDetails = false
  showDeleteConfirm = false
  reportIdToDelete: number | null = null
  showPlayersPanel = false

  // Cache for report data to prevent redundant API calls
  reportDataCache: { [key: string]: any } = {}

  constructor(
    private joueurService: JoueurService,
    private rapportService: RapportService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadPlayersWithReports()
    this.loadFilterOptions()
    this.loadPlayersList()
  }

  // Load players list for the combobox
  loadPlayersList(): void {
    this.joueurService.getAllJoueurs().subscribe((players) => {
      this.playersList = players.sort((a, b) => {
        // Sort by player number
        return a.numeroJoueur - b.numeroJoueur
      })
      console.log("Players list loaded for combobox:", this.playersList)
    })
  }

  // Load options for comboboxes
  loadFilterOptions(): void {
    // Get all reports to extract unique session titles and sous groups
    this.rapportService.getAllRapport().subscribe((reports) => {
      console.log("All reports:", reports) // Debug log

      // Extract unique session titles
      const titles = reports
        .filter((report) => report.seancesrapport && report.seancesrapport.titleSeance)
        .map((report) => report.seancesrapport!.titleSeance)
        .filter((title) => title && title.trim() !== "")
      this.sessionTitles = [...new Set(titles)].sort()
      console.log("Session titles:", this.sessionTitles) // Debug log

      // Extract unique sous groups
      const groups = reports
        .filter((report) => report.sousGroupesrapport && report.sousGroupesrapport.nameSousGroup)
        .map((report) => report.sousGroupesrapport!.nameSousGroup)
        .filter((group) => group && group.trim() !== "")
      this.sousGroups = [...new Set(groups)].sort()
      console.log("Sous groups:", this.sousGroups) // Debug log

      // If sousGroups is empty, try to get them directly
      if (this.sousGroups.length === 0) {
        this.loadSousGroupsDirectly()
      }
    })
  }

  // Add this new method to load sous groups directly if needed
  loadSousGroupsDirectly(): void {
    // If your service doesn't have this method, you'll need to add it
    this.rapportService.getAllSousGroupes().subscribe(
      (groups) => {
        if (groups && groups.length > 0) {
          this.sousGroups = groups
            .filter((group) => group && group.nameSousGroup)
            .map((group) => group.nameSousGroup)
            .filter((name) => name && name.trim() !== "")
          console.log("Directly loaded sous groups:", this.sousGroups)
        }
      },
      (error) => {
        console.error("Error loading sous groups:", error)
        // Fallback: Add some sample data if service fails
        this.sousGroups = ["Groupe A", "Groupe B", "Groupe C"]
      },
    )
  }

  loadPlayersWithReports(): void {
    // First get all players
    this.joueurService.getAllJoueurs().subscribe((players) => {
      this.players = players

      // Then get all reports
      this.rapportService.getAllRapport().subscribe((reports) => {
        this.allReports = reports

        // For each player, find their associated reports
        this.players.forEach((player) => {
          // Get reports for this specific player
          this.rapportService.getRapportbynumerojoueur(player.numeroJoueur).subscribe((playerReports) => {
            player.rapports = playerReports

            // Update the filtered list of players with reports
            this.updatePlayersWithReports()
          })
        })
      })
    })
  }

  // New method to update the filtered list of players with reports
  updatePlayersWithReports(): void {
    this.playersWithReports = this.players.filter((player) => this.hasReports(player))

    // Store original data for reset if not already filtered
    if (!this.isFiltered) {
      this.originalPlayersWithReports = JSON.parse(JSON.stringify(this.playersWithReports))
    }
  }

  // Filter reports by session title
  filterBySessionTitle(): void {
    if (!this.sessionTitleFilter || this.sessionTitleFilter.trim() === "") {
      return
    }

    this.isFiltered = true

    // Use the service method to get reports by session title
    this.rapportService.getRapportbytitleSeance(this.sessionTitleFilter).subscribe((reports) => {
      if (reports && reports.length > 0) {
        // Create a deep copy of the original players
        const filteredPlayers = JSON.parse(JSON.stringify(this.originalPlayersWithReports))

        // For each player, filter their reports to only include those matching the session title
        filteredPlayers.forEach((player: Joueurs) => {
          if (player.rapports) {
            // Filter reports to only include those that match the filtered reports by ID
            const reportIds = reports.map((r) => r.idRapport)
            player.rapports = player.rapports.filter((r) => reportIds.includes(r.idRapport))
          }
        })

        // Update the players with reports to only include those with matching reports
        this.playersWithReports = filteredPlayers.filter((player: Joueurs) => this.hasReports(player))
      } else {
        // No matching reports found
        this.playersWithReports = []
      }
    })
  }

  // Method to filter by sous group
  filterBySousGroup(): void {
    if (!this.sousGroupFilter || this.sousGroupFilter.trim() === "") {
      return
    }

    this.isFiltered = true

    // Use the service method to get reports by sous group name
    this.rapportService.getRapportbytitleSousGroup(this.sousGroupFilter).subscribe((reports) => {
      if (reports && reports.length > 0) {
        // Create a deep copy of the original players
        const filteredPlayers = JSON.parse(JSON.stringify(this.originalPlayersWithReports))

        // For each player, filter their reports to only include those matching the sous group
        filteredPlayers.forEach((player: Joueurs) => {
          if (player.rapports) {
            // Filter reports to only include those that match the filtered reports by ID
            const reportIds = reports.map((r) => r.idRapport)
            player.rapports = player.rapports.filter((r) => reportIds.includes(r.idRapport))
          }
        })

        // Update the players with reports to only include those with matching reports
        this.playersWithReports = filteredPlayers.filter((player: Joueurs) => this.hasReports(player))
      } else {
        // No matching reports found
        this.playersWithReports = []
      }
    })
  }

  // Method to filter by player number
  filterByPlayerNumber(): void {
    if (!this.playerNumberFilter) {
      return
    }

    this.isFiltered = true

    // Use the existing service method to get reports by player number
    this.rapportService.getRapportbynumerojoueur(this.playerNumberFilter).subscribe((reports) => {
      if (reports && reports.length > 0) {
        // Find the player with this number
        const player = this.players.find((p) => p.numeroJoueur === this.playerNumberFilter)

        if (player) {
          // Create a copy of the player with only the filtered reports
          const filteredPlayer = JSON.parse(JSON.stringify(player))
          filteredPlayer.rapports = reports

          // Show only this player with the filtered reports
          this.playersWithReports = [filteredPlayer]
        } else {
          // If player not found in our list but reports exist, create a placeholder player
          this.playersWithReports = [
            {
              numeroJoueur: this.playerNumberFilter,
              nameUsers: "Joueur",
              prenomUser: "#" + this.playerNumberFilter,
              rapports: reports,
            } as Joueurs,
          ]
        }
      } else {
        // No matching reports found
        this.playersWithReports = []
      }
    })
  }

  // Reset filter and show all reports
  resetFilter(): void {
    this.sessionTitleFilter = ""
    this.sousGroupFilter = ""
    this.playerNumberFilter = null
    this.isFiltered = false
    this.playersWithReports = JSON.parse(JSON.stringify(this.originalPlayersWithReports))
  }

  // FIXED: Modified method to handle player details with caching and toggle
  viewPlayerDetails(player: Joueurs, report: Rapport): void {
    if (player && report) {
      // Check if we're clicking on the same player and report that's already selected
      if (this.selectedPlayer === player && this.selectedReport?.idRapport === report.idRapport) {
        // If it's the same player and report, just toggle the panel visibility
        this.showPlayersPanel = !this.showPlayersPanel
        return
      }

      // Create a deep copy of the player to avoid reference issues
      // Use type assertion to ensure TypeScript knows this is a Joueurs object
      this.selectedPlayer = JSON.parse(JSON.stringify(player)) as Joueurs
      this.selectedReport = report
      this.showPlayersPanel = true

      // Create a cache key using player number and report ID
      const cacheKey = `${player.numeroJoueur}-${report.idRapport}`

      // Check if we already have this data in cache
      if (this.reportDataCache[cacheKey]) {
        console.log("Using cached rapport data for:", cacheKey)
        return
      }

      // If not in cache, fetch the data and store it
      this.rapportService.findJoueursRapports(report.idRapport, player.numeroJoueur).subscribe(
        (rapportData) => {
          console.log("Rapport data fetched successfully:", rapportData)
          // Store in cache for future use
          this.reportDataCache[cacheKey] = rapportData

          // Force a refresh of the selectedPlayer reference with proper type assertion
          this.selectedPlayer = JSON.parse(JSON.stringify(this.selectedPlayer)) as Joueurs
        },
        (error) => {
          console.error("Error fetching rapport data:", error)
        },
      )
    }
  }

  closePlayerDetails(): void {
    this.showPlayersPanel = false
    // Don't reset selectedPlayer and selectedReport here
    // This allows us to toggle the panel without losing the selection
  }

  // View a specific report's details
  viewReportDetails(report: Rapport): void {
    this.selectedReport = report
    this.showReportDetails = true
  }

  closeReportDetails(): void {
    this.showReportDetails = false
    this.selectedReport = null
  }

  // Delete report confirmation
  confirmDeleteReport(reportId: number): void {
    this.reportIdToDelete = reportId
    this.showDeleteConfirm = true
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false
    this.reportIdToDelete = null
  }

  deleteReport(): void {
    if (this.reportIdToDelete) {
      this.rapportService.delRapport(this.reportIdToDelete).subscribe(() => {
        // Update the UI after deletion
        this.allReports = this.allReports.filter((r) => r.idRapport !== this.reportIdToDelete)

        // Update the reports for the selected player if applicable
        if (this.selectedPlayer && this.selectedPlayer.rapports) {
          this.selectedPlayer.rapports = this.selectedPlayer.rapports.filter(
            (r) => r.idRapport !== this.reportIdToDelete,
          )
        }

        // Refresh all players' reports
        this.players.forEach((player) => {
          if (player.rapports) {
            player.rapports = player.rapports.filter((r) => r.idRapport !== this.reportIdToDelete)
          }
        })

        // Update the filtered list after deletion
        this.updatePlayersWithReports()

        this.showDeleteConfirm = false
        this.reportIdToDelete = null
      })
    }
  }

  // Helper method to get player name for a report
  getPlayerNameForReport(report: Rapport): string {
    if (report.joueurrapport) {
      return `${report.joueurrapport.prenomUser} ${report.joueurrapport.nameUsers}`
    }
    return "Joueur non assigné"
  }

  // Check if a player has any reports
  hasReports(player: Joueurs): boolean {
    return player.rapports !== undefined && player.rapports.length > 0
  }

  // Get the count of reports for a player
  getReportCount(player: Joueurs): number {
    return player.rapports ? player.rapports.length : 0
  }

  // Helper method to check if a specific player/report is currently selected
  isReportSelected(player: Joueurs, report: Rapport): boolean {
    return (
      this.selectedPlayer === player && this.selectedReport?.idRapport === report.idRapport && this.showPlayersPanel
    )
  }

  getStatusClass(status: string): string {
    if (!status) return ""

    status = status.toLowerCase()
    if (status.includes("excellent") || status.includes("bon")) {
      return "status-good"
    } else if (status.includes("moyen")) {
      return "status-average"
    } else if (status.includes("mauvais") || status.includes("faible")) {
      return "status-bad"
    }
    return ""
  }

  getInjuryClass(injury: string): string {
    if (!injury) return ""

    injury = injury.toLowerCase()
    if (injury.includes("aucune") || injury.includes("non")) {
      return "status-good"
    } else if (injury.includes("légère") || injury.includes("mineure")) {
      return "status-average"
    } else if (injury.includes("grave") || injury.includes("sérieuse")) {
      return "status-bad"
    }
    return ""
  }
}

