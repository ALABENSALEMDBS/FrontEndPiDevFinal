import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadExerciceComponent } from './upload-exercice.component';

describe('UploadExerciceComponent', () => {
  let component: UploadExerciceComponent;
  let fixture: ComponentFixture<UploadExerciceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadExerciceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadExerciceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
