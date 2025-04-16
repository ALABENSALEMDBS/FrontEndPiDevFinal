import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { StatisindivService } from 'src/app/services/serviceAnalyste/statistique-indiv/statisindiv.service';
import { FormationService } from 'src/app/services/serviceCoatch/serviceformation/formation.service';
import { StatistiqueIndiv } from 'src/core/models/StatistiqueIndiv';
import { AssignPlayersFormationComponent } from "../assign-players-formation/assign-players-formation.component";
import { JoueurService } from 'src/app/services/serviceAdminClub/serviceJoueur/joueur.service';


@Component({
  selector: 'app-players-formation',
  imports: [CommonModule, AssignPlayersFormationComponent,NgChartsModule],
  templateUrl: './players-formation.component.html',
  styleUrl: './players-formation.component.css',
  animations: [
    trigger("slideInOut", [
      state(
        "in",
        style({
          transform: "translateX(0)",
        }),
      ),
      state(
        "out",
        style({
          transform: "translateX(100%)",
        }),
      ),
      transition("out => in", animate("300ms ease-in-out")),
      transition("in => out", animate("300ms ease-in-out")),
    ]),
  ],
})
export class PlayersFormationComponent implements OnInit {

  constructor(private serF:FormationService, private statistiqueService: StatisindivService, private joueurService: JoueurService){}
  ngOnInit(): void {
    this.joueurService.getAllJoueurs().subscribe(joueurs => {
      console.log('Données des joueurs:', joueurs);
    });
    }
    successMessage: string = '';
    errorMessage: string = '';
    showSuccessMessage: boolean = false
    showErrorMessage: boolean = false
  selectedFormation: any = null

  showPopup = false;

  isAssignOpen = false; // Contrôle l'affichage du composant Assign Players

  @Input() isOpen = false
  @Input() formation: any
  @Output() close = new EventEmitter<void>()


  // Statistics modal properties
  isModalOpenStatistic = false
  numeroPlayer = 0
  nameUsers = ""
  statistiques: StatistiqueIndiv[] = []
  selectedCategory = "offensive"

  // Chart properties
  chartData: ChartData = { datasets: [] }
  chartOptions: ChartOptions = {}
  chartType: ChartType = "bar"
  currentChartType: ChartType = "bar"
  keyStats: any[] = []
  detailedStats: { label: string; value: number; percentage: number; color: string }[] = []

