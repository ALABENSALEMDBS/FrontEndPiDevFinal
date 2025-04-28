import { Component, type OnInit, ViewChild, type ElementRef, type AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Chart, registerables } from "chart.js/auto"
Chart.register(...registerables)
import type { Joueurs } from "src/core/models/joueur"
import type { Rapport } from "src/core/models/rapport"
import type { seance } from "src/core/models/seance"
import type { sousgroup } from "src/core/models/sousgroup"

import { RapportService } from "src/app/services/serviceAnalyste/gerer-rapport/rapport.service"
import { ActivatedRoute } from "@angular/router"
import { EtatPlayer } from "src/core/models/EtatPlayer"

interface SessionComparison {
  sessionName: string
  player1Points: number
  player2Points: number
  bestPlayer: string
  sessionId: string | number
  player1Reports: Rapport[]
  player2Reports: Rapport[]
  recommendation?: string
}

interface PlayerStats {
  [key: string]: number
}

interface MatchSelectionScore {
  player1: number
  player2: number
}

type ActiveTab = "overview" | "sessions" | "subgroups" | "details" | "session-comparison" | "match-selection"

@Component({
  selector: "app-compareplayers",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./compareplayers.component.html",
  styleUrls: ["./compareplayers.component.css"],
})
export class CompareplayersComponent implements OnInit, AfterViewInit {
  @ViewChild("radarChart") radarChartRef!: ElementRef<HTMLCanvasElement>
  @ViewChild("barChart") barChartRef!: ElementRef<HTMLCanvasElement>
  @ViewChild("sessionComparisonChart") sessionComparisonChartRef!: ElementRef<HTMLCanvasElement>
  @ViewChild("matchSelectionChart") matchSelectionChartRef!: ElementRef<HTMLCanvasElement>

  // Player data
  allPlayers: Joueurs[] = []
  filteredPlayers: Joueurs[] = []
  selectedPlayer1: Joueurs | null = null
  selectedPlayer2: Joueurs | null = null
  player1Reports: Rapport[] = []
  player2Reports: Rapport[] = []

  // Bad state players tracking
  playersInBadState: Set<number> = new Set()
  badStateReasons: { [key: number]: string } = {}

  // UI state
  positions: string[] = []
  selectedPosition = ""
  isLoading = false
  showComparison = false
  isComparing = false
  activeTab: ActiveTab = "overview"

  // Session data
  allSessions: seance[] = []
  selectedSessionFilter = "all"
  sessionComparisons: SessionComparison[] = []
  filteredSessionComparisons: SessionComparison[] = []
  selectedSessionComparison: SessionComparison | null = null

  // Match selection
  matchSelectionReason = ""
  matchSelectionScore: MatchSelectionScore = { player1: 0, player2: 0 }

  // Charts
  radarChart: Chart | null = null
  barChart: Chart | null = null
  sessionComparisonChart: Chart | null = null
  matchSelectionChart: Chart | null = null

  // Player stats
  player1Stats: PlayerStats = {}
  player2Stats: PlayerStats = {}
  player1Rating = 0
  player2Rating = 0

  // Session and subgroup data
  player1Sessions: { [key: string]: seance[] } = {}
  player2Sessions: { [key: string]: seance[] } = {}
  player1Subgroups: { [key: string]: sousgroup[] } = {}
  player2Subgroups: { [key: string]: sousgroup[] } = {}

  // Selected reports for detailed view
  selectedReport1: Rapport | null = null
  selectedReport2: Rapport | null = null

  // All subgroups for filtering
  allSubgroups: sousgroup[] = []

  // Date filtering
  startDate: Date | null = null
  endDate: Date | null = null
  filterByDate = false

  // Nouveaux filtres
  performanceFilter = "all"
  sessionFilter = "all"
  matchSessionFilter = "all"
  matchPerformanceFilter = "all"

  // Attributes to compare
  attributesToCompare = [
    { key: "speedRapport", label: "Speed", category: "pace" },
    { key: "accelerationRapport", label: "Acceleration", category: "pace" },
    { key: "endurance", label: "Endurance", category: "physical" },
    { key: "muscularEndurance", label: "Muscular Endurance", category: "physical" },
    { key: "aerobicCapacity", label: "Aerobic Capacity", category: "physical" },
    { key: "anaerobicCapacity", label: "Anaerobic Capacity", category: "physical" },
    { key: "strength", label: "Strength", category: "physical" },
    { key: "power", label: "Power", category: "shooting" },
    { key: "explosiveness", label: "Explosiveness", category: "shooting" },
    { key: "verticalJump", label: "Vertical Jump", category: "physical" },
    { key: "horizontalJump", label: "Horizontal Jump", category: "physical" },
    { key: "agility", label: "Agility", category: "dribbling" },
    { key: "balance", label: "Balance", category: "dribbling" },
    { key: "coordination", label: "Coordination", category: "dribbling" },
    { key: "reactionTime", label: "Reaction Time", category: "defending" },
    { key: "reactivity", label: "Reactivity", category: "defending" },
  ]

  // FIFA-style categories
  categories = [
    { key: "pace", label: "PACE", color: "#00c3e3" },
    { key: "shooting", label: "SHOOTING", color: "#ff9839" },
    { key: "dribbling", label: "DRIBBLING", color: "#1cc45d" },
    { key: "defending", label: "DEFENDING", color: "#0078d7" },
    { key: "physical", label: "PHYSICAL", color: "#f44336" },
  ]

  // Propriétés pour la sélection de match améliorée
  positionPlayersMap: { [position: string]: Joueurs[] } = {}
  positionRecommendedPlayers: { [position: string]: Joueurs | null } = {}
  positionPlayerScores: { [position: string]: { [playerId: number]: number } } = {}
  selectedPositionForMatch = ""
  showAllPositionPlayers = false

  // Ajoutez ces propriétés à votre classe
  selectedCriteria: "physical" | "technical" | "mental" | "performance" = "physical"

  constructor(
    private rapportService: RapportService,
    private route: ActivatedRoute,
  ) {}

  // Méthode pour vérifier si des filtres sont actifs
  hasActiveFilters(): boolean {
    return this.filterByDate || this.performanceFilter !== "all" || this.sessionFilter !== "all"
  }

  // Méthodes pour obtenir les libellés des filtres
  getPerformanceFilterLabel(): string {
    switch (this.performanceFilter) {
      case "high":
        return "High Performance"
      case "medium":
        return "Medium Performance"
      case "low":
        return "Low Performance"
      default:
        return "All Performances"
    }
  }

  getSessionFilterLabel(): string {
    switch (this.sessionFilter) {
      case "recent":
        return "Last 3 sessions"
      case "last":
        return "Last session"
      default:
        return "All sessions"
    }
  }

  // Méthodes pour réinitialiser les filtres
  resetPerformanceFilter(): void {
    this.performanceFilter = "all"
    this.applyFilters()
  }

  resetSessionFilter(): void {
    this.sessionFilter = "all"
    this.applyFilters()
  }

  // Méthode pour appliquer tous les filtres
  applyFilters(): void {
    if (this.selectedPlayer1) {
      this.loadPlayerReports(this.selectedPlayer1, true)
    }

    if (this.selectedPlayer2) {
      this.loadPlayerReports(this.selectedPlayer2, false)
    }
  }

  // Méthode pour appliquer les filtres spécifiques à la sélection de match
  applyMatchFilters(): void {
    this.determineRecommendedPlayerForNextMatch()
  }

