import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterAnalysteFrontComponent } from './footer-analyste-front.component';

describe('FooterAnalysteFrontComponent', () => {
  let component: FooterAnalysteFrontComponent;
  let fixture: ComponentFixture<FooterAnalysteFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterAnalysteFrontComponent]
    });
    fixture = TestBed.createComponent(FooterAnalysteFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
