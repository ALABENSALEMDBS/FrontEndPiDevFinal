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
import { AddformationComponent } from './FrontOffice/CoachFrontOffice/addformation/addformation.component';
import { ListSeanceComponent } from './FrontOffice/CoachFrontOffice/list-seance/list-seance.component';
import { AddseanceComponent } from './FrontOffice/CoachFrontOffice/addseance/addseance.component';
import { ListExerciceComponent } from './FrontOffice/CoachFrontOffice/list-exercice/list-exercice.component';
import { AddexerciceComponent } from './FrontOffice/CoachFrontOffice/addexercice/addexercice.component';
import { UpdateformationComponent } from './FrontOffice/CoachFrontOffice/updateformation/updateformation.component';
import { UpdateseanceComponent } from './FrontOffice/CoachFrontOffice/updateseance/updateseance.component';
import { UpdateexerciceComponent } from './FrontOffice/CoachFrontOffice/updateexercice/updateexercice.component';
import { ListTacticComponent } from './FrontOffice/CoachFrontOffice/list-tactic/list-tactic.component';

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
            }
    ]
  },
  {
    path: 'coatch',
    component: AllTemplateCoachFrontComponent,
    children: [
      { path: '', redirectTo: 'HomeCoach', pathMatch: 'full' },
      { path: 'HomeCoach', component: HomeCoachComponent },
      {
        path: 'ShowSousGroups',
        component: SousgroupComponent,
        children: [
          { path: 'update/:idSousGroup', component: UpdatesousGroupComponent },
          { path: 'addsousgroup', component: AddsousgroupComponent },
        ]
      },

      {
        path: 'showFormation', component: FormationCoachComponent,
        children:[
          {path: 'addformation', component: AddformationComponent },
          {path: 'updateformation/:idFormation', component: UpdateformationComponent },

        ]
      },

      {
        path: 'showseance', component: ListSeanceComponent,
        children: [
          { path: 'addseance', component: AddseanceComponent },
          {path: 'updateseance/:idSeance', component: UpdateseanceComponent },

        ]
      },

      {
        path: 'showexercice', component: ListExerciceComponent,
        children:[
          {path: 'addexercice', component: AddexerciceComponent },
          {path: 'updateexercice/:idExercice', component: UpdateexerciceComponent },

        ]
      },

      {
        path: 'listTactic', component: ListTacticComponent,
        children:[
          {path: 'AddTactic', component: AddTacticComponent },

        ]
      },


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
