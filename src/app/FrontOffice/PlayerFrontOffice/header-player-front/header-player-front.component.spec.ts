import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPlayerFrontComponent } from './header-player-front.component';

describe('HeaderPlayerFrontComponent', () => {
  let component: HeaderPlayerFrontComponent;
  let fixture: ComponentFixture<HeaderPlayerFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderPlayerFrontComponent]
    });
    fixture = TestBed.createComponent(HeaderPlayerFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
