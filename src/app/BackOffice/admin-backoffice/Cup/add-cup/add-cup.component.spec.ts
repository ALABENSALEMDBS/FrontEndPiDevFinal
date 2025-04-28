import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCupComponent } from './add-cup.component';

describe('AddCupComponent', () => {
  let component: AddCupComponent;
  let fixture: ComponentFixture<AddCupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
