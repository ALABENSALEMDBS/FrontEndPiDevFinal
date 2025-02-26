import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMatchComponent } from './update-match.component';

describe('UpdateMatchComponent', () => {
  let component: UpdateMatchComponent;
  let fixture: ComponentFixture<UpdateMatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateMatchComponent]
    });
    fixture = TestBed.createComponent(UpdateMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
