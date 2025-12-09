import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectForm } from './create-project-form';

describe('CreateProjectForm', () => {
  let component: CreateProjectForm;
  let fixture: ComponentFixture<CreateProjectForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProjectForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProjectForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
