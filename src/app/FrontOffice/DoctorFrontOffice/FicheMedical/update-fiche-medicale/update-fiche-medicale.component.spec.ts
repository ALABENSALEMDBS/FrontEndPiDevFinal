import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFicheMedicaleComponent } from './update-fiche-medicale.component';

describe('UpdateFicheMedicaleComponent', () => {
  let component: UpdateFicheMedicaleComponent;
  let fixture: ComponentFixture<UpdateFicheMedicaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateFicheMedicaleComponent]
    });
    fixture = TestBed.createComponent(UpdateFicheMedicaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
