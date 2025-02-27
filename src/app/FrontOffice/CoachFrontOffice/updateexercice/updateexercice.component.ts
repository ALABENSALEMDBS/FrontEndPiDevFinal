import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciceService } from 'src/app/services/serviceCoatch/serviceExercice/exercice.service';

@Component({
    selector: 'app-updateexercice',
    templateUrl: './updateexercice.component.html',
    styleUrls: ['./updateexercice.component.css'],
    standalone: false
})
export class UpdateexerciceComponent implements OnInit {

   idExercice: any;
    exerciceform!: FormGroup;
    listexercice: any[] = [];
  
    constructor(private act: ActivatedRoute, private servise: ExerciceService, private router: Router) { }
 
    ngOnInit(): void {
      this.idExercice = this.act.snapshot.params['idExercice'];


     // Initialisation du formulaire
        this.exerciceform = new FormGroup({
          idExercice: new FormControl({value: '', disabled: true}), // Ajout champ idSousGroup
          nameExercice: new FormControl('', [Validators.required, Validators.minLength(3)]),
          descriptionExercice: new FormControl('', [Validators.required]),
          videoExercice: new FormControl('', [Validators.required]),
          photoExercice: new FormControl('', [Validators.required]),

        });
    
        // Charger les données du sous-groupe à modifier
        this.servise.getbyidExercices(this.idExercice).subscribe((data) => {
          this.listexercice = [data];
          this.exerciceform.patchValue(this.listexercice[0]);
        });
    }
  
    get nameExercice() {
      return this.exerciceform.get('nameExercice');
    }
  
    get descriptionExercice() {
      return this.exerciceform.get('descriptionExercice');
    }
    get videoExercice() {
      return this.exerciceform.get('videoExercice');
    }
  
    get photoExercice() {
      return this.exerciceform.get('photoExercice');
    }

    updateExercice() {
      if (this.exerciceform.valid) {
        this.servise.updateExercices( this.idExercice,this.exerciceform.value).subscribe(() => {
          this.exerciceform.reset();
          window.location.reload();
        });
      }
    }

}