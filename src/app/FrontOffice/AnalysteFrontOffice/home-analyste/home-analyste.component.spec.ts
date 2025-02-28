import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAnalysteComponent } from './home-analyste.component';

describe('HomeAnalysteComponent', () => {
  let component: HomeAnalysteComponent;
  let fixture: ComponentFixture<HomeAnalysteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeAnalysteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeAnalysteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