  // Méthode pour charger tous les joueurs par position
  loadAllPlayersByPosition(): void {
    this.positions.forEach((position) => {
      const playersInPosition = this.allPlayers.filter((player) => player.posteJoueur === position)
      this.positionPlayersMap[position] = playersInPosition

      // Initialiser les scores pour cette position
      this.positionPlayerScores[position] = {}
      playersInPosition.forEach((player) => {
        this.positionPlayerScores[position][player.numeroJoueur] = 0
      })

      // Déterminer le joueur recommandé pour cette position
      this.determineRecommendedPlayerForPosition(position)
    })
  }

  // Méthode pour déterminer le joueur recommandé pour une position
  determineRecommendedPlayerForPosition(position: string): void {
    const playersInPosition = this.positionPlayersMap[position] || []
    if (playersInPosition.length === 0) {
      this.positionRecommendedPlayers[position] = null
      return
    }

    // Charger les rapports pour chaque joueur et calculer les scores
    const playerPromises = playersInPosition.map((player) => {
      return new Promise<void>((resolve) => {
        this.rapportService.getRapportbynumerojoueur(player.numeroJoueur).subscribe({
          next: (reports) => {
            if (reports && reports.length > 0) {
              // Calculer un score basé sur les rapports récents
              const recentReports = reports.slice(-5) // Prendre les 5 derniers rapports
              const score = this.calculatePlayerOverallScore(recentReports)
              this.positionPlayerScores[position][player.numeroJoueur] = score

              // Vérifier si le joueur est dans un mauvais état
              this.checkPlayerState(player, reports)
            }
            resolve()
          },
          error: () => {
            resolve()
          },
        })
      })
    })

    // Une fois tous les scores calculés, déterminer le meilleur joueur
    Promise.all(playerPromises).then(() => {
      let bestPlayer: Joueurs | null = null
      let bestScore = -1

      playersInPosition.forEach((player) => {
        const score = this.positionPlayerScores[position][player.numeroJoueur]
        if (score > bestScore && !this.isPlayerInBadState(player.numeroJoueur)) {
          bestScore = score
          bestPlayer = player
        }
      })

      this.positionRecommendedPlayers[position] = bestPlayer
    })
  }

  // Méthode pour vérifier l'état d'un joueur
  checkPlayerState(player: Joueurs, reports: Rapport[]): void {
    // Check if any recent reports have BAD state
    const recentReports = reports.slice(-3)

    // Check if player has any BAD state reports
    const isBadState = recentReports.some((report) => report.etatRapport === EtatPlayer.BAD)

    if (isBadState) {
      this.playersInBadState.add(player.numeroJoueur)

      // Determine the reason based on the latest report
      const latestReport = recentReports[recentReports.length - 1]
      if (latestReport) {
        if (latestReport.blessureRapport) {
          this.badStateReasons[player.numeroJoueur] = `Injury: ${latestReport.blessureRapport}`
        } else {
          this.badStateReasons[player.numeroJoueur] = "Insufficient physical condition"
        }
      }
    }
  }

  // Méthode pour calculer le score d'une catégorie
  calculateCategoryScore(report: Rapport, category: string): number {
    const attributesInCategory = this.attributesToCompare.filter((attr) => attr.category === category)
    if (attributesInCategory.length === 0) return 0

    let sum = 0
    let count = 0

    attributesInCategory.forEach((attr) => {
      const value = report[attr.key as keyof Rapport] as number
      if (value !== undefined && value !== null) {
        sum += value
        count++
      }
    })

    return count > 0 ? sum / count : 0
  }

  // Méthode pour vérifier si un joueur est dans un mauvais état
  isPlayerInBadState(playerId: number): boolean {
    return this.playersInBadState.has(playerId)
  }

  // Méthode pour obtenir la raison du mauvais état
  getBadStateReason(playerId: number): string {
    return this.badStateReasons[playerId] || "Concerning physical condition"
  }

  // Méthode pour calculer un score global pour un joueur basé sur ses rapports
  calculatePlayerOverallScore(reports: Rapport[]): number {
    if (!reports || reports.length === 0) return 0

    let totalScore = 0

    // Calculer la moyenne pour chaque attribut
    const stats: PlayerStats = {}

    // Initialiser tous les attributs à 0
    this.attributesToCompare.forEach((attr) => {
      stats[attr.key] = 0
    })

    // Somme de toutes les valeurs
    reports.forEach((report) => {
      this.attributesToCompare.forEach((attr) => {
        stats[attr.key] += (report[attr.key as keyof Rapport] as number) || 0
      })
    })

    // Calculer les moyennes
    this.attributesToCompare.forEach((attr) => {
      stats[attr.key] = Math.round((stats[attr.key] / reports.length) * 10) / 10
      // Ajouter des points basés sur la valeur de l'attribut (échelle 0-100)
      totalScore += stats[attr.key]
    })

    // Normaliser les points sur une échelle de 0-100
    return Math.round(totalScore / this.attributesToCompare.length)
  }

  // Méthode pour sélectionner une position pour voir tous les joueurs
  selectPositionForMatch(position: string): void {
    this.selectedPositionForMatch = position
    this.showAllPositionPlayers = true
  }

  // Méthode pour revenir à la vue principale de sélection de match
  backToMatchSelection(): void {
    this.showAllPositionPlayers = false
  }

  // Méthode pour comparer deux joueurs spécifiques
  compareSpecificPlayers(player1: Joueurs, player2: Joueurs): void {
    if (player1 && player2 && player1.numeroJoueur !== player2.numeroJoueur) {
      this.selectedPlayer1 = player1
      this.selectedPlayer2 = player2
      this.comparePlayersWithSamePosition()
      this.showAllPositionPlayers = false // Retourner à la vue principale après la comparaison
    }
  }

  // Méthode pour obtenir la classe CSS en fonction du score
  getScoreClass(score: number): string {
    if (score >= 90) return "excellent"
    if (score >= 80) return "very-good"
    if (score >= 70) return "good"
    if (score >= 60) return "average"
    return "below-average"
  }

  // Méthode pour trier les joueurs par score
  getSortedPlayersByPosition(position: string): Joueurs[] {
    const players = this.positionPlayersMap[position] || []
    return [...players].sort((a, b) => {
      const scoreA = this.positionPlayerScores[position][a.numeroJoueur] || 0
      const scoreB = this.positionPlayerScores[position][b.numeroJoueur] || 0
      return scoreB - scoreA // Tri décroissant
    })
  }

  ngOnInit(): void {
    this.loadAllPlayers()
    this.loadAllSessions()
    this.loadAllSubgroups()
    this.loadBadStatePlayers() // Charger les joueurs en mauvais état

    // Check for query parameters
    this.route.queryParams.subscribe((params) => {
      const player1Id = params["player1"]
      const player2Id = params["player2"]
      const position = params["position"]

      if (player1Id && player2Id && position) {
        this.selectedPosition = position
        this.onPositionChange()

        // Wait for players to load
        setTimeout(() => {
          this.selectedPlayer1 = this.allPlayers.find((p) => p.numeroJoueur.toString() === player1Id) || null
          this.selectedPlayer2 = this.allPlayers.find((p) => p.numeroJoueur.toString() === player2Id) || null

          if (this.selectedPlayer1 && this.selectedPlayer2) {
            this.comparePlayersWithSamePosition()
          }
        }, 1000)
      }
    })
  }