  // Chart configuration
  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        padding: 10,
        cornerRadius: 4,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  }

  barChartLabels: string[] = [
    "Goals",
    "Assists",
    "Shots",
    "Successful Dribbles",
    "Tackles",
    "Shots on Target",
    "Successful Passes",
    "Duels Won",
    "Fouls Committed",
    "Yellow Cards",
    "Red Cards",
    "Distance (km)",
  ];
  

  barChartData: ChartData = {
    labels: this.barChartLabels,
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        label: "Performance",
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 205, 86, 0.6)",
          "rgba(201, 203, 207, 0.6)",
        ],
      },
    ],
  }

  // Category definitions
  categories = [
    { id: "offensive", name: "Offensive", active: true },
    { id: "defensive", name: "Defensive", active: false },
    { id: "technical", name: "Technical", active: false },
    { id: "discipline", name: "Discipline", active: false },
  ];
  

  // Stat colors
  statColors = {
    buts: "#FF5722",
    passesDecisives: "#2196F3",
    tirs: "#FFC107",
    tirsCadres: "#9C27B0",
    tacles: "#4CAF50",
    fautesCommises: "#F44336",
    cartonsJaunes: "#FFEB3B",
    cartonsRouges: "#D32F2F",
    passesReussies: "#00BCD4",
    dribblesReussis: "#3F51B5",
    duelsGagnes: "#8BC34A",
    distanceParcourue: "#607D8B",
    vitesse: "#FF9800",
  }

  closePanel(): void {
    this.close.emit()
    this.isOpen = false
    this.isAssignOpen = false
    location.reload()
  }

  assignPlayer(idFormation: number) {
    this.selectedFormation = this.formation
    console.log("Assign player to formation:", this.formation?.nameFormation)
    this.showPopup = true
    this.isAssignOpen = true
  }

  openPanel() {
    this.isOpen = true
  }

  closeAssignPanel() {
    
    this.isAssignOpen = false
    this.showPopup = false
  }

  removePlayerFromFormation(formationId: number, playerId: number) {
    this.serF.dessaffecterJoueurAFormation(formationId, playerId).subscribe({
      next: () => {
        this.successMessage = "Unassigned player successfully."
        this.errorMessage = ""
        window.location.reload()
      },
      error: () => {
        this.errorMessage = "Error when Unassigned player."
        this.successMessage = ""
      },
    })
  }

  // Statistics modal methods
  showStatistic(numeroJoueur: number, nameUsers: string): void {
    this.isModalOpenStatistic = true
    this.numeroPlayer = numeroJoueur
    this.nameUsers = nameUsers

    // Reset active category
    this.selectedCategory = "offensive"
    this.categories.forEach((cat) => (cat.active = cat.id === this.selectedCategory))

    // Fetch player statistics
    this.showStatisticdunjoueur(numeroJoueur)
  }

  showStatisticdunjoueur(numeroJoueur: number | undefined): void {
    if (numeroJoueur !== undefined) {
      this.statistiqueService.getStatIndivByNumeroJoueur(numeroJoueur).subscribe(
        (data) => {
          this.statistiques = data
          if (this.statistiques.length > 0) {
            this.updateKeyStats()
            this.updateChartData(this.selectedCategory)
            // this.updateDetailedStats()
          }
        },
        (error) => {
          console.error("Erreur lors de la récupération des statistiques:", error)
        },
      )
    }
  }

  updateKeyStats(): void {
    if (this.statistiques.length > 0) {
      const stats = this.statistiques[0]

      // Calculate derived statistics
      const tirsPrecision = stats.tirs > 0 ? Math.round((stats.tirsCadres / stats.tirs) * 100) : 0
      const butsEfficacite = stats.tirs > 0 ? Math.round((stats.buts / stats.tirs) * 100) : 0

      this.keyStats = [
        { label: "Goals", value: stats.buts || 0, color: this.statColors.buts, icon: "⚽" },
        { label: "Assists", value: stats.passesDecisives || 0, color: this.statColors.passesDecisives, icon: "👟" },
        { label: "Accuracy", value: `${tirsPrecision}%`, color: this.statColors.tirsCadres, icon: "🎯" },
        {
          label: "Distance",
          value: `${stats.distanceParcourue || 0} km`,
          color: this.statColors.distanceParcourue,
          icon: "🏃",
        },
      ]
    }
  }

  // updateDetailedStats(): void {
  //   if (this.statistiques.length > 0) {
  //     const stats = this.statistiques[0]
  //     const maxValues = {
  //       buts: 20,
  //       passesDecisives: 15,
  //       tirs: 100,
  //       dribblesReussis: 80,
  //       passesReussies: 500,
  //       duelsGagnes: 100,
  //       tacles: 50,
  //       fautesCommises: 30,
  //       cartonsJaunes: 10,
  //       cartonsRouges: 3,
  //     }

  //     // Create detailed stats based on current category
  //     switch (this.selectedCategory) {
  //       case "offensive":
  //         this.detailedStats = [
  //           {
  //             label: "Buts",
  //             value: stats.buts || 0,
  //             percentage: Math.min(((stats.buts || 0) / maxValues.buts) * 100, 100),
  //             color: this.statColors.buts,
  //           },
  //           {
  //             label: "Passes Décisives",
  //             value: stats.passesDecisives || 0,
  //             percentage: Math.min(((stats.passesDecisives || 0) / maxValues.passesDecisives) * 100, 100),
  //             color: this.statColors.passesDecisives,
  //           },
  //           {
  //             label: "Tirs",
  //             value: stats.tirs || 0,
  //             percentage: Math.min(((stats.tirs || 0) / maxValues.tirs) * 100, 100),
  //             color: this.statColors.tirs,
  //           },
  //           {
  //             label: "Tirs Cadrés",
  //             value: stats.tirsCadres || 0,
  //             percentage: stats.tirs > 0 ? Math.min(((stats.tirsCadres || 0) / stats.tirs) * 100, 100) : 0,
  //             color: this.statColors.tirsCadres,
  //           },
  //         ]
  //         break
  //       case "defensive":
  //         this.detailedStats = [
  //           {
  //             label: "Tacles",
  //             value: stats.tacles || 0,
  //             percentage: Math.min(((stats.tacles || 0) / maxValues.tacles) * 100, 100),
  //             color: this.statColors.tacles,
  //           },
  //           {
  //             label: "Duels Gagnés",
  //             value: stats.duelsGagnes || 0,
  //             percentage: Math.min(((stats.duelsGagnes || 0) / maxValues.duelsGagnes) * 100, 100),
  //             color: this.statColors.duelsGagnes,
  //           },
  //           {
  //             label: "Fautes Commises",
  //             value: stats.fautesCommises || 0,
  //             percentage: Math.min(((stats.fautesCommises || 0) / maxValues.fautesCommises) * 100, 100),
  //             color: this.statColors.fautesCommises,
  //           },
  //         ]
  //         break
  //       case "technique":
  //         this.detailedStats = [
  //           {
  //             label: "Passes Réussies",
  //             value: stats.passesReussies || 0,
  //             percentage: Math.min(((stats.passesReussies || 0) / maxValues.passesReussies) * 100, 100),
  //             color: this.statColors.passesReussies,
  //           },
  //           {
  //             label: "Dribbles Réussis",
  //             value: stats.dribblesReussis || 0,
  //             percentage: Math.min(((stats.dribblesReussis || 0) / maxValues.dribblesReussis) * 100, 100),
  //             color: this.statColors.dribblesReussis,
  //           },
  //           {
  //             label: "Vitesse",
  //             value: stats.vitesseStatistiqueIndiv || 0,
  //             percentage: Math.min(((stats.vitesseStatistiqueIndiv || 0) / 40) * 100, 100), // Assuming max speed is 40 km/h
  //             color: this.statColors.vitesse,
  //           },
            
  //         ]
  //         break
  //       case "discipline":
  //         this.detailedStats = [
  //           {
  //             label: "Cartons Jaunes",
  //             value: stats.cartonsJaunes || 0,
  //             percentage: Math.min(((stats.cartonsJaunes || 0) / maxValues.cartonsJaunes) * 100, 100),
  //             color: this.statColors.cartonsJaunes,
  //           },
  //           {
  //             label: "Cartons Rouges",
  //             value: stats.cartonsRouges || 0,
  //             percentage: Math.min(((stats.cartonsRouges || 0) / maxValues.cartonsRouges) * 100, 100),
  //             color: this.statColors.cartonsRouges,
  //           },
  //           {
  //             label: "Fautes Commises",
  //             value: stats.fautesCommises || 0,
  //             percentage: Math.min(((stats.fautesCommises || 0) / maxValues.fautesCommises) * 100, 100),
  //             color: this.statColors.fautesCommises,
  //           },
  //         ]
  //         break
  //     }
  //   }
  // }

  changeCategory(categoryId: string): void {
    this.selectedCategory = categoryId
    this.categories.forEach((cat) => (cat.active = cat.id === categoryId))
    this.updateChartData(categoryId)
    // this.updateDetailedStats()
  }

  updateChartData(category: string): void {
    if (this.statistiques.length === 0) return

    const stats = this.statistiques[0]

    switch (category) {
      case "offensive":
        this.updateOffensiveChart(stats)
        break
      case "defensive":
        this.updateDefensiveChart(stats)
        break
      case "technical":
        this.updateTechniqueChart(stats)
        break
      case "discipline":
        this.updateDisciplineChart(stats)
        break
      default:
        this.updateOffensiveChart(stats)
    }

    // Update chartData and chartOptions for the template
    this.chartData = this.barChartData
    this.chartOptions = this.barChartOptions
    this.chartType = this.currentChartType
  }

  updateOffensiveChart(stats: StatistiqueIndiv): void {
    this.currentChartType = "bar"

    this.barChartData = {
      labels: ["Goals", "Assists", "Shots", "Shots on Target", "Successful Dribbles"],
      datasets: [
        {
          data: [
            stats.buts || 0,
            stats.passesDecisives || 0,
            stats.tirs || 0,
            stats.tirsCadres || 0,
            stats.dribblesReussis || 0,
          ],
          label: "Statistics Offensives",
          backgroundColor: [
            this.statColors.buts,
            this.statColors.passesDecisives,
            this.statColors.tirs,
            this.statColors.tirsCadres,
            this.statColors.dribblesReussis,
          ],
          borderWidth: 0,
          borderRadius: 6,
        },
      ],
    }

    this.barChartOptions = {
      ...this.barChartOptions,
      indexAxis: "x",
      plugins: {
        ...this.barChartOptions.plugins,
        legend: {
          display: false,
        },
      },
    }
  }

  updateDefensiveChart(stats: StatistiqueIndiv): void {
    this.currentChartType = "polarArea"

    this.barChartData = {
      labels: ["Tackles", "Duels Won", "Fouls Committed"],
      datasets: [
        {
          data: [stats.tacles || 0, stats.duelsGagnes || 0, stats.fautesCommises || 0],
          backgroundColor: [this.statColors.tacles, this.statColors.duelsGagnes, this.statColors.fautesCommises],
          borderWidth: 1,
          borderColor: "#ffffff",
        },
      ],
    }

    this.barChartOptions = {
      ...this.barChartOptions,
      scales: undefined,
      plugins: {
        ...this.barChartOptions.plugins,
        legend: {
          display: true,
          position: "right",
        },
      },
    }
  }

  updateTechniqueChart(stats: StatistiqueIndiv): void {
    this.currentChartType = "radar"

    // Normalize values for radar chart
    const maxValues = {
      buts: 20,
      passesDecisives: 15,
      tirs: 100,
      dribblesReussis: 80,
      passesReussies: 500,
      duelsGagnes: 100,
    }

    const normalizedValues = {
      buts: Math.min(((stats.buts || 0) / maxValues.buts) * 10, 10),
      passesDecisives: Math.min(((stats.passesDecisives || 0) / maxValues.passesDecisives) * 10, 10),
      tirs: Math.min(((stats.tirs || 0) / maxValues.tirs) * 10, 10),
      dribblesReussis: Math.min(((stats.dribblesReussis || 0) / maxValues.dribblesReussis) * 10, 10),
      passesReussies: Math.min(((stats.passesReussies || 0) / maxValues.passesReussies) * 10, 10),
      duelsGagnes: Math.min(((stats.duelsGagnes || 0) / maxValues.duelsGagnes) * 10, 10),
    }

    this.barChartData = {
      labels: ["Goals", "Assists", "Shots", "Successful Dribbles", "Successful Passes", "Duels Won"],
      datasets: [
        {
          data: [
            stats.buts,
            // normalizedValues.buts,
            stats.passesDecisives,
            // normalizedValues.passesDecisives,
            stats.tirs,
            // normalizedValues.tirs,
            stats.dribblesReussis,
            // normalizedValues.dribblesReussis,
            stats.passesReussies,
            // normalizedValues.passesReussies,
            stats.duelsGagnes,
            // normalizedValues.duelsGagnes,
          ],
          label: "Technical Skills",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgb(54, 162, 235)",
        },
      ],
    }

    this.barChartOptions = {
      ...this.barChartOptions,
      scales: {
        r: {
          angleLines: {
            display: true,
          },
          suggestedMin: 0,
          suggestedMax: 1,
          ticks: {
            stepSize: 2,
          },
          pointLabels: {
            font: {
              size: 12,
            },
          },
        },
      },
    }
  }

  updateDisciplineChart(stats: StatistiqueIndiv): void {
    this.currentChartType = "doughnut"

    this.barChartData = {
      labels: ["Yellow Cards", "Red Cards", "Fouls Committed"],
      datasets: [
        {
          data: [stats.cartonsJaunes || 0, stats.cartonsRouges || 0, stats.fautesCommises || 0],
          backgroundColor: [
            this.statColors.cartonsJaunes,
            this.statColors.cartonsRouges,
            this.statColors.fautesCommises,
          ],
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    }

    this.barChartOptions = {
      ...this.barChartOptions,
      scales: undefined,
      plugins: {
        ...this.barChartOptions.plugins,
        legend: {
          display: true,
          position: "bottom",
        },
      },
    }
  }

  closeModalStatistic(): void {
    this.isModalOpenStatistic = false
    this.statistiques = [] // Reset statistics list
  }



  refreshPlayers(): void {
    this.joueurService.getAllJoueurs().subscribe({
      next: (players) => {
        this.formation.joueurs = players;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des joueurs :", err);
      }
    });
  }
  
  maketito(idj: number): void {
    this.joueurService.maketitulaire(idj).subscribe({
      next: (updatedPlayer) => {
        console.log("Joueur mis à jour :", updatedPlayer);
        this.refreshPlayers(); // ✅ Recharge les données après mise à jour
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour du joueur :", err);
      }
    });
  }
  
  
}

