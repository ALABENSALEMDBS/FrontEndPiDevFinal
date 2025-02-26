import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TournoiService } from 'src/app/services/serviceSuperAdmin/servicegerertournoi/tournoi.service';

@Component({
    selector: 'app-update-tournoi',
    templateUrl: './update-tournoi.component.html',
    styleUrls: ['./update-tournoi.component.css'],
    standalone: false
})
export class UpdateTournoiComponent implements OnInit {

    idTournoi: any;
    tournoiForm!: FormGroup;
    listTournoi: any[] = [];
  
    constructor(private act: ActivatedRoute, private tournoiservice: TournoiService, private router: Router) { }
  


  ngOnInit(): void {
    this.idTournoi = this.act.snapshot.params['idTournoi']; // Récupérer l'ID du sous-groupe



     // Initialisation du formulaire
        this.tournoiForm = new FormGroup({
          idTournoi: new FormControl({value: '', disabled: true}),
          nameTournoi: new FormControl('', [Validators.required, Validators.minLength(3)]),
          debutTournoi: new FormControl('', [Validators.required]),
          finTournoi: new FormControl('', [Validators.required])
        });
    
        // Charger les données du sous-groupe à modifier
        this.tournoiservice.getbyidTournoi(this.idTournoi).subscribe((data) => {
          this.listTournoi = [data]; 
          this.tournoiForm.patchValue(this.listTournoi[0]);
        });
  }

  get nameTournoi() {
    return this.tournoiForm.get('nameTournoi');
  }

  get debutTournoi() {
    return this.tournoiForm.get('debutTournoi');
  }
  get finTournoi() {
    return this.tournoiForm.get('finTournoi');
  }



  updateTournoi() {
    if (this.tournoiForm.valid) {
      this.tournoiservice.updatetournoi( this.idTournoi,this.tournoiForm.value).subscribe(() => {
        this.tournoiForm.reset();
        window.location.reload();
      });
    }
  }
}
