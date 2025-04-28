import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectsessionexerciceComponent } from './affectsessionexercice.component';

describe('AffectsessionexerciceComponent', () => {
  let component: AffectsessionexerciceComponent;
  let fixture: ComponentFixture<AffectsessionexerciceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffectsessionexerciceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffectsessionexerciceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
