import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareplayersComponent } from './compareplayers.component';

describe('CompareplayersComponent', () => {
  let component: CompareplayersComponent;
  let fixture: ComponentFixture<CompareplayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareplayersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareplayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
