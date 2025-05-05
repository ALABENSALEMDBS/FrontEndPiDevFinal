import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCupComponent } from './update-cup.component';

describe('UpdateCupComponent', () => {
  let component: UpdateCupComponent;
  let fixture: ComponentFixture<UpdateCupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
