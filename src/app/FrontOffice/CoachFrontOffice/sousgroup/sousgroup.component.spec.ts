import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousgroupComponent } from './sousgroup.component';

describe('SousgroupComponent', () => {
  let component: SousgroupComponent;
  let fixture: ComponentFixture<SousgroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SousgroupComponent]
    });
    fixture = TestBed.createComponent(SousgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
