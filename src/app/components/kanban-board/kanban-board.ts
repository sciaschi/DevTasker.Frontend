import {Component, ElementRef, input, InputSignal, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {Menu} from 'primeng/menu';
import {NgScrollbar} from 'ngx-scrollbar';
import {
  faCircleExclamation,
  faCircleInfo,
  faClock,
  faEllipsisVertical,
  faGrip,
  faListDots,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import {TaskDetails, TaskPriority, TaskStatus} from '../../models/task';
import {ProjectDetails} from '../../models/project';
import {CreateTaskForm} from '../forms/create-task-form/create-task-form';
import {Dialog} from 'primeng/dialog';
import {MenuItem} from 'primeng/api';
import {TasksService} from '../../services/task.service';
import {SignalRService} from '../../services/signal.service';
import moment from 'moment';
import {InputText} from 'primeng/inputtext';
import {Textarea} from 'primeng/textarea';
import {InputGroup} from 'primeng/inputgroup';
import {Panel} from 'primeng/panel';
import {DatePipe} from '@angular/common';
import {WorklogsService} from '../../services/worklogs.service';
import {Worklog} from '../../models/worklog';

@Component({
  selector: 'app-kanban-board',
  imports: [
    CdkDrag,
    CdkDropList,
    FaIconComponent,
    Menu,
    NgScrollbar,
    CreateTaskForm,
    Dialog,
    CdkDragHandle,
    Textarea,
    Panel,
    DatePipe,
  ],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css',
})
export class KanbanBoard implements OnInit {
  @ViewChild('taskOptionsMenu', { static: true }) taskOptionsMenu!: Menu;
  @ViewChild('addWorkLogTextArea', { static: true }) addWorkLogTextArea!: ElementRef<HTMLTextAreaElement>;

  protected readonly faPlus = faPlus;
  protected readonly faGrip = faGrip;
  protected readonly faEllipsisVertical = faEllipsisVertical;
  protected readonly faListDots = faListDots;
  protected readonly faClock = faClock;
  protected readonly TaskPriority = TaskPriority;
  protected readonly moment = moment;

  selectedProjectId = input(0);
  projects: InputSignal<ProjectDetails[]> = input.required();
  visible:WritableSignal<boolean> = signal(false);
  contextTask: TaskDetails = new TaskDetails();

  priorityBgColors: Record<TaskPriority, string> = {
    [TaskPriority.VeryLow]:  '#9CA3AF',
    [TaskPriority.Low]:      '#3B82F6',
    [TaskPriority.Medium]:   '#ffbf00',
    [TaskPriority.High]:     '#FB923C',
    [TaskPriority.VeryHigh]: '#EF4444',
  };

  menuItems: MenuItem[] = [
    {label: 'Delete', icon: 'fa-solid fa-trash', command: () => this.deleteTask(this.contextTask.id)},
  ];

  get getTodoTasks(): TaskDetails[] {
    const selectedProjectId = this.selectedProjectId();
    if (selectedProjectId === null) return [];

    let projects = this.projects();
    let selectedProject = projects.find(p => p.id === selectedProjectId);

    return selectedProject?.tasks?.filter(x => x.status === TaskStatus.Todo) ?? [];
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

  constructor(private taskService: TasksService,
              private workLogService: WorklogsService,
              private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.signalRService.onTaskCreated(task => {
      const project = this.projects().find(p => p.id === task.project_id);
      const taskDetails = task as TaskDetails;

      if (!project) {
        console.warn('Project not found for project_id:', task.project_id);
        return;
      }

      if (!project.tasks)
        project.tasks = [];

      (project.tasks as TaskDetails[]).push(taskDetails);

    });
  }

  onTaskCreated() {
    this.visible.set(false);
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

  addWorkLog(event: Event) {
    const value = this.addWorkLogTextArea.nativeElement.value;

    const workLog: Worklog = {
      id: 0,
      task_item_id: this.contextTask.id,
      comment: value,
      started_at: new Date(),
      ended_at: null,
      created_at: new Date(),
    };

    this.workLogService.createWorkLog(workLog).subscribe({
      next: (createdWorkLog) => {
        this.contextTask.work_logs.push(createdWorkLog);
      },
      error: err => {
        console.error(err);
      }
    });
  }

  formatEnumName(enumValue: number, enumType: any): string {
    const raw = enumType[enumValue] as string;

    if (!raw)
      return '';

    return raw.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  isPastDue(dueDate: Date | null): boolean {
    if (!dueDate)
      return false;

    return moment(dueDate).isBefore(moment());
  }

  openTaskOptionsMenu(event: MouseEvent, task: TaskDetails) {
    this.contextTask = task;
    this.taskOptionsMenu.toggle(event);
  }

  openTaskDetailsPopup(event: MouseEvent, task: TaskDetails) {
    this.contextTask = task;
    console.log()
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

  protected readonly faCircleInfo = faCircleInfo;
}
