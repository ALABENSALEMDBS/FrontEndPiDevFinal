import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCupMatchComponent } from './update-cup-match.component';

describe('UpdateCupMatchComponent', () => {
  let component: UpdateCupMatchComponent;
  let fixture: ComponentFixture<UpdateCupMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCupMatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCupMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
