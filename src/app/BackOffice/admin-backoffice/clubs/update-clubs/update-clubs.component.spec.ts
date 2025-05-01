import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateClubsComponent } from './update-clubs.component';

describe('UpdateClubsComponent', () => {
  let component: UpdateClubsComponent;
  let fixture: ComponentFixture<UpdateClubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateClubsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateClubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
