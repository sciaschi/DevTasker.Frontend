import {Component, input, InputSignal, signal, ViewChild, WritableSignal} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {Menu} from 'primeng/menu';
import {NgScrollbar} from 'ngx-scrollbar';
import {faEllipsisVertical, faGrip, faListDots, faPlus} from '@fortawesome/free-solid-svg-icons';
import {TaskDetails, TaskPriority, TaskStatus} from '../../models/task';
import {ProjectDetails} from '../../models/project';
import {CreateTaskForm} from '../forms/create-task-form/create-task-form';
import {Dialog} from 'primeng/dialog';
import {MenuItem} from 'primeng/api';
import {TasksService} from '../../services/task.service';

@Component({
  selector: 'app-kanban-board',
  imports: [
    CdkDrag,
    CdkDropList,
    FaIconComponent,
    Menu,
    NgScrollbar,
    CreateTaskForm,
    Dialog
  ],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css',
})
export class KanbanBoard {
  @ViewChild('taskOptionsMenu', { static: true }) taskOptionsMenu!: Menu;

  protected readonly faPlus = faPlus;
  protected readonly faGrip = faGrip;
  protected readonly faEllipsisVertical = faEllipsisVertical;
  protected readonly faListDots = faListDots;
  protected readonly TaskPriority = TaskPriority;

  selectedProjectId = input(0);
  projects: InputSignal<ProjectDetails[]> = input.required();
  priorityBgColors: Record<TaskPriority, string> = {
    [TaskPriority.VeryLow]:  '#9CA3AF',
    [TaskPriority.Low]:      '#3B82F6',
    [TaskPriority.Medium]:   '#ffbf00',
    [TaskPriority.High]:     '#FB923C',
    [TaskPriority.VeryHigh]: '#EF4444',
  };
  visible:WritableSignal<boolean> = signal(false);
  contextTask: TaskDetails = new TaskDetails();

  menuItems: MenuItem[] = [
    {label: 'Delete', command: () => this.deleteTask(this.contextTask.id)},
  ];

  get getTodoTasks(): TaskDetails[] {
    const selectedProjectId = this.selectedProjectId();
    if (selectedProjectId === null) return [];

    let projects = this.projects();
    let selectedProject = projects.find(p => p.id === selectedProjectId);

    return selectedProject?.tasks.filter(x => x.status === TaskStatus.Todo) ?? [];
  }
  get getInProgressTasks(): TaskDetails[] {
    const selectedProjectId = this.selectedProjectId();

    if (selectedProjectId === null) return [];

    let projects = this.projects();
    let selectedProject = projects.find(p => p.id === selectedProjectId);

    return selectedProject?.tasks.filter(x => x.status === TaskStatus.InProgress) ?? [];
  }
  get getDoneTasks(): TaskDetails[] {
    const selectedProjectId = this.selectedProjectId();

    if (this.selectedProjectId === null) return [];

    let projects = this.projects();
    let selectedProject = projects.find(p => p.id === selectedProjectId);

    return selectedProject?.tasks.filter(x => x.status === TaskStatus.Done) ?? [];
  }

  constructor(private taskService: TasksService) {}

  onTaskCreated(task: TaskDetails) {
    this.visible.set(false);

    const project = this.projects().find(p => p.id === task.project_id);
    if (!project) {
      console.warn('Project not found for project_id:', task.project_id);
      return;
    }

    if (!project.tasks) {
      project.tasks = [];
    }

    (project.tasks as TaskDetails[]).push(task);

    console.log('Task added to project list:', task);
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        const selectedProjectId = this.selectedProjectId();
        const project = this.projects().find(p => p.id === selectedProjectId);
        if (project?.tasks) {
          project.tasks = project.tasks.filter(t => t.id !== id);
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }

  formatEnumName(enumValue: number, enumType: any): string {
    const raw = enumType[enumValue] as string;
    if (!raw) return '';
    return raw.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  openTaskOptionsMenu(event: MouseEvent, task: TaskDetails) {
    this.contextTask = task;
    this.taskOptionsMenu.toggle(event);
  }

  showDialog() {
    this.visible.set(true);
  }

  drop(event: CdkDragDrop<TaskDetails[]>) {
    const task: TaskDetails = event.item.data as TaskDetails;

    let newStatus: TaskStatus;
    switch (event.container.id) {
      case 'todoList':
        newStatus = TaskStatus.Todo;
        break;
      case 'inProgressList':
        newStatus = TaskStatus.InProgress;
        break;
      case 'doneList':
        newStatus = TaskStatus.Done;
        break;
      default:
        return;
    }

    if (task.status === newStatus)
      return;

    const previousStatus = task.status;

    task.status = newStatus;

    this.taskService.updateStatus(task.id, newStatus).subscribe({
      next: (updatedTask) => {
        Object.assign(task, updatedTask);
      },
      error: err => {
        console.error(err);
        task.status = previousStatus;
      }
    });
  }
}
