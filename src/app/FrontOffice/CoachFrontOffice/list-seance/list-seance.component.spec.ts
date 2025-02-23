import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSeanceComponent } from './list-seance.component';

describe('ListSeanceComponent', () => {
  let component: ListSeanceComponent;
  let fixture: ComponentFixture<ListSeanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListSeanceComponent]
    });
    fixture = TestBed.createComponent(ListSeanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
