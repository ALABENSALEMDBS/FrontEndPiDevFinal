import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderAnalysteFrontComponent } from './header-analyste-front.component';

describe('HeaderAnalysteFrontComponent', () => {
  let component: HeaderAnalysteFrontComponent;
  let fixture: ComponentFixture<HeaderAnalysteFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderAnalysteFrontComponent]
    });
    fixture = TestBed.createComponent(HeaderAnalysteFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
