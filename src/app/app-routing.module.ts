import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { DoctorComponent } from './FrontOffice/DoctorFrontOffice/doctor/doctor.component';
import { HomeDoctorsComponent } from './FrontOffice/DoctorFrontOffice/home-doctors/home-doctors.component';
import { StateticComponent } from './BackOffice/statetic/statetic.component';
import { AllTemplateCoachFrontComponent } from './FrontOffice/CoachFrontOffice/all-template-coach-front/all-template-coach-front.component';
import { AllTemplatePlayerFrontComponent } from './FrontOffice/PlayerFrontOffice/all-template-player-front/all-template-player-front.component';
import { AllTemplateAnalysteFrontComponent } from './FrontOffice/AnalysteFrontOffice/all-template-analyste-front/all-template-analyste-front.component';
import { HomePageComponent } from './FrontOffice/HomePages/home-page/home-page.component';
import { AllTemplateDoctorFrontComponent } from './FrontOffice/DoctorFrontOffice/all-template-doctor-front/all-template-doctor-front.component';
import { AddTacticComponent } from './FrontOffice/CoachFrontOffice/add-tactic/add-tactic.component';
import { HomeCoachComponent } from './FrontOffice/CoachFrontOffice/homeCoach/home-coach/home-coach.component';
import { FormationCoachComponent } from './FrontOffice/CoachFrontOffice/formation-coach/formation-coach.component';
import { SousgroupComponent } from './FrontOffice/CoachFrontOffice/sousgroup/sousgroup.component';
import { UpdatesousGroupComponent } from './FrontOffice/CoachFrontOffice/updatesous-group/updatesous-group.component';
import { AddsousgroupComponent } from './FrontOffice/CoachFrontOffice/addsousgroup/addsousgroup.component';
import { AccueilComponent } from './BackOffice/accueil/accueil.component';
import { CreateUpdateFicheMedicalComponent } from './FrontOffice/DoctorFrontOffice/FicheMedical/create-update-fiche-medical/create-update-fiche-medical.component';
import { ListeFicheMedicalComponent } from './FrontOffice/DoctorFrontOffice/FicheMedical/liste-fiche-medical/liste-fiche-medical.component';
import { ListeExerciceRetablissementComponent } from './FrontOffice/DoctorFrontOffice/ExcerciceRetablissement/liste-exercice-retablissement/liste-exercice-retablissement.component';
import { CreateExerciceRetablissementComponent } from './FrontOffice/DoctorFrontOffice/ExcerciceRetablissement/create-exercice-retablissement/create-exercice-retablissement.component';
import { UpdateExerciceRetablissementComponent } from './FrontOffice/DoctorFrontOffice/ExcerciceRetablissement/update-exercice-retablissement/update-exercice-retablissement.component';
import { UpdateFicheMedicaleComponent } from './FrontOffice/DoctorFrontOffice/FicheMedical/update-fiche-medicale/update-fiche-medicale.component';
import { CreateNourritureComponent } from './FrontOffice/DoctorFrontOffice/Nouriture/create-nourriture/create-nourriture.component';
import { UpdateNourritureComponent } from './FrontOffice/DoctorFrontOffice/Nouriture/update-nourriture/update-nourriture.component';
import { ListeNourritureComponent } from './FrontOffice/DoctorFrontOffice/Nouriture/liste-nourriture/liste-nourriture.component';

const routes: Routes = [



  {

    path: 'admin',
    component: AllTemplateBackComponent,
    children:[
      {
        path:'static',
        component: StateticComponent
      },
      {
        path:'HomeAccueil',
        component: AccueilComponent
      },     
      
    ]
  }
  ,

  // {

  //   path: '',
  //   component: AllTemplateFrontComponent,
  //   children:[
  //     {
  //       path:'doctors',
  //       component: DoctorComponent
  //     },
  //     {
  //         path: 'Homedoctors',
  //         component:HomeDoctorsComponent
  //     }

  //   ]
  // },
  {
    path:'doctor',
    component:AllTemplateDoctorFrontComponent,

    children:[ {

              path:'Fichedoctors',
              component: DoctorComponent
            },
            {
                path: 'Homedoctors',
                component:HomeDoctorsComponent
            } ,
            {
              path:'fichePlayer',
              component:CreateUpdateFicheMedicalComponent
            } ,
            {
              path:'update-fiche-player',
              component: UpdateFicheMedicaleComponent
            },
            {
              path:'listefiche',
              component:ListeFicheMedicalComponent
              
            },
            
            {
              path:'listeExercicedeRetablissement',
              component:ListeExerciceRetablissementComponent

            },
            {
              path:'creationexerciceRetab',
              component:CreateExerciceRetablissementComponent
            },
            {
              path:'updateexercice/:id',
              component:UpdateExerciceRetablissementComponent
            },

            { path: '', redirectTo: '/doctor/listefiche', pathMatch: 'full' },
            {
              path:'createnouriture',
              component:CreateNourritureComponent

            },
            {
              path:'updatenouriture',
              component:UpdateNourritureComponent

            },
            {
              path:'listenouriture',
              component:ListeNourritureComponent

            }


            
    ]
  },
  {
    path: 'coatch',
    component: AllTemplateCoachFrontComponent,
    children: [
      { path: '', redirectTo: 'AddTactic', pathMatch: 'full' },
      { path: 'AddTactic', component: AddTacticComponent },
      { path: 'HomeCoach', component: HomeCoachComponent },
      { path: 'AjouterFormation', component: FormationCoachComponent },
      {
        path: 'ShowSousGroups',
        component: SousgroupComponent,
        children: [
          { path: 'update/:idSousGroup', component: UpdatesousGroupComponent },
          { path: 'addsousgroup', component: AddsousgroupComponent }
        ]
      }
    ]
  }
  ,
  {
    path:'player',
    component:AllTemplatePlayerFrontComponent


  },
  {
    path:'analyste',
    component:AllTemplateAnalysteFrontComponent

  },

  {
    path:'home',
    component:HomePageComponent
  }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
