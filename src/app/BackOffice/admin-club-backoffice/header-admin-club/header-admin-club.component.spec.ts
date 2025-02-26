import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderAdminClubComponent } from './header-admin-club.component';

describe('HeaderAdminClubComponent', () => {
  let component: HeaderAdminClubComponent;
  let fixture: ComponentFixture<HeaderAdminClubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderAdminClubComponent]
    });
    fixture = TestBed.createComponent(HeaderAdminClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
