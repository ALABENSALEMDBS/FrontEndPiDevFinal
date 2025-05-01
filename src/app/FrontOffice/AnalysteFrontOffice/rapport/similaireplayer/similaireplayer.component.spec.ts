import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilaireplayerComponent } from './similaireplayer.component';

describe('SimilaireplayerComponent', () => {
  let component: SimilaireplayerComponent;
  let fixture: ComponentFixture<SimilaireplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimilaireplayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimilaireplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
