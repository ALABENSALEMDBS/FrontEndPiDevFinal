import { Component } from '@angular/core';
import { ExerciceService } from 'src/app/services/serviceCoatch/serviceExercice/exercice.service';
import { Exercices } from 'src/core/models/exercice';

@Component({
    selector: 'app-list-exercice',
    templateUrl: './list-exercice.component.html',
    styleUrls: ['./list-exercice.component.css'],
    standalone: false
})
export class ListExerciceComponent {
 exercice: Exercices[] = [];

      constructor(private coatchService: ExerciceService) {}

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


