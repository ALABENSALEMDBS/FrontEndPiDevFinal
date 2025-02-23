import { Component } from '@angular/core';
import { CoatchService } from 'src/app/services/serviceCoatch/coatch.service';
import { Exercices } from 'src/core/models/exercice';

@Component({
  selector: 'app-list-exercice',
  templateUrl: './list-exercice.component.html',
  styleUrls: ['./list-exercice.component.css']
})
export class ListExerciceComponent {
 exercice: Exercices[] = [];
    
      constructor(private coatchService: CoatchService) {}
    
      ngOnInit(): void {
        this.getExercices();
      }
    
      getExercices(): void {
        this.coatchService.getAllExercices().subscribe(data => {
          this.exercice = data;
        });
      }
  
  
      deleteExercices(id:any){
        this.coatchService.delExercices(id).subscribe(()=>{
          console.log("deleted exercices !!!!")
          window.location.reload()
        })
      }
  
  }
  

