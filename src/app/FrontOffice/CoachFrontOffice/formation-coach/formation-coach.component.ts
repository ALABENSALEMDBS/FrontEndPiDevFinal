import { Component } from '@angular/core';
import { FormationService } from 'src/app/services/serviceCoatch/serviceformation/formation.service';
import { formation } from 'src/core/models/formation';

@Component({
  selector: 'app-formation-coach',
  templateUrl: './formation-coach.component.html',
  styleUrls: ['./formation-coach.component.css']
})
export class FormationCoachComponent {


   formation: formation[] = [];
  
    constructor(private coatchService: FormationService) {}
  
    ngOnInit(): void {
      this.getFormations();
    }
  
    getFormations(): void {
      this.coatchService.getAllFormation().subscribe(data => {
        this.formation = data;
      });
    }


    deleteFormation(id:any){
      this.coatchService.delFormation(id).subscribe(()=>{
        console.log("deleted Formation !!!!")
        window.location.reload()
      })
    }

}
