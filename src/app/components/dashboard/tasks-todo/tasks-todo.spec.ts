import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsCompleted } from './tasks-todo';

describe('ProjectsCompleted', () => {
  let component: ProjectsCompleted;
  let fixture: ComponentFixture<ProjectsCompleted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsCompleted]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsCompleted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
