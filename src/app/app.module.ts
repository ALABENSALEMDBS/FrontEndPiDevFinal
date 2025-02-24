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
import { HttpClientModule } from '@angular/common/http';
import { AccueilComponent } from './BackOffice/accueil/accueil.component';
import { CreateUpdateFicheMedicalComponent } from './FrontOffice/DoctorFrontOffice/FicheMedical/create-update-fiche-medical/create-update-fiche-medical.component';
import { ListeFicheMedicalComponent } from './FrontOffice/DoctorFrontOffice/FicheMedical/liste-fiche-medical/liste-fiche-medical.component';
import { ServiceDoctorService } from './services/service-doctor.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ListeExerciceRetablissementComponent } from './FrontOffice/DoctorFrontOffice/ExcerciceRetablissement/liste-exercice-retablissement/liste-exercice-retablissement.component';
import { CreateExerciceRetablissementComponent } from './FrontOffice/DoctorFrontOffice/ExcerciceRetablissement/create-exercice-retablissement/create-exercice-retablissement.component';
import { UpdateExerciceRetablissementComponent } from './FrontOffice/DoctorFrontOffice/ExcerciceRetablissement/update-exercice-retablissement/update-exercice-retablissement.component';
import { UpdateFicheMedicaleComponent } from './FrontOffice/DoctorFrontOffice/FicheMedical/update-fiche-medicale/update-fiche-medicale.component';
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
    AccueilComponent,
    CreateUpdateFicheMedicalComponent,
    ListeFicheMedicalComponent,
    ListeExerciceRetablissementComponent,
    CreateExerciceRetablissementComponent,
    UpdateExerciceRetablissementComponent,
    UpdateFicheMedicaleComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
