import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationService } from 'src/app/services/serviceCoatch/serviceformation/formation.service';

@Component({
    selector: 'app-updateformation',
    templateUrl: './updateformation.component.html',
    styleUrls: ['./updateformation.component.css'],
    standalone: false
})
export class UpdateformationComponent implements OnInit {
  @Input() formationData: any;  // Ajout de l'Input pour recevoir la formation sélectionnée

    idFormation: any;
    formationForm!: FormGroup;
    listFormation: any[] = [];
  
    constructor(private act: ActivatedRoute, private servise: FormationService, private router: Router) { }
 
    ngOnInit(): void {
      this.idFormation = this.act.snapshot.params['idFormation'];

      
        console.error(this.formationData.idFormation);
      

     // Initialisation du formulaire
        this.formationForm = new FormGroup({
          idFormation: new FormControl({value: '', disabled: true}), // Ajout champ idSousGroup
          nameFormation: new FormControl('', [Validators.required, Validators.minLength(3)]),
          descriptionFormation: new FormControl('', [Validators.required]),
        });
    
        // Charger les données du sous-groupe à modifier
        this.servise.getbyidformation(this.formationData.idFormation).subscribe((data) => {
          this.listFormation = [data];
          this.formationForm.patchValue(this.listFormation[0]);
        });
    }
  
    get nameFormation() {
      return this.formationForm.get('nameFormation');
    }
  
    get descriptionFormation() {
      return this.formationForm.get('descriptionFormation');
    }

    updateFormation() {
      if (this.formationForm.valid) {
        this.servise.updateformation( this.formationData.idFormation,this.formationForm.value).subscribe(() => {
          this.formationForm.reset();

          this.router.navigate(['coatch/showFormation']).then(() => {
            window.location.reload();  // This will reload the page after navigation
          });

        });
      }
    }

}
