import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRapportComponent } from './update-rapport.component';

describe('UpdateRapportComponent', () => {
  let component: UpdateRapportComponent;
  let fixture: ComponentFixture<UpdateRapportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRapportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
