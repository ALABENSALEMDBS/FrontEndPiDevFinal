import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsousgroupComponent } from './addsousgroup.component';

describe('AddsousgroupComponent', () => {
  let component: AddsousgroupComponent;
  let fixture: ComponentFixture<AddsousgroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddsousgroupComponent]
    });
    fixture = TestBed.createComponent(AddsousgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