  // Méthode pour charger les joueurs en mauvais état
  loadBadStatePlayers(): void {
    // First load all players with bad reports by position
    this.positions.forEach((position) => {
      this.rapportService.getBadReportsByPoste(position).subscribe({
        next: (reports) => {
          // Extract unique player IDs from bad reports
          reports.forEach((report) => {
            if (report.joueurrapport?.numeroJoueur) {
              const playerId = report.joueurrapport.numeroJoueur
              this.playersInBadState.add(playerId)

              // Set reason based on report
              if (report.blessureRapport) {
                this.badStateReasons[playerId] = `Blessure: ${report.blessureRapport}`
              } else {
                this.badStateReasons[playerId] = "État physique insuffisant"
              }
            }
          })
        },
        error: (error) => {
          console.error(`Erreur lors du chargement des rapports pour la position ${position}:`, error)
        },
      })
    })
  }

  ngAfterViewInit(): void {
    if (this.showComparison) {
      this.renderCharts()
    }
  }

  // Data loading methods
  loadAllPlayers(): void {
    this.isLoading = true
    this.rapportService.getAllJoueurs().subscribe({
      next: (players) => {
        this.allPlayers = players
        // Extract unique positions
        this.positions = [...new Set(players.map((player) => player.posteJoueur))]
        this.isLoading = false

        // Initialiser les joueurs par position
        if (this.selectedPosition) {
          this.filteredPlayers = this.allPlayers.filter((player) => player.posteJoueur === this.selectedPosition)
        } else {
          // Si aucune position n'est sélectionnée, afficher tous les joueurs
          this.filteredPlayers = [...this.allPlayers]
        }

        this.loadAllPlayersByPosition()

        // Ensure selected players are in the filtered list
        this.ensureSelectedPlayersInFilteredList()
      },
      error: (error) => {
        console.error("Erreur lors du chargement des joueurs:", error)
        this.isLoading = false
      },
    })
  }

  loadAllSessions(): void {
    this.rapportService.getAllSeances().subscribe({
      next: (sessions) => {
        this.allSessions = sessions
      },
      error: (error) => {
        console.error("Erreur lors du chargement des séances:", error)
      },
    })
  }

  loadAllSubgroups(): void {
    this.rapportService.getAllSousGroupes().subscribe({
      next: (subgroups) => {
        this.allSubgroups = subgroups
      },
      error: (error) => {
        console.error("Erreur lors du chargement des sous-groupes:", error)
      },
    })
  }

  loadPlayerReports(player: Joueurs, isFirstPlayer: boolean): void {
    this.isLoading = true
    this.rapportService.getRapportbynumerojoueur(player.numeroJoueur).subscribe({
      next: (reports) => {
        // Filtrer les rapports par date si nécessaire
        let filteredReports = reports

        // Filtre par date
        if (this.filterByDate && this.startDate && this.endDate) {
          const start = new Date(this.startDate)
          const end = new Date(this.endDate)

          filteredReports = filteredReports.filter((report) => {
            const reportDate = new Date(report.dateRapport)
            return reportDate >= start && reportDate <= end
          })
        }

        // Filtre par session
        if (this.sessionFilter !== "all") {
          // Trier les rapports par date (du plus récent au plus ancien)
          filteredReports.sort((a, b) => new Date(b.dateRapport).getTime() - new Date(a.dateRapport).getTime())

          if (this.sessionFilter === "recent") {
            // Prendre les rapports des 3 dernières sessions
            const uniqueSessions = [...new Set(filteredReports.map((r) => r.seancesrapport?.idSeance))]
            const recentSessions = uniqueSessions.slice(0, 3)
            filteredReports = filteredReports.filter(
              (r) => r.seancesrapport && recentSessions.includes(r.seancesrapport.idSeance),
            )
          } else if (this.sessionFilter === "last") {
            // Prendre les rapports de la dernière session uniquement
            const lastSessionId = filteredReports[0]?.seancesrapport?.idSeance
            filteredReports = filteredReports.filter(
              (r) => r.seancesrapport && r.seancesrapport.idSeance === lastSessionId,
            )
          }
        }

        // Filtre par performance
        if (this.performanceFilter !== "all") {
          filteredReports = filteredReports.filter((report) => {
            const overallScore = this.calculatePlayerOverallScore([report])

            switch (this.performanceFilter) {
              case "high":
                return overallScore > 80
              case "medium":
                return overallScore >= 60 && overallScore <= 80
              case "low":
                return overallScore < 60
              default:
                return true
            }
          })
        }

        if (isFirstPlayer) {
          this.player1Reports = filteredReports
          this.calculateAverageStats(filteredReports, true)
          this.organizeReportsBySessionAndSubgroup(filteredReports, true)
        } else {
          this.player2Reports = filteredReports
          this.calculateAverageStats(filteredReports, false)
          this.organizeReportsBySessionAndSubgroup(filteredReports, false)
        }
        this.isLoading = false

        // If both players' reports are loaded, render the charts and generate session comparisons
        if (this.player1Reports.length > 0 && this.player2Reports.length > 0) {
          setTimeout(() => {
            this.renderCharts()
            this.generateSessionComparisons()
            this.determineRecommendedPlayerForNextMatch()
          }, 500)
        }
      },
      error: (error) => {
        console.error(`Erreur lors du chargement des rapports pour le joueur ${player.numeroJoueur}:`, error)
        this.isLoading = false
      },
    })
  }

  // UI event handlers
  onPositionChange(): void {
    if (this.selectedPosition) {
      // Filtrer les joueurs par position sélectionnée
      this.filteredPlayers = this.allPlayers.filter((player) => player.posteJoueur === this.selectedPosition)

      // Ne réinitialiser les sélections que si nous ne sommes pas en mode comparaison
      if (!this.isComparing) {
        this.resetPlayerSelections()
      }
    } else {
      // Si aucune position n'est sélectionnée, afficher tous les joueurs
      this.filteredPlayers = [...this.allPlayers]
    }

    // Toujours s'assurer que les joueurs sélectionnés sont dans la liste filtrée
    this.ensureSelectedPlayersInFilteredList()
  }

  comparePlayersWithSamePosition(): void {
    if (this.selectedPlayer1 && this.selectedPlayer2 && !this.areSamePlayers()) {
      this.isComparing = true
      this.loadPlayerReports(this.selectedPlayer1, true)
      this.loadPlayerReports(this.selectedPlayer2, false)
      this.showComparison = true
      this.activeTab = "overview"

      // Ensure both players are in the filtered list
      this.ensureSelectedPlayersInFilteredList()
    }
  }

  setActiveTab(tab: ActiveTab): void {
    this.activeTab = tab

    // If switching to overview tab, re-render the charts
    if (tab === "overview") {
      setTimeout(() => this.renderCharts(), 100)
    }

    // If switching to session comparison tab, render the session comparison chart
    if (tab === "session-comparison" && this.sessionComparisons.length > 0) {
      setTimeout(() => this.renderSessionComparisonChart(), 100)
    }

    // If switching to match selection tab, render the match selection chart
    if (tab === "match-selection" && this.sessionComparisons.length > 0) {
      setTimeout(() => this.renderMatchSelectionChart(), 100)
    }
  }

  selectReport(report: Rapport, isFirstPlayer: boolean): void {
    if (isFirstPlayer) {
      this.selectedReport1 = report
    } else {
      this.selectedReport2 = report
    }
  }

  filterSessionComparisons(): void {
    if (this.selectedSessionFilter === "all") {
      this.filteredSessionComparisons = [...this.sessionComparisons]
    } else {
      this.filteredSessionComparisons = this.sessionComparisons.filter(
        (comp) => comp.sessionName === this.selectedSessionFilter,
      )
    }

    // Update the selected comparison if needed
    if (this.filteredSessionComparisons.length > 0) {
      if (!this.filteredSessionComparisons.includes(this.selectedSessionComparison!)) {
        this.selectedSessionComparison = this.filteredSessionComparisons[0]
      }
    } else {
      this.selectedSessionComparison = null
    }

    // Re-render the chart with filtered data
    setTimeout(() => this.renderSessionComparisonChart(), 100)
  }

