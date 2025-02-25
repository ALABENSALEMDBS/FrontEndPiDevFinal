import { Component, OnInit } from '@angular/core';
import { TournoiService } from 'src/app/services/serviceSuperAdmin/servicegerertournoi/tournoi.service';
import { Tournois } from 'src/core/models/tournois';

@Component({
  selector: 'app-list-tournoi',
  templateUrl: './list-tournoi.component.html',
  styleUrls: ['./list-tournoi.component.css']
})
export class ListTournoiComponent implements OnInit {
  tournois: Tournois[] = [];

  constructor(private tournoisService: TournoiService) {}

  ngOnInit(): void {
    this.tournoisService.getAllTournoi().subscribe((data) => {
      this.tournois = data;
    });
  }



  deleteTournoi(id:number): void{
    this.tournoisService.delTournoi(id).subscribe(()=>{
      console.log("deleted exercices !!!!")
      window.location.reload()
    })
  }
}
