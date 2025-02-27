import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SeanceService } from 'src/app/services/serviceCoatch/serviceSeance/seance.service';

@Component({
    selector: 'app-updateseance',
    templateUrl: './updateseance.component.html',
    styleUrls: ['./updateseance.component.css'],
    standalone: false
})
export class UpdateseanceComponent {
  @Input() seanceData: any;  // Ajoute cette ligne

  idSeance: any;
  seanceform!: FormGroup;
  listseance: any[] = [];

  constructor(private act: ActivatedRoute, private service: SeanceService, private router: Router) { }

  ngOnInit(): void {
    this.idSeance = this.act.snapshot.params['idSeance'];

    // Initialisation du formulaire
    this.seanceform = new FormGroup({
      idSeance: new FormControl({ value: '', disabled: true }), // Champ désactivé
      titleSeance: new FormControl('', [Validators.required, Validators.minLength(3)]),
      jourSeance: new FormControl('', [Validators.required]),
    });

    // Charger les données de la séance à modifier
    this.service.getbyidSeances(this.seanceData.idSeance).subscribe((data) => {
      this.listseance = [data];
      this.seanceform.patchValue(this.listseance[0]);
    });
   
  }

  get titleSeance() {
    return this.seanceform.get('titleSeance');
  }

  get jourSeance() {
    return this.seanceform.get('jourSeance');
  }

  updateSeance() {
    if (this.seanceform.valid) {
      this.service.updateSeances( this.seanceData.idSeance,this.seanceform.value).subscribe(() => {
        this.seanceform.reset();

        this.router.navigate(['coatch/showseance']).then(() => {
          window.location.reload();  // This will reload the page after navigation
        });

      });
    }
  }

}