  selectSessionComparison(comparison: SessionComparison): void {
    this.selectedSessionComparison = comparison
  }

  // Apply date filter
  applyDateFilter(): void {
    if (this.startDate && this.endDate) {
      this.filterByDate = true

      // Reload reports with date filter
      if (this.selectedPlayer1) {
        this.loadPlayerReports(this.selectedPlayer1, true)
      }

      if (this.selectedPlayer2) {
        this.loadPlayerReports(this.selectedPlayer2, false)
      }
    }
  }

  // Reset date filter
  resetDateFilter(): void {
    this.startDate = null
    this.endDate = null
    this.filterByDate = false

    // Reload reports without date filter
    if (this.selectedPlayer1) {
      this.loadPlayerReports(this.selectedPlayer1, true)
    }

    if (this.selectedPlayer2) {
      this.loadPlayerReports(this.selectedPlayer2, false)
    }
  }

  // Reset methods
  resetPlayerSelections(): void {
    this.selectedPlayer1 = null
    this.selectedPlayer2 = null
    this.showComparison = false
    this.isComparing = false
    this.player1Reports = []
    this.player2Reports = []
    this.player1Stats = {}
    this.player2Stats = {}
    this.player1Rating = 0
    this.player2Rating = 0
    this.player1Sessions = {}
    this.player2Sessions = {}
    this.player1Subgroups = {}
    this.player2Subgroups = {}
    this.selectedReport1 = null
    this.selectedReport2 = null
    this.sessionComparisons = []
    this.filteredSessionComparisons = []
    this.selectedSessionComparison = null
    this.matchSelectionReason = ""
    this.matchSelectionScore = { player1: 0, player2: 0 }

    // Destroy charts if they exist
    this.destroyCharts()
  }

  resetComparison(): void {
    this.resetPlayerSelections()
  }

  destroyCharts(): void {
    if (this.radarChart) {
      this.radarChart.destroy()
      this.radarChart = null
    }
    if (this.barChart) {
      this.barChart.destroy()
      this.barChart = null
    }
    if (this.sessionComparisonChart) {
      this.sessionComparisonChart.destroy()
      this.sessionComparisonChart = null
    }
    if (this.matchSelectionChart) {
      this.matchSelectionChart.destroy()
      this.matchSelectionChart = null
    }
  }

  // Data processing methods
  organizeReportsBySessionAndSubgroup(reports: Rapport[], isFirstPlayer: boolean): void {
    const sessionMap: { [key: string]: seance[] } = {}
    const subgroupMap: { [key: string]: sousgroup[] } = {}

    reports.forEach((report) => {
      if (report.seancesrapport) {
        const sessionKey = report.seancesrapport.titleSeance
        if (!sessionMap[sessionKey]) {
          sessionMap[sessionKey] = []
        }
        if (!sessionMap[sessionKey].find((s) => s.idSeance === report.seancesrapport?.idSeance)) {
          sessionMap[sessionKey].push(report.seancesrapport)
        }
      }

      if (report.sousGroupesrapport) {
        const subgroupKey = report.sousGroupesrapport.nameSousGroup
        if (!subgroupMap[subgroupKey]) {
          subgroupMap[subgroupKey] = []
        }
        if (!subgroupMap[subgroupKey].find((s) => s.idSousGroup === report.sousGroupesrapport?.idSousGroup)) {
          subgroupMap[subgroupKey].push(report.sousGroupesrapport)
        }
      }
    })

    if (isFirstPlayer) {
      this.player1Sessions = sessionMap
      this.player1Subgroups = subgroupMap
    } else {
      this.player2Sessions = sessionMap
      this.player2Subgroups = subgroupMap
    }
  }

  calculateAverageStats(reports: Rapport[], isFirstPlayer: boolean): void {
    if (!reports || reports.length === 0) return

    const stats: PlayerStats = {}

    // Initialize all attributes to 0
    this.attributesToCompare.forEach((attr) => {
      stats[attr.key] = 0
    })

    // Sum all values
    reports.forEach((report) => {
      this.attributesToCompare.forEach((attr) => {
        stats[attr.key] += (report[attr.key as keyof Rapport] as number) || 0
      })
    })

    // Calculate averages
    this.attributesToCompare.forEach((attr) => {
      stats[attr.key] = Math.round((stats[attr.key] / reports.length) * 10) / 10
    })

    // Calculate FIFA-style category ratings
    const categoryRatings: { [key: string]: number } = {}
    this.categories.forEach((category) => {
      const attributesInCategory = this.attributesToCompare.filter((attr) => attr.category === category.key)
      if (attributesInCategory.length > 0) {
        const sum = attributesInCategory.reduce((total, attr) => total + stats[attr.key], 0)
        categoryRatings[category.key] = Math.round(sum / attributesInCategory.length)
      } else {
        categoryRatings[category.key] = 0
      }
    })

    // Calculate overall rating (weighted average of all categories)
    const overallRating = Math.round(
      Object.values(categoryRatings).reduce((sum, rating) => sum + rating, 0) / Object.keys(categoryRatings).length,
    )

    if (isFirstPlayer) {
      this.player1Stats = { ...stats, ...categoryRatings }
      this.player1Rating = overallRating
    } else {
      this.player2Stats = { ...stats, ...categoryRatings }
      this.player2Rating = overallRating
    }
  }

  generateSessionComparisons(): void {
    this.sessionComparisons = []

    // Get all unique session IDs from both players' reports
    const allSessionIds = new Set<string>()

    this.player1Reports.forEach((report) => {
      if (report.seancesrapport?.idSeance) {
        allSessionIds.add(report.seancesrapport.idSeance.toString())
      }
    })

    this.player2Reports.forEach((report) => {
      if (report.seancesrapport?.idSeance) {
        allSessionIds.add(report.seancesrapport.idSeance.toString())
      }
    })

    // For each session, calculate points for both players
    allSessionIds.forEach((sessionId) => {
      const player1SessionReports = this.player1Reports.filter(
        (report) => report.seancesrapport?.idSeance.toString() === sessionId,
      )

      const player2SessionReports = this.player2Reports.filter(
        (report) => report.seancesrapport?.idSeance.toString() === sessionId,
      )

      // Only compare sessions where both players have reports
      if (player1SessionReports.length > 0 && player2SessionReports.length > 0) {
        const sessionName =
          player1SessionReports[0].seancesrapport?.titleSeance ||
          player2SessionReports[0].seancesrapport?.titleSeance ||
          `Session ${sessionId}`

        // Calculate points for each player in this session
        const player1Points = this.calculatePlayerSessionPoints(player1SessionReports)
        const player2Points = this.calculatePlayerSessionPoints(player2SessionReports)

        // Determine the best player
        let bestPlayer = "Tie"
        if (player1Points > player2Points) {
          bestPlayer = `${this.selectedPlayer1?.nameUsers} ${this.selectedPlayer1?.prenomUser}`
        } else if (player2Points > player1Points) {
          bestPlayer = `${this.selectedPlayer2?.nameUsers} ${this.selectedPlayer2?.prenomUser}`
        }

        // Generate recommendation
        let recommendation = ""
        const pointDifference = Math.abs(player1Points - player2Points)

        if (pointDifference > 15) {
          recommendation =
            player1Points > player2Points
              ? `${this.selectedPlayer1?.nameUsers} ${this.selectedPlayer1?.prenomUser} is strongly recommended (${pointDifference} points ahead)`
              : `${this.selectedPlayer2?.nameUsers} ${this.selectedPlayer2?.prenomUser} is strongly recommended (${pointDifference} points ahead)`
        } else if (pointDifference > 5) {
          recommendation =
            player1Points > player2Points
              ? `${this.selectedPlayer1?.nameUsers} ${this.selectedPlayer1?.prenomUser} is recommended (${pointDifference} points ahead)`
              : `${this.selectedPlayer2?.nameUsers} ${this.selectedPlayer2?.prenomUser} is recommended (${pointDifference} points ahead)`
        } else {
          recommendation = "Both players are at a similar level for this session"
        }

        this.sessionComparisons.push({
          sessionName,
          player1Points,
          player2Points,
          bestPlayer,
          sessionId,
          player1Reports: player1SessionReports,
          player2Reports: player2SessionReports,
          recommendation,
        })
      }
    })

    // Sort by session name
    this.sessionComparisons.sort((a, b) => a.sessionName.localeCompare(b.sessionName))

    // Initialize filtered comparisons with all comparisons
    this.filteredSessionComparisons = [...this.sessionComparisons]

    // If there are session comparisons, select the first one by default
    if (this.sessionComparisons.length > 0) {
      this.selectedSessionComparison = this.sessionComparisons[0]
    }

    // Render the session comparison chart
    if (this.activeTab === "session-comparison") {
      setTimeout(() => this.renderSessionComparisonChart(), 100)
    }
  }

