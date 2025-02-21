import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPlayerFrontComponent } from './footer-player-front.component';

describe('FooterPlayerFrontComponent', () => {
  let component: FooterPlayerFrontComponent;
  let fixture: ComponentFixture<FooterPlayerFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterPlayerFrontComponent]
    });
    fixture = TestBed.createComponent(FooterPlayerFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
