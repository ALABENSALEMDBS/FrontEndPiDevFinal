// import { Component, OnInit } from '@angular/core';
// import { MatchService } from 'src/app/services/serviceSuperAdmin/servicegerermatch/match.service';

// @Component({
//     selector: 'app-accueil',
//     templateUrl: './accueil.component.html',
//     styleUrls: ['./accueil.component.css'],
//     standalone: false
// })
// export class AccueilComponent implements OnInit {

//     numberOfTotalMatchs!: number;
//     numberofTotalCompetitions!: number;
//     numberOfTotalCups!: number;
//     pourcentageOfPlayed!: number;
//     pourcentageOfNotPlayed!: number;


  
//     constructor(private matchService: MatchService) {}
  
//     ngOnInit(): void {
//       this.getTotalNumberOfMatches();
//       this.getTotalNumberOfCompetitions();
//       this.getTotalNumberOfCups();
//       this.pourcentageOfTotalNotPlayedMatches();
//       this.pourcentageOfTotalPlayedMatches();
//     }
  
//     private getTotalNumberOfMatches(): void {
//       this.matchService.getTotalNumberOfMatches().subscribe({
//         next: (count) => this.numberOfTotalMatchs = count,
//         error: (err) => console.error('Failed to fetch total matches:', err)
//       });
//     }
  
//     private getTotalNumberOfCompetitions(): void {
//       this.matchService.getTotalNumberOfCompetitions().subscribe({
//         next: (count) => this.numberofTotalCompetitions = count,
//         error: (err) => console.error('Failed to fetch total competitions:', err)
//       });
//     }
  
//     private getTotalNumberOfCups(): void {
//       this.matchService.getTotalNumberOfCups().subscribe({
//         next: (count) => this.numberOfTotalCups = count,
//         error: (err) => console.error('Failed to fetch total cups:', err)
//       });
//     }


//     private pourcentageOfTotalPlayedMatches(): void {
//         this.matchService.pourcentageOfTotalPlayedMatches().subscribe({
//           next: (count) => this.pourcentageOfPlayed = count,
//           error: (err) => console.error('Failed to fetch pourcentage of played:', err)
//         });
//     }

//     private pourcentageOfTotalNotPlayedMatches(): void {
//         this.matchService.pourcentageOfTotalNotPlayedMatches().subscribe({
//           next: (count) => this.pourcentageOfNotPlayed = count,
//           error: (err) => console.error('Failed to fetch pourcentage of not played:', err)
//         });
//     }


//   }




import { Component, OnInit } from "@angular/core"
import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service"

@Component({
  selector: "app-accueil",
  templateUrl: "./accueil.component.html",
  styleUrls: ["./accueil.component.css"],
  standalone: false,
})
export class AccueilComponent implements OnInit {
  numberOfTotalMatchs!: number
  numberofTotalCompetitions!: number
  numberOfTotalCups!: number
  pourcentageOfPlayed!: number
  pourcentageOfNotPlayed!: number



  percentageWinsFriendly!: number;
  percentageDrawsFriendly!: number;

  percentageWinsCompetitions!: number;
  percentageDrawsCompetitions!: number;

  percentageWinsCups!: number;
  percentageDrawsCups!: number;



  

  // Add loading state to show skeleton loaders
  loading = true

