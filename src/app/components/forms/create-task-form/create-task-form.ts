import {Component, input, output, signal} from '@angular/core';
import {form, Field, maxLength, required} from '@angular/forms/signals'
import {ButtonDirective} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {InputText} from 'primeng/inputtext';
import {SelectButton} from 'primeng/selectbutton';
import {Textarea} from 'primeng/textarea';
import {Task, TaskDetails, TaskPriority, TaskStatus} from '../../../classes/task';
import {TasksService} from '../../../services/task.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-create-task-form',
  imports: [
    ButtonDirective,
    DatePicker,
    InputText,
    SelectButton,
    Textarea,
    Field,
    FormsModule
  ],
  templateUrl: './create-task-form.html',
  styleUrl: './create-task-form.css',
})
export class CreateTaskForm {
  projectId = input.required<number>();
  cancelled = output<void>();
  taskCreated = output<TaskDetails>();

  statuses: any[] = [
    {name: 'Todo', value: TaskStatus.Todo},
    {name: 'In Progress', value: TaskStatus.InProgress},
    {name: 'Done', value: TaskStatus.Done},
    {name: 'Blocked', value: TaskStatus.Blocked},
  ];

  priorities: any[] = [
    {name: 'Very High', value: TaskPriority.VeryHigh},
    {name: 'High', value: TaskPriority.High},
    {name: 'Medium', value: TaskPriority.Medium},
    {name: 'Low', value: TaskPriority.Low},
    {name: 'Very Low', value: TaskPriority.VeryLow},
  ];

  createTaskModel = signal({
    title: "",
    description: "",
    status: TaskStatus.Todo,
    priority: TaskPriority.Medium,
    due_date: null as Date | null
  })

  createTaskForm = form(this.createTaskModel, (path) => {
    required(path.title, { message: 'Title is required'}),
    maxLength(path.title, 50, { message: 'Title is must be less than 50 characters long.'})
  });

  constructor(private taskService: TasksService) {}

  createTask() {
    const projectId = this.projectId();
    const formData = this.createTaskForm().value();
    let completedAt: Date | null = null;

    if(projectId === null)
      throw new Error('Cannot create task without a selected project. Please select a project first.')

    if(formData.status === TaskStatus.Done)
      completedAt = new Date();

    let task: Task = {
      id: 0,
      project_id: projectId,
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      due_date: formData.due_date,
      completed_at: completedAt,
    }

    console.log(task);
    this.taskService.createTask(projectId, task).subscribe({
      next: (createdTask) => {
        let createdTaskVal = createdTask as TaskDetails;
        this.taskCreated.emit(createdTaskVal);
        this.createTaskForm().reset();
        this.cancelled.emit();
      },
      error: err => {
        console.error(err);
      }
    })
  }

  cancel() {
    this.createTaskForm().reset();
    this.cancelled.emit();
  }
}
