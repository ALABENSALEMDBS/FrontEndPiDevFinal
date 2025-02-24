import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceuilAdminClubComponent } from './acceuil-admin-club.component';

describe('AcceuilAdminClubComponent', () => {
  let component: AcceuilAdminClubComponent;
  let fixture: ComponentFixture<AcceuilAdminClubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcceuilAdminClubComponent]
    });
    fixture = TestBed.createComponent(AcceuilAdminClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