  // Add these properties to the AccueilComponent class:
  activeTab = "revenue" // Default active tab

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    this.fetchAllData()
  }

  // Method to change the active tab
  setActiveTab(tab: string): void {
    this.activeTab = tab
  }

  // Fetch all data at once and handle loading state
  private fetchAllData(): void {
    // Set loading to true initially
    this.loading = true

    // Create an array of all observables
    const observables = [
      this.matchService.getTotalNumberOfMatches(),
      this.matchService.getTotalNumberOfCompetitions(),
      this.matchService.getTotalNumberOfCups(),
      this.matchService.pourcentageOfTotalPlayedMatches(),
      this.matchService.pourcentageOfTotalNotPlayedMatches(),


    this.matchService.getPercentageOfWinsFriendly(),
    this.matchService.getPercentageOfDrawsFriendly(),

    this.matchService.getPercentageOfWinsCups(),
    this.matchService.getPercentageOfDrawsCups(),

 
    this.matchService.getPercentageOfWinsCompetitions(),
    this.matchService.getPercentageOfDrawsCompetitions(),


    ]

    // Use Promise.all to wait for all requests to complete
    Promise.all(
      observables.map(
        (obs) =>
          new Promise<any>((resolve) => {
            obs.subscribe({
              next: (value) => resolve(value),
              error: (err) => {
                console.error("Error fetching data:", err)
                resolve(null)
              },
            })
          }),
      ),
    ).then((results) => {
      ;[
        this.numberOfTotalMatchs,
        this.numberofTotalCompetitions,
        this.numberOfTotalCups,
        this.pourcentageOfPlayed,
        this.pourcentageOfNotPlayed,


        this.percentageWinsFriendly,
        this.percentageDrawsFriendly,
      
        this.percentageWinsCompetitions,
        this.percentageDrawsCompetitions,
      
        this.percentageWinsCups,
        this.percentageDrawsCups,

        
      ] = results

      // Set loading to false when all data is fetched
      this.loading = false
    })
  }

  private getTotalNumberOfMatches(): void {
    this.matchService.getTotalNumberOfMatches().subscribe({
      next: (count) => (this.numberOfTotalMatchs = count),
      error: (err) => console.error("Failed to fetch total matches:", err),
    })
  }

  private getTotalNumberOfCompetitions(): void {
    this.matchService.getTotalNumberOfCompetitions().subscribe({
      next: (count) => (this.numberofTotalCompetitions = count),
      error: (err) => console.error("Failed to fetch total competitions:", err),
    })
  }

  private getTotalNumberOfCups(): void {
    this.matchService.getTotalNumberOfCups().subscribe({
      next: (count) => (this.numberOfTotalCups = count),
      error: (err) => console.error("Failed to fetch total cups:", err),
    })
  }

  private pourcentageOfTotalPlayedMatches(): void {
    this.matchService.pourcentageOfTotalPlayedMatches().subscribe({
      next: (count) => (this.pourcentageOfPlayed = count),
      error: (err) => console.error("Failed to fetch pourcentage of played:", err),
    })
  }

  private pourcentageOfTotalNotPlayedMatches(): void {
    this.matchService.pourcentageOfTotalNotPlayedMatches().subscribe({
      next: (count) => (this.pourcentageOfNotPlayed = count),
      error: (err) => console.error("Failed to fetch pourcentage of not played:", err),
    })
  }





  getPercentageWinsFriendly(): void {
    this.matchService.getPercentageOfWinsFriendly().subscribe({
      next: data => this.percentageWinsFriendly = data,
      error: err => console.error('Wins Friendly error', err)
    });
  }

  getPercentageDrawsFriendly(): void {
    this.matchService.getPercentageOfDrawsFriendly().subscribe({
      next: data => this.percentageDrawsFriendly = data,
      error: err => console.error('Draws Friendly error', err)
    });
  }

  getPercentageWinsCompetitions(): void {
    this.matchService.getPercentageOfWinsCompetitions().subscribe({
      next: data => this.percentageWinsCompetitions = data,
      error: err => console.error('Wins Competitions error', err)
    });
  }

  getPercentageDrawsCompetitions(): void {
    this.matchService.getPercentageOfDrawsCompetitions().subscribe({
      next: data => this.percentageDrawsCompetitions = data,
      error: err => console.error('Draws Competitions error', err)
    });
  }

  getPercentageWinsCups(): void {
    this.matchService.getPercentageOfWinsCups().subscribe({
      next: data => this.percentageWinsCups = data,
      error: err => console.error('Wins Cups error', err)
    });
  }

  getPercentageDrawsCups(): void {
    this.matchService.getPercentageOfDrawsCups().subscribe({
      next: data => this.percentageDrawsCups = data,
      error: err => console.error('Draws Cups error', err)
    });
  }







}
