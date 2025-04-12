
import { Component, OnInit } from '@angular/core';
import { MatchService } from '../../../../services/serviceSuperAdmin/servicegerermatch/match.service';
import { Match } from '../../../../../core/models/match';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClubsService } from '../../../../services/serviceSuperAdmin/servicegererclubs/clubs.service';


@Component({
  selector: 'app-list-match',
  imports:[RouterOutlet,CommonModule,RouterLink,ReactiveFormsModule],
  templateUrl: './list-match.component.html',
  styleUrls: ['./list-match.component.css']
})
export class ListMatchComponent implements OnInit {
 match: Match[] = [];
  constructor(private MatchService: MatchService , private clubService: ClubsService) {}


  ngOnInit(): void {
    this.getMatchs();
    console.log(this.getClubs())
    
  }

  getMatchs(): void {
    this.MatchService.getAllMatchs().subscribe(data => {
      this.match = data;
      console.log(this.match);
    
    });
  }

  deleteMatchs(id:any){
    this.MatchService.delMatchs(id).subscribe(()=>{
      console.log("deleted !!!!")
      window.location.reload()
    })
  }

  // getClubs(){
  //   this.clubService.getAllClubs();
  // }

  getClubs() {
    this.clubService.getAllClubs().subscribe(
      (clubs) => {
        console.log(clubs); // This will print the fetched clubs
      },
      (error) => {
        console.error("Error fetching clubs:", error);
      }
    );
  }
  



}
