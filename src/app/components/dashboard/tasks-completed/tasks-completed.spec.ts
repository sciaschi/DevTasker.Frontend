import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksCompleted } from './tasks-completed';

describe('TasksCompleted', () => {
  let component: TasksCompleted;
  let fixture: ComponentFixture<TasksCompleted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksCompleted]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksCompleted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