  calculatePlayerSessionPoints(reports: Rapport[]): number {
    if (!reports || reports.length === 0) return 0

    let totalPoints = 0

    // Calculate average for each attribute
    const stats: PlayerStats = {}

    // Initialize all attributes to 0
    this.attributesToCompare.forEach((attr) => {
      stats[attr.key] = 0
    })

    // Sum all values
    reports.forEach((report) => {
      this.attributesToCompare.forEach((attr) => {
        stats[attr.key] += (report[attr.key as keyof Rapport] as number) || 0
      })
    })

    // Calculate averages
    this.attributesToCompare.forEach((attr) => {
      stats[attr.key] = Math.round((stats[attr.key] / reports.length) * 10) / 10
      // Add points based on attribute value (0-100 scale)
      totalPoints += stats[attr.key]
    })

    // Normalize points to a 0-100 scale
    return Math.round(totalPoints / this.attributesToCompare.length)
  }

  // Ajoutez cette méthode pour sélectionner un critère
  selectCriteria(criteria: "physical" | "technical" | "mental" | "performance"): void {
    this.selectedCriteria = criteria
  }

  // Ajoutez cette méthode pour obtenir les attributs par catégorie
  getAttributesByCategory(category: string): any[] {
    // Mappez les catégories FIFA aux nouvelles catégories
    const categoryMapping: { [key: string]: string[] } = {
      physical: ["physical", "pace"],
      technical: ["shooting", "passing", "dribbling"],
      mental: ["defending"],
      performance: [],
    }

    // Filtrer les attributs qui correspondent à la catégorie
    return this.attributesToCompare.filter((attr) => {
      if (category === "physical") {
        return attr.category === "physical" || attr.category === "pace"
      } else if (category === "technical") {
        return attr.category === "shooting" || attr.category === "passing" || attr.category === "dribbling"
      } else if (category === "mental") {
        return attr.category === "defending"
      }
      return false
    })
  }

  // Modifiez la méthode determineRecommendedPlayerForNextMatch pour prendre en compte l'état des joueurs
  determineRecommendedPlayerForNextMatch(): void {
    if (this.sessionComparisons.length === 0) return

    let player1TotalPoints = 0
    let player2TotalPoints = 0
    let recentSessionsWeight = 0
    let recentSessionsPlayer1Points = 0
    let recentSessionsPlayer2Points = 0

    // Trier les sessions par date (en supposant que les sessions plus récentes ont des ID plus élevés)
    const sortedSessions = [...this.sessionComparisons].sort((a, b) => {
      const idA = typeof a.sessionId === "string" ? Number.parseInt(a.sessionId) : a.sessionId
      const idB = typeof b.sessionId === "string" ? Number.parseInt(b.sessionId) : b.sessionId
      return idB - idA // Ordre décroissante
    })

    // Considérer les 3 sessions les plus récentes avec un poids plus élevé
    const recentSessions = sortedSessions.slice(0, 3)

    // Calculer les points
    sortedSessions.forEach((comp) => {
      player1TotalPoints += comp.player1Points
      player2TotalPoints += comp.player2Points
    })

    // Calculer les points des sessions récentes avec un poids plus élevé
    recentSessions.forEach((comp, index) => {
      // Donner plus de poids aux sessions plus récentes (3, 2, 1)
      const weight = 3 - index
      recentSessionsWeight += weight
      recentSessionsPlayer1Points += comp.player1Points * weight
      recentSessionsPlayer2Points += comp.player2Points * weight
    })

    // Calculer la moyenne pondérée pour les sessions récentes
    const recentAvgPlayer1 = recentSessionsWeight > 0 ? recentSessionsPlayer1Points / recentSessionsWeight : 0
    const recentAvgPlayer2 = recentSessionsWeight > 0 ? recentSessionsPlayer2Points / recentSessionsWeight : 0

    // Calculer la moyenne globale
    const avgPlayer1 = sortedSessions.length > 0 ? player1TotalPoints / sortedSessions.length : 0
    const avgPlayer2 = sortedSessions.length > 0 ? player2TotalPoints / sortedSessions.length : 0

    // Le score final est 60% performance récente et 40% performance globale
    const finalScorePlayer1 = recentAvgPlayer1 * 0.6 + avgPlayer1 * 0.4
    const finalScorePlayer2 = recentAvgPlayer2 * 0.6 + avgPlayer2 * 0.4

    this.matchSelectionScore = {
      player1: Math.round(finalScorePlayer1 * 10) / 10,
      player2: Math.round(finalScorePlayer2 * 10) / 10,
    }

    // Vérifier l'état des joueurs
    const player1InBadState = this.selectedPlayer1 ? this.isPlayerInBadState(this.selectedPlayer1.numeroJoueur) : false
    const player2InBadState = this.selectedPlayer2 ? this.isPlayerInBadState(this.selectedPlayer2.numeroJoueur) : false

    // Déterminer le joueur meilleur en tenant compte de l'état
    if (player1InBadState && player2InBadState) {
      this.matchSelectionReason = `Both players are in poor physical condition and should not be selected for the next match.`
    } else if (player1InBadState) {
      this.matchSelectionReason = `${this.selectedPlayer1?.nameUsers} ${this.selectedPlayer1?.prenomUser} is in poor physical condition (${this.getBadStateReason(this.selectedPlayer1!.numeroJoueur)}). ${this.selectedPlayer2?.nameUsers} ${this.selectedPlayer2?.prenomUser} should be selected despite a lower score.`
    } else if (player2InBadState) {
      this.matchSelectionReason = `${this.selectedPlayer2?.nameUsers} ${this.selectedPlayer2?.prenomUser} is in poor physical condition (${this.getBadStateReason(this.selectedPlayer2!.numeroJoueur)}). ${this.selectedPlayer1?.nameUsers} ${this.selectedPlayer1?.prenomUser} should be selected despite a lower score.`
    } else if (finalScorePlayer1 > finalScorePlayer2) {
      const difference = Math.round((finalScorePlayer1 - finalScorePlayer2) * 10) / 10

      if (difference > 10) {
        this.matchSelectionReason = `${this.selectedPlayer1?.nameUsers} ${this.selectedPlayer1?.prenomUser} is better with ${difference} points ahead. This player has shown better overall and recent performance.`
      } else if (difference > 5) {
        this.matchSelectionReason = `${this.selectedPlayer1?.nameUsers} ${this.selectedPlayer1?.prenomUser} is better with ${difference} points ahead. This player has shown slightly superior performance.`
      } else {
        this.matchSelectionReason = `${this.selectedPlayer1?.nameUsers} ${this.selectedPlayer1?.prenomUser} is slightly better with ${difference} points ahead, but both players are close in performance.`
      }
    } else if (finalScorePlayer2 > finalScorePlayer1) {
      const difference = Math.round((finalScorePlayer2 - finalScorePlayer1) * 10) / 10

      if (difference > 10) {
        this.matchSelectionReason = `${this.selectedPlayer2?.nameUsers} ${this.selectedPlayer2?.prenomUser} is better with ${difference} points ahead. This player has shown better overall and recent performance.`
      } else if (difference > 5) {
        this.matchSelectionReason = `${this.selectedPlayer2?.nameUsers} ${this.selectedPlayer2?.prenomUser} is better with ${difference} points ahead. This player has shown slightly superior performance.`
      } else {
        this.matchSelectionReason = `${this.selectedPlayer2?.nameUsers} ${this.selectedPlayer2?.prenomUser} is slightly better with ${difference} points ahead, but both players are close in performance.`
      }
    } else {
      this.matchSelectionReason = `Both players have equivalent performances. The decision can be based on other tactical factors.`
    }

    // Rendre le graphique de sélection de match
    if (this.activeTab === "match-selection") {
      setTimeout(() => this.renderMatchSelectionChart(), 100)
    }
  }

