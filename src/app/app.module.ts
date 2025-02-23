import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderBackComponent } from './BackOffice/header-back/header-back.component';
import { SidebarBackComponent } from './BackOffice/sidebar-back/sidebar-back.component';
import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { FooterBackComponent } from './BackOffice/footer-back/footer-back.component';

import { DoctorComponent } from './FrontOffice/DoctorFrontOffice/doctor/doctor.component';
import { HomeDoctorsComponent } from './FrontOffice/DoctorFrontOffice/home-doctors/home-doctors.component';
import { StateticComponent } from './BackOffice/statetic/statetic.component';

import { FooterCoachFrontComponent } from './FrontOffice/CoachFrontOffice/footer-coach-front/footer-coach-front.component';
import { AllTemplateCoachFrontComponent } from './FrontOffice/CoachFrontOffice/all-template-coach-front/all-template-coach-front.component';
import { HeaderCoachFrontComponent } from './FrontOffice/CoachFrontOffice/header-coach-front/header-coach-front.component';
import { HeaderDoctorFrontComponent } from './FrontOffice/DoctorFrontOffice/header-doctor-front/header-doctor-front.component';
import { AllTemplateDoctorFrontComponent } from './FrontOffice/DoctorFrontOffice/all-template-doctor-front/all-template-doctor-front.component';
import { FooterDoctorFrontComponent } from './FrontOffice/DoctorFrontOffice/footer-doctor-front/footer-doctor-front.component';
import { FooterPlayerFrontComponent } from './FrontOffice/PlayerFrontOffice/footer-player-front/footer-player-front.component';
import { AllTemplatePlayerFrontComponent } from './FrontOffice/PlayerFrontOffice/all-template-player-front/all-template-player-front.component';
import { HeaderPlayerFrontComponent } from './FrontOffice/PlayerFrontOffice/header-player-front/header-player-front.component';
import { HeaderAnalysteFrontComponent } from './FrontOffice/AnalysteFrontOffice/header-analyste-front/header-analyste-front.component';
import { AllTemplateAnalysteFrontComponent } from './FrontOffice/AnalysteFrontOffice/all-template-analyste-front/all-template-analyste-front.component';
import { FooterAnalysteFrontComponent } from './FrontOffice/AnalysteFrontOffice/footer-analyste-front/footer-analyste-front.component';
import { HomePageComponent } from './FrontOffice/HomePages/home-page/home-page.component';
import { AddTacticComponent } from './FrontOffice/CoachFrontOffice/add-tactic/add-tactic.component';
import { HomeCoachComponent } from './FrontOffice/CoachFrontOffice/homeCoach/home-coach/home-coach.component';
import { FormationCoachComponent } from './FrontOffice/CoachFrontOffice/formation-coach/formation-coach.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SousgroupComponent } from './FrontOffice/CoachFrontOffice/sousgroup/sousgroup.component';
import { UpdatesousGroupComponent } from './FrontOffice/CoachFrontOffice/updatesous-group/updatesous-group.component';
import { AddsousgroupComponent } from './FrontOffice/CoachFrontOffice/addsousgroup/addsousgroup.component';

import { AccueilComponent } from './BackOffice/accueil/accueil.component';
import { AddformationComponent } from './FrontOffice/CoachFrontOffice/addformation/addformation.component';
import { ListSeanceComponent } from './FrontOffice/CoachFrontOffice/list-seance/list-seance.component';
import { AddseanceComponent } from './FrontOffice/CoachFrontOffice/addseance/addseance.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderBackComponent,
    SidebarBackComponent,
    AllTemplateBackComponent,
    FooterBackComponent,

    DoctorComponent,
    HomeDoctorsComponent,
    StateticComponent,

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
