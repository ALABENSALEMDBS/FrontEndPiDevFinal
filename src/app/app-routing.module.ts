
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './BackOffice/admin-backoffice/accueil/accueil.component';
import { AllTemplateBackComponent } from './BackOffice/admin-backoffice/all-template-back/all-template-back.component';
import { AddMatchComponent } from './BackOffice/admin-backoffice/match/add-match/add-match.component';
import { ListMatchComponent } from './BackOffice/admin-backoffice/match/list-match/list-match.component';
import { UpdateMatchComponent } from './BackOffice/admin-backoffice/match/update-match/update-match.component';
import { AddTournoiComponent } from './BackOffice/admin-backoffice/tournoi/add-tournoi/add-tournoi.component';
import { ListTournoiComponent } from './BackOffice/admin-backoffice/tournoi/list-tournoi/list-tournoi.component';
import { UpdateTournoiComponent } from './BackOffice/admin-backoffice/tournoi/update-tournoi/update-tournoi.component';
import { AcceuilAdminClubComponent } from './BackOffice/admin-club-backoffice/acceuil-admin-club/acceuil-admin-club.component';
import { AllTemplateClubComponent } from './BackOffice/admin-club-backoffice/all-template-club/all-template-club.component';
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
//import { UpdatesousGroupComponent } from './FrontOffice/CoachFrontOffice/updatesous-group/updatesous-group.component';
//import { AllTemplateDoctorFrontComponent } from './FrontOffice/DoctorFrontOffice/all-template-doctor-front/all-template-doctor-front.component';
import { DoctorComponent } from './FrontOffice/DoctorFrontOffice/doctor/doctor.component';
import { HomeDoctorsComponent } from './FrontOffice/DoctorFrontOffice/home-doctors/home-doctors.component';
import { HomePageComponent } from './FrontOffice/HomePages/home-page/home-page.component';
import { AllTemplateDoctorFrontComponent } from './FrontOffice/DoctorFrontOffice/all-template-doctor-front/all-template-doctor-front.component';
//import { AddTacticComponent } from './FrontOffice/CoachFrontOffice/add-tactic/add-tactic.component';
//import { HomeCoachComponent } from './FrontOffice/CoachFrontOffice/homeCoach/home-coach/home-coach.component';
//import { FormationCoachComponent } from './FrontOffice/CoachFrontOffice/formation-coach/formation-coach.component';
//import { SousgroupComponent } from './FrontOffice/CoachFrontOffice/sousgroup/sousgroup.component';
import { UpdatesousGroupComponent } from './FrontOffice/CoachFrontOffice/updatesous-group/updatesous-group.component';
//import { AddsousgroupComponent } from './FrontOffice/CoachFrontOffice/addsousgroup/addsousgroup.component';
//import { AccueilComponent } from './BackOffice/accueil/accueil.component';
import { CreateUpdateFicheMedicalComponent } from './FrontOffice/DoctorFrontOffice/FicheMedical/create-update-fiche-medical/create-update-fiche-medical.component';
import { ListeFicheMedicalComponent } from './FrontOffice/DoctorFrontOffice/FicheMedical/liste-fiche-medical/liste-fiche-medical.component';
import { ListeExerciceRetablissementComponent } from './FrontOffice/DoctorFrontOffice/ExcerciceRetablissement/liste-exercice-retablissement/liste-exercice-retablissement.component';
import { CreateExerciceRetablissementComponent } from './FrontOffice/DoctorFrontOffice/ExcerciceRetablissement/create-exercice-retablissement/create-exercice-retablissement.component';
import { UpdateExerciceRetablissementComponent } from './FrontOffice/DoctorFrontOffice/ExcerciceRetablissement/update-exercice-retablissement/update-exercice-retablissement.component';
import { UpdateFicheMedicaleComponent } from './FrontOffice/DoctorFrontOffice/FicheMedical/update-fiche-medicale/update-fiche-medicale.component';
import { CreateNourritureComponent } from './FrontOffice/DoctorFrontOffice/Nouriture/create-nourriture/create-nourriture.component';
import { UpdateNourritureComponent } from './FrontOffice/DoctorFrontOffice/Nouriture/update-nourriture/update-nourriture.component';
import { ListeNourritureComponent } from './FrontOffice/DoctorFrontOffice/Nouriture/liste-nourriture/liste-nourriture.component';
import { AllTemplatePlayerFrontComponent } from './FrontOffice/PlayerFrontOffice/all-template-player-front/all-template-player-front.component';
import { VideComponent } from './FrontOffice/CoachFrontOffice/vide/vide.component';
import { HomeAnalysteComponent } from './FrontOffice/AnalysteFrontOffice/home-analyste/home-analyste.component';
import { ListRapportComponent } from './FrontOffice/AnalysteFrontOffice/rapport/list-rapport/list-rapport.component';
import { AddRapportComponent } from './FrontOffice/AnalysteFrontOffice/rapport/add-rapport/add-rapport.component';
import { UpdateRapportComponent } from './FrontOffice/AnalysteFrontOffice/rapport/update-rapport/update-rapport.component';
import { UploadExerciceComponent } from './FrontOffice/DoctorFrontOffice/upload-exercice/upload-exercice.component';
import { ChartsdoctorComponent } from './BackOffice/admin-club-backoffice/chartsdoctor/chartsdoctor.component';
import { CalanderDoctorComponent } from './FrontOffice/DoctorFrontOffice/calander-doctor/calander-doctor.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {path:'home',component:HomePageComponent},


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
      {
        path: 'showmatch',
        component: ListMatchComponent,
        children: [
          { path: 'update/:idMatch', component: UpdateMatchComponent },
          { path: 'addmatch', component: AddMatchComponent },
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
      {path:"chartblesseure",component:ChartsdoctorComponent}

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

            { path: '', redirectTo: '/doctor/Homedoctors', pathMatch: 'full' },
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
            ,{
              path:'uploadexercice',
              component:UploadExerciceComponent
            }
            ,
            {
              path:'clanderdoctor',
              component:CalanderDoctorComponent
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
          { path: '', redirectTo: 'vide', pathMatch: 'full' },
          {path: 'vide', component: VideComponent },
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
          { path: '', redirectTo: 'vide', pathMatch: 'full' },
          {path: 'vide', component: VideComponent },
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
    component:AllTemplateAnalysteFrontComponent,
    children: [
      { path: '', redirectTo: 'Homeanalyste', pathMatch: 'full' },
      { path: 'Homeanalyste', component: HomeAnalysteComponent  },
      {
        path: 'Reportshow',
        component:ListRapportComponent ,
        children: [
          { path: 'update/:idRapport', component: UpdateRapportComponent },
          { path: 'addreports', component: AddRapportComponent },
        ]
      }]
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
