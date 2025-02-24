import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './BackOffice/admin-backoffice/accueil/accueil.component';
import { AllTemplateBackComponent } from './BackOffice/admin-backoffice/all-template-back/all-template-back.component';
import { AllTemplateAnalysteFrontComponent } from './FrontOffice/AnalysteFrontOffice/all-template-analyste-front/all-template-analyste-front.component';
import { AddTacticComponent } from './FrontOffice/CoachFrontOffice/add-tactic/add-tactic.component';
import { AddexerciceComponent } from './FrontOffice/CoachFrontOffice/addexercice/addexercice.component';
import { AddformationComponent } from './FrontOffice/CoachFrontOffice/addformation/addformation.component';
import { AddseanceComponent } from './FrontOffice/CoachFrontOffice/addseance/addseance.component';
import { AddsousgroupComponent } from './FrontOffice/CoachFrontOffice/addsousgroup/addsousgroup.component';
import { AllTemplateCoachFrontComponent } from './FrontOffice/CoachFrontOffice/all-template-coach-front/all-template-coach-front.component';
import { FormationCoachComponent } from './FrontOffice/CoachFrontOffice/formation-coach/formation-coach.component';
import { HomeCoachComponent } from './FrontOffice/CoachFrontOffice/homeCoach/home-coach/home-coach.component';
import { ListExerciceComponent } from './FrontOffice/CoachFrontOffice/list-exercice/list-exercice.component';
import { ListSeanceComponent } from './FrontOffice/CoachFrontOffice/list-seance/list-seance.component';
import { ListTacticComponent } from './FrontOffice/CoachFrontOffice/list-tactic/list-tactic.component';
import { SousgroupComponent } from './FrontOffice/CoachFrontOffice/sousgroup/sousgroup.component';
import { UpdateexerciceComponent } from './FrontOffice/CoachFrontOffice/updateexercice/updateexercice.component';
import { UpdateformationComponent } from './FrontOffice/CoachFrontOffice/updateformation/updateformation.component';
import { UpdateseanceComponent } from './FrontOffice/CoachFrontOffice/updateseance/updateseance.component';
import { UpdatesousGroupComponent } from './FrontOffice/CoachFrontOffice/updatesous-group/updatesous-group.component';
import { AllTemplateDoctorFrontComponent } from './FrontOffice/DoctorFrontOffice/all-template-doctor-front/all-template-doctor-front.component';
import { DoctorComponent } from './FrontOffice/DoctorFrontOffice/doctor/doctor.component';
import { HomeDoctorsComponent } from './FrontOffice/DoctorFrontOffice/home-doctors/home-doctors.component';
import { HomePageComponent } from './FrontOffice/HomePages/home-page/home-page.component';
import { AllTemplatePlayerFrontComponent } from './FrontOffice/PlayerFrontOffice/all-template-player-front/all-template-player-front.component';
import { AcceuilAdminClubComponent } from './BackOffice/admin-club-backoffice/acceuil-admin-club/acceuil-admin-club.component';
import { AllTemplateClubComponent } from './BackOffice/admin-club-backoffice/all-template-club/all-template-club.component';
import { ListJoueurComponent } from './BackOffice/admin-club-backoffice/joueur/list-joueur/list-joueur.component';
import { AddJoueurComponent } from './BackOffice/admin-club-backoffice/joueur/add-joueur/add-joueur.component';
import { UpdateJoueurComponent } from './BackOffice/admin-club-backoffice/joueur/update-joueur/update-joueur.component';
import { ListTournoiComponent } from './BackOffice/admin-backoffice/tournoi/list-tournoi/list-tournoi.component';
import { UpdateTournoiComponent } from './BackOffice/admin-backoffice/tournoi/update-tournoi/update-tournoi.component';
import { AddTournoiComponent } from './BackOffice/admin-backoffice/tournoi/add-tournoi/add-tournoi.component';

const routes: Routes = [



  {
    path: 'superadmin',
    component: AllTemplateBackComponent,
    children:[
      { path: '', redirectTo: 'HomeAccueilsuperadmin', pathMatch: 'full' },
      {path:'HomeAccueilsuperadmin',component: AccueilComponent},
      {
        path: 'showtournoi',
        component: ListTournoiComponent,
        children: [
          { path: 'update/:idTournoi', component: UpdateTournoiComponent },
          { path: 'addtournoi', component: AddTournoiComponent },
        ]
      },
    ]
  },

  {
    path: 'clubadmin',
    component: AllTemplateClubComponent,
    children:[
      { path: '', redirectTo: 'HomeAccueilclubadmin', pathMatch: 'full' },
      {path:'HomeAccueilclubadmin',component: AcceuilAdminClubComponent},
      {path:'ListJoueurs',component: ListJoueurComponent},
      {path:'AddJoueur',component: AddJoueurComponent},
      {path:'UpdateJoueur',component: UpdateJoueurComponent},

    ]
  },

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
