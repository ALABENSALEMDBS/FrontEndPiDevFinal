import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentStatsComponent } from './comment-stats.component';

describe('CommentStatsComponent', () => {
  let component: CommentStatsComponent;
  let fixture: ComponentFixture<CommentStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
