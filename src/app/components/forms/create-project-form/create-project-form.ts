import {Component, output, signal, WritableSignal} from '@angular/core';
import {Field, form, maxLength, required} from '@angular/forms/signals';
import {Project, ProjectDetails} from '../../../models/project';
import {ButtonDirective} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {Textarea} from 'primeng/textarea';
import {ProjectService} from '../../../services/project.service';

@Component({
  selector: 'app-create-project-form',
  imports: [
    ButtonDirective,
    InputText,
    Textarea,
    Field
  ],
  templateUrl: './create-project-form.html',
  styleUrl: './create-project-form.css',
})
export class CreateProjectForm {
  projectCreated = output<ProjectDetails>();
  cancelled = output<void>();

  createProjectModel: WritableSignal<Project> = signal(new Project())

  createProjectForm = form(this.createProjectModel, (path) => {
    required(path.name, { message: 'Name is required'}),
    maxLength(path.name, 30, { message: 'Title is must be less than 30 characters long.'})
  });

  constructor(private projectService: ProjectService) {}

  createProject() {
    const formData = this.createProjectForm().value();

    this.projectService.createProject(formData).subscribe({
      next: (createdProject) => {
        let createdProjectVal = createdProject as ProjectDetails;
        this.createProjectForm().reset();
        this.projectCreated.emit(createdProjectVal);

        this.cancelled.emit();
      },
      error: err => {
        console.error(err);
      }
    })
  }

  cancel() {
    this.createProjectForm().reset();
    this.cancelled.emit();
  }
}
