import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaskForm } from './create-task-form';

describe('CreateTaskForm', () => {
  let component: CreateTaskForm;
  let fixture: ComponentFixture<CreateTaskForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTaskForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTaskForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