  // Chart rendering methods
  renderCharts(): void {
    this.renderRadarChart()
    this.renderBarChart()
  }

  renderRadarChart(): void {
    if (!this.radarChartRef || !this.showComparison) return

    const canvasEl: HTMLCanvasElement = this.radarChartRef.nativeElement
    const ctx = canvasEl.getContext("2d")
    if (!ctx) return

    // Destroy previous chart if it exists
    if (this.radarChart) {
      this.radarChart.destroy()
    }

    // Get the categories to display on the radar chart
    const labels = this.categories.map((c) => c.label)
    const data1 = this.categories.map((c) => this.player1Stats[c.key] || 0)
    const data2 = this.categories.map((c) => this.player2Stats[c.key] || 0)

    // Create new chart
    this.radarChart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: labels,
        datasets: [
          {
            label: `${this.selectedPlayer1?.nameUsers} ${this.selectedPlayer1?.prenomUser}`,
            data: data1,
            backgroundColor: "rgba(0, 195, 227, 0.2)",
            borderColor: "rgba(0, 195, 227, 1)",
            pointBackgroundColor: "rgba(0, 195, 227, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(0, 195, 227, 1)",
          },
          {
            label: `${this.selectedPlayer2?.nameUsers} ${this.selectedPlayer2?.prenomUser}`,
            data: data2,
            backgroundColor: "rgba(255, 152, 57, 0.2)",
            borderColor: "rgba(255, 152, 57, 1)",
            pointBackgroundColor: "rgba(255, 152, 57, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255, 152, 57, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              color: "rgba(255, 255, 255, 0.2)",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.2)",
            },
            pointLabels: {
              color: "#ffffff",
              font: {
                size: 12,
                weight: "bold",
              },
            },
            ticks: {
              backdropColor: "transparent",
              color: "rgba(255, 255, 255, 0.7)",
              z: 1,
            },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    })
  }

  renderBarChart(): void {
    if (!this.barChartRef || !this.showComparison) return

    const canvasEl: HTMLCanvasElement = this.barChartRef.nativeElement
    const ctx = canvasEl.getContext("2d")
    if (!ctx) return

    // Destroy previous chart if it exists
    if (this.barChart) {
      this.barChart.destroy()
    }

    // Get the top attributes to compare (for better readability)
    const topAttributes = this.attributesToCompare.slice(0, 8)
    const labels = topAttributes.map((attr) => attr.label)
    const data1 = topAttributes.map((attr) => this.player1Stats[attr.key] || 0)
    const data2 = topAttributes.map((attr) => this.player2Stats[attr.key] || 0)

    // Create new chart
    this.barChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: `${this.selectedPlayer1?.nameUsers} ${this.selectedPlayer1?.prenomUser}`,
            data: data1,
            backgroundColor:
              this.selectedPlayer1 && this.isPlayerInBadState(this.selectedPlayer1.numeroJoueur)
                ? "rgba(244, 67, 54, 0.7)"
                : "rgba(0, 195, 227, 0.7)",
            borderColor:
              this.selectedPlayer1 && this.isPlayerInBadState(this.selectedPlayer1.numeroJoueur)
                ? "rgba(244, 67, 54, 1)"
                : "rgba(0, 195, 227, 1)",
            borderWidth: 1,
          },
          {
            label: `${this.selectedPlayer2?.nameUsers} ${this.selectedPlayer2?.prenomUser}`,
            data: data2,
            backgroundColor:
              this.selectedPlayer2 && this.isPlayerInBadState(this.selectedPlayer2.numeroJoueur)
                ? "rgba(244, 67, 54, 0.7)"
                : "rgba(255, 152, 57, 0.7)",
            borderColor:
              this.selectedPlayer2 && this.isPlayerInBadState(this.selectedPlayer2.numeroJoueur)
                ? "rgba(244, 67, 54, 1)"
                : "rgba(255, 152, 57, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: "#ffffff",
            },
          },
        },
      },
    })
  }

  renderSessionComparisonChart(): void {
    if (!this.sessionComparisonChartRef || !this.showComparison || this.filteredSessionComparisons.length === 0) return

    const canvasEl: HTMLCanvasElement = this.sessionComparisonChartRef.nativeElement
    const ctx = canvasEl.getContext("2d")
    if (!ctx) return

    // Destroy previous chart if it exists
    if (this.sessionComparisonChart) {
      this.sessionComparisonChart.destroy()
    }

    const labels = this.filteredSessionComparisons.map((comp) => comp.sessionName)
    const player1Data = this.filteredSessionComparisons.map((comp) => comp.player1Points)
    const player2Data = this.filteredSessionComparisons.map((comp) => comp.player2Points)

    // Create new chart
    this.sessionComparisonChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: `${this.selectedPlayer1?.nameUsers} ${this.selectedPlayer1?.prenomUser}`,
            data: player1Data,
            backgroundColor:
              this.selectedPlayer1 && this.isPlayerInBadState(this.selectedPlayer1.numeroJoueur)
                ? "rgba(244, 67, 54, 0.7)"
                : "rgba(0, 195, 227, 0.7)",
            borderColor:
              this.selectedPlayer1 && this.isPlayerInBadState(this.selectedPlayer1.numeroJoueur)
                ? "rgba(244, 67, 54, 1)"
                : "rgba(0, 195, 227, 1)",
            borderWidth: 1,
          },
          {
            label: `${this.selectedPlayer2?.nameUsers} ${this.selectedPlayer2?.prenomUser}`,
            data: player2Data,
            backgroundColor:
              this.selectedPlayer2 && this.isPlayerInBadState(this.selectedPlayer2.numeroJoueur)
                ? "rgba(244, 67, 54, 0.7)"
                : "rgba(255, 152, 57, 0.7)",
            borderColor:
              this.selectedPlayer2 && this.isPlayerInBadState(this.selectedPlayer2.numeroJoueur)
                ? "rgba(244, 67, 54, 1)"
                : "rgba(255, 152, 57, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
            },
            title: {
              display: true,
              text: "Points",
              color: "rgba(255, 255, 255, 0.9)",
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: "#ffffff",
            },
          },
          tooltip: {
            callbacks: {
              afterLabel: (context) => {
                const index = context.dataIndex
                return `Meilleur Joueur: ${this.filteredSessionComparisons[index].bestPlayer}\nRecommandation: ${this.filteredSessionComparisons[index].recommendation}`
              },
            },
          },
        },
      },
    })
  }

  renderMatchSelectionChart(): void {
    if (!this.matchSelectionChartRef || !this.showComparison) return

    const canvasEl: HTMLCanvasElement = this.matchSelectionChartRef.nativeElement
    const ctx = canvasEl.getContext("2d")
    if (!ctx) return

    // Destroy previous chart if it exists
    if (this.matchSelectionChart) {
      this.matchSelectionChart.destroy()
    }

    // Create new chart
    this.matchSelectionChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Performance Globale", "Performance Récente", "Meilleures Sessions", "Constance", "Progression"],
        datasets: [
          {
            label: `${this.selectedPlayer1?.nameUsers} ${this.selectedPlayer1?.prenomUser}`,
            data: [
              this.matchSelectionScore.player1,
              this.calculateRecentPerformance(true),
              this.calculateBestSessionsAverage(true),
              this.calculateConsistency(true),
              this.calculateProgression(true),
            ],
            backgroundColor:
              this.selectedPlayer1 && this.isPlayerInBadState(this.selectedPlayer1.numeroJoueur)
                ? "rgba(244, 67, 54, 0.7)"
                : "rgba(0, 195, 227, 0.7)",
            borderColor:
              this.selectedPlayer1 && this.isPlayerInBadState(this.selectedPlayer1.numeroJoueur)
                ? "rgba(244, 67, 54, 1)"
                : "rgba(0, 195, 227, 1)",
            borderWidth: 1,
          },
          {
            label: `${this.selectedPlayer2?.nameUsers} ${this.selectedPlayer2?.prenomUser}`,
            data: [
              this.matchSelectionScore.player2,
              this.calculateRecentPerformance(false),
              this.calculateBestSessionsAverage(false),
              this.calculateConsistency(false),
              this.calculateProgression(false),
            ],
            backgroundColor:
              this.selectedPlayer2 && this.isPlayerInBadState(this.selectedPlayer2.numeroJoueur)
                ? "rgba(244, 67, 54, 0.7)"
                : "rgba(255, 152, 57, 0.7)",
            borderColor:
              this.selectedPlayer2 && this.isPlayerInBadState(this.selectedPlayer2.numeroJoueur)
                ? "rgba(244, 67, 54, 1)"
                : "rgba(255, 152, 57, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: "#ffffff",
            },
          },
        },
      },
    })
  }

  // Helper calculation methods
  calculateRecentPerformance(isFirstPlayer: boolean): number {
    if (this.sessionComparisons.length === 0) return 0

    // Sort sessions by date (assuming more recent sessions have higher IDs)
    const sortedSessions = [...this.sessionComparisons].sort((a, b) => {
      const idA = typeof a.sessionId === "string" ? Number.parseInt(a.sessionId) : a.sessionId
      const idB = typeof b.sessionId === "string" ? Number.parseInt(b.sessionId) : b.sessionId
      return idB - idA // Descending order
    })

    // Take the most recent 3 sessions or all if less than 3
    const recentSessions = sortedSessions.slice(0, 3)

    // Calculate average points
    const points = recentSessions.map((comp) => (isFirstPlayer ? comp.player1Points : comp.player2Points))
    const sum = points.reduce((total, current) => total + current, 0)
    return Math.round((sum / points.length) * 10) / 10
  }

  calculateBestSessionsAverage(isFirstPlayer: boolean): number {
    if (this.sessionComparisons.length === 0) return 0

    // Sort sessions by points (descending)
    const sortedSessions = [...this.sessionComparisons].sort((a, b) => {
      const pointsA = isFirstPlayer ? a.player1Points : a.player2Points
      const pointsB = isFirstPlayer ? b.player1Points : b.player2Points
      return pointsB - pointsA
    })

    // Take the top 3 sessions or all if less than 3
    const bestSessions = sortedSessions.slice(0, 3)

    // Calculate average points
    const points = bestSessions.map((comp) => (isFirstPlayer ? comp.player1Points : comp.player2Points))
    const sum = points.reduce((total, current) => total + current, 0)
    return Math.round((sum / points.length) * 10) / 10
  }

  calculateConsistency(isFirstPlayer: boolean): number {
    if (this.sessionComparisons.length < 2) return 50 // Default value for insufficient data

    const points = this.sessionComparisons.map((comp) => (isFirstPlayer ? comp.player1Points : comp.player2Points))
    const mean = points.reduce((sum, val) => sum + val, 0) / points.length

    // Calculate variance
    const variance = points.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / points.length

    // Calculate standard deviation
    const stdDev = Math.sqrt(variance)

    // Invert and scale to 0-100 range (lower stdDev means higher consistency)
    // Max stdDev we consider is 30 points
    const consistency = 100 - (stdDev / 30) * 100

    return Math.min(100, Math.max(0, Math.round(consistency)))
  }

  calculateProgression(isFirstPlayer: boolean): number {
    if (this.sessionComparisons.length < 3) return 50 // Default value for insufficient data

    // Sort sessions by ID (assuming chronological order)
    const sortedSessions = [...this.sessionComparisons].sort((a, b) => {
      const idA = typeof a.sessionId === "string" ? Number.parseInt(a.sessionId) : a.sessionId
      const idB = typeof b.sessionId === "string" ? Number.parseInt(b.sessionId) : b.sessionId
      return idA - idB
    })

    // Calculate first half average and second half average
    const halfIndex = Math.floor(sortedSessions.length / 2)
    const firstHalf = sortedSessions.slice(0, halfIndex)
    const secondHalf = sortedSessions.slice(halfIndex)

    const firstHalfPoints = firstHalf.map((comp) => (isFirstPlayer ? comp.player1Points : comp.player2Points))
    const secondHalfPoints = secondHalf.map((comp) => (isFirstPlayer ? comp.player1Points : comp.player2Points))

    const firstHalfAvg = firstHalfPoints.reduce((sum, val) => sum + val, 0) / firstHalfPoints.length
    const secondHalfAvg = secondHalfPoints.reduce((sum, val) => sum + val, 0) / secondHalfPoints.length

    // Calculate progression as percentage improvement
    const improvement = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100

    // Scale to 0-100 range (max improvement we consider is 50%)
    const progression = 50 + improvement * 1

    return Math.min(100, Math.max(0, Math.round(progression)))
  }

  // Utility methods
  areSamePlayers(): boolean {
    return (
      this.selectedPlayer1 !== null &&
      this.selectedPlayer2 !== null &&
      this.selectedPlayer1.numeroJoueur === this.selectedPlayer2.numeroJoueur
    )
  }

  getSessionKeys(sessions: { [key: string]: seance[] }): string[] {
    return Object.keys(sessions)
  }

  getSubgroupKeys(subgroups: { [key: string]: sousgroup[] }): string[] {
    return Object.keys(subgroups)
  }

  getHigherStatClass(stat: string): { player1Class: string; player2Class: string } {
    if (!this.player1Stats[stat] || !this.player2Stats[stat]) {
      return { player1Class: "", player2Class: "" }
    }

    if (this.player1Stats[stat] > this.player2Stats[stat]) {
      return { player1Class: "higher-stat", player2Class: "" }
    } else if (this.player1Stats[stat] < this.player2Stats[stat]) {
      return { player1Class: "", player2Class: "higher-stat" }
    } else {
      return { player1Class: "equal-stat", player2Class: "equal-stat" }
    }
  }

  getStatBarWidth(value: number): string {
    // Assuming max value is 100
    const maxValue = 100
    const percentage = (value / maxValue) * 100
    return `${Math.min(percentage, 100)}%`
  }

  getStatColor(value: number): string {
    if (value >= 90) return "#00c3e3" // Light blue (FIFA special cards)
    if (value >= 80) return "#1cc45d" // Green
    if (value >= 70) return "#ffcc00" // Yellow
    if (value >= 60) return "#ff9839" // Orange
    return "#f44336" // Red
  }

  getStatGradient(value: number): string {
    if (value >= 90) return "linear-gradient(90deg, #00c3e3, #0078d7)" // Blue gradient
    if (value >= 80) return "linear-gradient(90deg, #1cc45d, #0a9e42)" // Green gradient
    if (value >= 70) return "linear-gradient(90deg, #ffcc00, #ff9839)" // Yellow-Orange gradient
    if (value >= 60) return "linear-gradient(90deg, #ff9839, #ff5722)" // Orange gradient
    return "linear-gradient(90deg, #f44336, #b71c1c)" // Red gradient
  }

  getCategoryAttributes(category: string): any[] {
    return this.attributesToCompare.filter((attr) => attr.category === category)
  }

  getPlayerPhoto(player: Joueurs | null): string {
    if (!player || !player.photoUser) {
      // Return default silhouette image if no photo available
      return "assets/images/player-silhouette.png"
    }
    return player.photoUser
  }

  getSessionIntensityClass(intensity: number): string {
    if (intensity >= 8) return "high-intensity"
    if (intensity >= 5) return "medium-intensity"
    return "low-intensity"
  }

  getInjuryStatusClass(status: string): string {
    if (!status) return ""

    const lowercaseStatus = status.toLowerCase()
    if (lowercaseStatus.includes("severe") || lowercaseStatus.includes("major")) {
      return "severe-injury"
    }
    if (lowercaseStatus.includes("minor") || lowercaseStatus.includes("light")) {
      return "minor-injury"
    }
    if (lowercaseStatus.includes("recovered") || lowercaseStatus.includes("healed")) {
      return "recovered"
    }
    return "moderate-injury"
  }

  getReportAttributeValue(report: Rapport | null, attrKey: string): number {
    if (!report) return 0
    return (report[attrKey as keyof Rapport] as number) || 0
  }

  getReportStatBarWidth(report: Rapport | null, attrKey: string): string {
    if (!report) return "0%"
    const value = this.getReportAttributeValue(report, attrKey)
    return this.getStatBarWidth(value)
  }

  getReportStatColor(report: Rapport | null, attrKey: string): string {
    if (!report) return "#f44336" // Default red
    const value = this.getReportAttributeValue(report, attrKey)
    return this.getStatColor(value)
  }

  getWinnerBadgeClass(player1Points: number, player2Points: number): string {
    if (player1Points > player2Points) {
      return "winner-badge-player1"
    } else if (player2Points > player1Points) {
      return "winner-badge-player2"
    } else {
      return "winner-badge-tie"
    }
  }

  getBestPlayerOverall(): string {
    if (this.sessionComparisons.length === 0) return "No data"

    let player1Wins = 0
    let player2Wins = 0
    let ties = 0

    this.sessionComparisons.forEach((comp) => {
      if (comp.player1Points > comp.player2Points) {
        player1Wins++
      } else if (comp.player2Points > comp.player1Points) {
        player2Wins++
      } else {
        ties++
      }
    })

    if (player1Wins > player2Wins) {
      return `${this.selectedPlayer1?.nameUsers} ${this.selectedPlayer1?.prenomUser} (${player1Wins} wins)`
    } else if (player2Wins > player1Wins) {
      return `${this.selectedPlayer2?.nameUsers} ${this.selectedPlayer2?.prenomUser} (${player2Wins} wins)`
    } else {
      return `Tie (${player1Wins}-${player2Wins}, ${ties} ties)`
    }
  }

  getAverageSessionPoints(isFirstPlayer: boolean): number {
    if (this.sessionComparisons.length === 0) return 0

    const points = this.sessionComparisons.map((comp) => (isFirstPlayer ? comp.player1Points : comp.player2Points))

    const sum = points.reduce((total, current) => total + current, 0)
    return Math.round((sum / points.length) * 10) / 10
  }

  // Ensure selected players are always in the filtered list
  ensureSelectedPlayersInFilteredList(): void {
    // Pour le premier joueur, on l'ajoute toujours à la liste filtrée s'il n'y est pas déjà
    if (
      this.selectedPlayer1 &&
      !this.filteredPlayers.some((p) => p.numeroJoueur === this.selectedPlayer1!.numeroJoueur)
    ) {
      this.filteredPlayers = [...this.filteredPlayers, this.selectedPlayer1]
    }

    // Pour le deuxième joueur, on l'ajoute à la liste filtrée s'il n'y est pas déjà
    if (
      this.selectedPlayer2 &&
      !this.filteredPlayers.some((p) => p.numeroJoueur === this.selectedPlayer2!.numeroJoueur)
    ) {
      this.filteredPlayers = [...this.filteredPlayers, this.selectedPlayer2]
    }
  }

  // Obtenir la liste des joueurs filtrés pour la deuxième sélection (exclure le premier joueur)
  getFilteredPlayersForSecondSelection(): Joueurs[] {
    if (!this.selectedPlayer1) {
      return this.filteredPlayers
    }

    // Filtrer pour exclure le premier joueur sélectionné
    return this.filteredPlayers.filter((player) => player.numeroJoueur !== this.selectedPlayer1!.numeroJoueur)
  }

  selectPlayer(player: Joueurs): void {
    // Check if player is in bad state
    if (this.isPlayerInBadState(player.numeroJoueur)) {
      alert(
        `${player.nameUsers} ${player.prenomUser} is in bad physical condition (${this.getBadStateReason(player.numeroJoueur)}) and cannot be selected.`,
      )
      return
    }

    // Si aucun joueur n'est sélectionné, définir comme joueur 1
    if (!this.selectedPlayer1) {
      this.selectedPlayer1 = player
      // Assurez-vous que le joueur est dans la liste filtrée
      this.ensureSelectedPlayersInFilteredList()
    }
    // Si joueur 1 est sélectionné mais pas joueur 2, définir comme joueur 2
    else if (!this.selectedPlayer2) {
      // Vérifier si c'est le même joueur que joueur 1
      if (player.numeroJoueur === this.selectedPlayer1.numeroJoueur) {
        alert("Vous ne pouvez pas sélectionner le même joueur pour les deux positions.")
        return
      }
      this.selectedPlayer2 = player
      // Assurez-vous que le joueur est dans la liste filtrée
      this.ensureSelectedPlayersInFilteredList()
    }
    // Si les deux joueurs sont sélectionnés, vérifier lequel est cliqué pour le désélectionner
    else if (player.numeroJoueur === this.selectedPlayer1.numeroJoueur) {
      this.selectedPlayer1 = null
    } else if (player.numeroJoueur === this.selectedPlayer2.numeroJoueur) {
      this.selectedPlayer2 = null
    }
  }

  // Format date for display
  formatDate(date: Date | string | null): string {
    if (!date) return "N/A"
    const d = new Date(date)
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}
