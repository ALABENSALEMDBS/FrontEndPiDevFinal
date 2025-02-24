import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GerercoatchService } from 'src/app/services/serviceAdminClub/serviceGererCoatch/gerercoatch.service';

@Component({
  selector: 'app-update-coach',
  templateUrl: './update-coach.component.html',
  styleUrls: ['./update-coach.component.css']
})
export class UpdateCoachComponent implements OnInit  {


      idUser: any;
      coachForm!: FormGroup;
      listcoach: any[] = [];

      constructor(private act: ActivatedRoute, private coatchService: GerercoatchService, private router: Router) { }

      ngOnInit(): void {
        this.idUser = this.act.snapshot.params['idUser'];


       // Initialisation du formulaire
          this.coachForm = new FormGroup({
          nameUsers: new FormControl('', [Validators.required, Validators.minLength(3)]),
          prenomUser: new FormControl('', [Validators.required, Validators.minLength(3)]),
          emailUser: new FormControl('', [Validators.required, Validators.email]),
          telephoneUser: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]) // 10 chiffres

          });

          // Charger les données du sous-groupe à modifier
          this.coatchService.getbyidCoach(this.idUser).subscribe((data) => {
            this.listcoach = [data];
            this.coachForm.patchValue(this.listcoach[0]);
          });
      }

      get nameUsers() {
        return this.coachForm.get('nameUsers');
      }

      get prenomUser() {
        return this.coachForm.get('prenomUser');
      }

      get emailUser() {
        return this.coachForm.get('emailUser');
      }

      get telephoneUser() {
        return this.coachForm.get('telephoneUser');
      }

      updateCoach() {
        if (this.coachForm.valid) {
          this.coatchService.updateCoach( this.idUser,this.coachForm.value).subscribe(() => {
            this.coachForm.reset();
            window.location.reload();
          });
        }
      }

}
