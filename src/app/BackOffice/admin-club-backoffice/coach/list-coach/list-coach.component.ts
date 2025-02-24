import { Component } from '@angular/core';
import { GerercoatchService } from 'src/app/services/serviceAdminClub/serviceGererCoatch/gerercoatch.service';
import { Coach } from 'src/core/models/coach';

@Component({
  selector: 'app-list-coach',
  templateUrl: './list-coach.component.html',
  styleUrls: ['./list-coach.component.css']
})
export class ListCoachComponent {

    coach: Coach[] = [];
    constructor(private coatchService: GerercoatchService) {}


    ngOnInit(): void {
      this.getCoach();
    }

    getCoach(): void {
      this.coatchService.getAllCach().subscribe(data => {
        this.coach = data;
      });
    }


    deleteCoach(id:any){
      this.coatchService.delCoach(id).subscribe(()=>{
        console.log("deleted exercices !!!!")
        window.location.reload()
      })
    }


}
