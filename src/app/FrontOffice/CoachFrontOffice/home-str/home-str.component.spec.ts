import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeStrComponent } from './home-str.component';

describe('HomeStrComponent', () => {
  let component: HomeStrComponent;
  let fixture: ComponentFixture<HomeStrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeStrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeStrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
