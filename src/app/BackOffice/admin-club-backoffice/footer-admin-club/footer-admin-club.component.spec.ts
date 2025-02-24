import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterAdminClubComponent } from './footer-admin-club.component';

describe('FooterAdminClubComponent', () => {
  let component: FooterAdminClubComponent;
  let fixture: ComponentFixture<FooterAdminClubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterAdminClubComponent]
    });
    fixture = TestBed.createComponent(FooterAdminClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
