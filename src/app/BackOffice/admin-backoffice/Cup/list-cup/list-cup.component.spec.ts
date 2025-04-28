import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCupComponent } from './list-cup.component';

describe('ListCupComponent', () => {
  let component: ListCupComponent;
  let fixture: ComponentFixture<ListCupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
