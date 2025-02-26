import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarAdminClubComponent } from './sidebar-admin-club.component';

describe('SidebarAdminClubComponent', () => {
  let component: SidebarAdminClubComponent;
  let fixture: ComponentFixture<SidebarAdminClubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarAdminClubComponent]
    });
    fixture = TestBed.createComponent(SidebarAdminClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
