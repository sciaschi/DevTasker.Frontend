import {Component, signal, WritableSignal} from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { InputGroup } from 'primeng/inputgroup';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Accordion } from '../../components/accordion/accordion';
import {
  faEllipsisVertical,
  faFolderClosed,
  faGrip,
  faListDots,
  faPlus,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { BadgeModule } from 'primeng/badge';
import { AccordionItem } from '../../components/accordion/accordion-item/accordion-item';
import { ProjectDetails} from '../../classes/project';
import { ProjectService } from '../../services/project.service';
import { TasksService } from '../../services/task.service';
import {TaskDetails, TaskPriority, TaskStatus} from '../../classes/task';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { Dialog } from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {CreateTaskForm} from '../../components/forms/create-task-form/create-task-form';
import {ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-projects',
  imports: [
    InputText,
    InputGroup,
    FontAwesomeModule,
    Accordion,
    BadgeModule,
    AccordionItem,
    CdkDropList,
    CdkDrag,
    Dialog,
    FormsModule,
    CreateTaskForm
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  protected readonly faSearch = faSearch;
  protected readonly faFolderClosed = faFolderClosed;
  protected readonly faGrip = faGrip;
  protected readonly faListDots = faListDots;
  protected readonly faPlus = faPlus;
  protected readonly TaskPriority = TaskPriority;

  public projects: ProjectDetails[] = [];
  public selectedProjectId: number | null = 0;
  visible:WritableSignal<boolean> = signal(false);

  priorityBgColors: Record<TaskPriority, string> = {
    [TaskPriority.VeryLow]:  '#9CA3AF',
    [TaskPriority.Low]:      '#3B82F6',
    [TaskPriority.Medium]:   '#ffbf00',
    [TaskPriority.High]:     '#FB923C',
    [TaskPriority.VeryHigh]: '#EF4444',
  };

  get getSelectedProject(): ProjectDetails | null {
    if (this.selectedProjectId === null) return null;
    return this.projects.find(p => p.id === this.selectedProjectId) ?? null;
  }

  get getTodoTasks(): TaskDetails[] {
    if (this.selectedProjectId === null) return [];
    let selectedProject = this.projects.find(p => p.id === this.selectedProjectId);

    return selectedProject?.tasks.filter(x => x.status === TaskStatus.Todo) ?? [];
  }

  get getInProgressTasks(): TaskDetails[] {
    if (this.selectedProjectId === null) return [];
    let selectedProject = this.projects.find(p => p.id === this.selectedProjectId);
    return selectedProject?.tasks.filter(x => x.status === TaskStatus.InProgress) ?? [];
  }

  get getDoneTasks(): TaskDetails[] {
    if (this.selectedProjectId === null) return [];
    let selectedProject = this.projects.find(p => p.id === this.selectedProjectId);

    return selectedProject?.tasks.filter(x => x.status === TaskStatus.Done) ?? [];
  }

  constructor(private projectService: ProjectService, private taskService: TasksService) {}

  ngOnInit(): void {
    this.projectService.getAllProjectsWithDetails().subscribe(projects => {
      this.projects = projects
    });
  }

  onTaskCreated(task: TaskDetails) {
    this.visible.set(false);

    const project = this.projects.find(p => p.id === task.project_id);
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

  onProjectClick(projectId: number) {
    this.selectedProjectId = projectId;
  }

  showDialog() {
    this.visible.set(true);
  }

  formatEnumName(enumValue: number, enumType: any): string {
    const raw = enumType[enumValue] as string;
    if (!raw) return '';
    return raw.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  protected readonly faEllipsisVertical = faEllipsisVertical;
}
