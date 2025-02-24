import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { DoctorComponent } from './FrontOffice/DoctorFrontOffice/doctor/doctor.component';
import { HomeDoctorsComponent } from './FrontOffice/DoctorFrontOffice/home-doctors/home-doctors.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllTemplateAnalysteFrontComponent } from './FrontOffice/AnalysteFrontOffice/all-template-analyste-front/all-template-analyste-front.component';
import { FooterAnalysteFrontComponent } from './FrontOffice/AnalysteFrontOffice/footer-analyste-front/footer-analyste-front.component';
import { HeaderAnalysteFrontComponent } from './FrontOffice/AnalysteFrontOffice/header-analyste-front/header-analyste-front.component';
import { AddTacticComponent } from './FrontOffice/CoachFrontOffice/add-tactic/add-tactic.component';
import { AddsousgroupComponent } from './FrontOffice/CoachFrontOffice/addsousgroup/addsousgroup.component';
import { AllTemplateCoachFrontComponent } from './FrontOffice/CoachFrontOffice/all-template-coach-front/all-template-coach-front.component';
import { FooterCoachFrontComponent } from './FrontOffice/CoachFrontOffice/footer-coach-front/footer-coach-front.component';
import { FormationCoachComponent } from './FrontOffice/CoachFrontOffice/formation-coach/formation-coach.component';
import { HeaderCoachFrontComponent } from './FrontOffice/CoachFrontOffice/header-coach-front/header-coach-front.component';
import { HomeCoachComponent } from './FrontOffice/CoachFrontOffice/homeCoach/home-coach/home-coach.component';
import { SousgroupComponent } from './FrontOffice/CoachFrontOffice/sousgroup/sousgroup.component';
import { UpdatesousGroupComponent } from './FrontOffice/CoachFrontOffice/updatesous-group/updatesous-group.component';
import { AllTemplateDoctorFrontComponent } from './FrontOffice/DoctorFrontOffice/all-template-doctor-front/all-template-doctor-front.component';
import { FooterDoctorFrontComponent } from './FrontOffice/DoctorFrontOffice/footer-doctor-front/footer-doctor-front.component';
import { HeaderDoctorFrontComponent } from './FrontOffice/DoctorFrontOffice/header-doctor-front/header-doctor-front.component';
import { HomePageComponent } from './FrontOffice/HomePages/home-page/home-page.component';
import { AllTemplatePlayerFrontComponent } from './FrontOffice/PlayerFrontOffice/all-template-player-front/all-template-player-front.component';
import { FooterPlayerFrontComponent } from './FrontOffice/PlayerFrontOffice/footer-player-front/footer-player-front.component';
import { HeaderPlayerFrontComponent } from './FrontOffice/PlayerFrontOffice/header-player-front/header-player-front.component';

import { AccueilComponent } from './BackOffice/admin-backoffice/accueil/accueil.component';
import { AllTemplateBackComponent } from './BackOffice/admin-backoffice/all-template-back/all-template-back.component';
import { FooterBackComponent } from './BackOffice/admin-backoffice/footer-back/footer-back.component';
import { HeaderBackComponent } from './BackOffice/admin-backoffice/header-back/header-back.component';
import { SidebarBackComponent } from './BackOffice/admin-backoffice/sidebar-back/sidebar-back.component';
import { AddexerciceComponent } from './FrontOffice/CoachFrontOffice/addexercice/addexercice.component';
import { AddformationComponent } from './FrontOffice/CoachFrontOffice/addformation/addformation.component';
import { AddseanceComponent } from './FrontOffice/CoachFrontOffice/addseance/addseance.component';
import { ListExerciceComponent } from './FrontOffice/CoachFrontOffice/list-exercice/list-exercice.component';
import { ListSeanceComponent } from './FrontOffice/CoachFrontOffice/list-seance/list-seance.component';
import { ListTacticComponent } from './FrontOffice/CoachFrontOffice/list-tactic/list-tactic.component';
import { UpdateexerciceComponent } from './FrontOffice/CoachFrontOffice/updateexercice/updateexercice.component';
import { UpdateformationComponent } from './FrontOffice/CoachFrontOffice/updateformation/updateformation.component';
import { UpdateseanceComponent } from './FrontOffice/CoachFrontOffice/updateseance/updateseance.component';
import { AllTemplateClubComponent } from './BackOffice/admin-club-backoffice/all-template-club/all-template-club.component';
import { FooterAdminClubComponent } from './BackOffice/admin-club-backoffice/footer-admin-club/footer-admin-club.component';
import { HeaderAdminClubComponent } from './BackOffice/admin-club-backoffice/header-admin-club/header-admin-club.component';
import { SidebarAdminClubComponent } from './BackOffice/admin-club-backoffice/sidebar-admin-club/sidebar-admin-club.component';
import { AcceuilAdminClubComponent } from './BackOffice/admin-club-backoffice/acceuil-admin-club/acceuil-admin-club.component';
import { ListJoueurComponent } from './BackOffice/admin-club-backoffice/joueur/list-joueur/list-joueur.component';
import { AddJoueurComponent } from './BackOffice/admin-club-backoffice/joueur/add-joueur/add-joueur.component';
import { UpdateJoueurComponent } from './BackOffice/admin-club-backoffice/joueur/update-joueur/update-joueur.component';
import { ListTournoiComponent } from './BackOffice/admin-backoffice/tournoi/list-tournoi/list-tournoi.component';
import { AddTournoiComponent } from './BackOffice/admin-backoffice/tournoi/add-tournoi/add-tournoi.component';
import { UpdateTournoiComponent } from './BackOffice/admin-backoffice/tournoi/update-tournoi/update-tournoi.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderBackComponent,
    SidebarBackComponent,
    AllTemplateBackComponent,
    FooterBackComponent,

    DoctorComponent,
    HomeDoctorsComponent,

    FooterCoachFrontComponent,
    AllTemplateCoachFrontComponent,
    HeaderCoachFrontComponent,
    HeaderDoctorFrontComponent,
    AllTemplateDoctorFrontComponent,
    FooterDoctorFrontComponent,
    FooterPlayerFrontComponent,
    AllTemplatePlayerFrontComponent,
    HeaderPlayerFrontComponent,
    HeaderAnalysteFrontComponent,
    AllTemplateAnalysteFrontComponent,
    FooterAnalysteFrontComponent,
    HomePageComponent,
    AddTacticComponent,
    HomeCoachComponent,
    FormationCoachComponent,
    SousgroupComponent,
    UpdatesousGroupComponent,
    AddsousgroupComponent,

    AccueilComponent,
      AddformationComponent,
      ListSeanceComponent,
      AddseanceComponent,
      AddexerciceComponent,
      ListExerciceComponent,
      UpdateformationComponent,
      UpdateexerciceComponent,
      UpdateseanceComponent,
      ListTacticComponent,
      AllTemplateClubComponent,
      FooterAdminClubComponent,
      HeaderAdminClubComponent,
      SidebarAdminClubComponent,
      AcceuilAdminClubComponent,
      ListJoueurComponent,
      AddJoueurComponent,
      UpdateJoueurComponent,
      ListTournoiComponent,
      AddTournoiComponent,
      UpdateTournoiComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
