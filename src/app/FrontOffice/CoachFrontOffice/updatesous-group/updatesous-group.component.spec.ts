import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatesousGroupComponent } from './updatesous-group.component';

describe('UpdatesousGroupComponent', () => {
  let component: UpdatesousGroupComponent;
  let fixture: ComponentFixture<UpdatesousGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatesousGroupComponent]
    });
    fixture = TestBed.createComponent(UpdatesousGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
