import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal, WritableSignal} from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { InputGroup } from 'primeng/inputgroup';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Accordion } from '../../components/accordion/accordion';
import {faFolderClosed, faPlus, faSearch} from '@fortawesome/free-solid-svg-icons';
import { BadgeModule } from 'primeng/badge';
import { AccordionItem } from '../../components/accordion/accordion-item/accordion-item';
import { ProjectDetails} from '../../models/project';
import { ProjectService } from '../../services/project.service';
import {FormsModule} from '@angular/forms';
import {KanbanBoard} from '../../components/kanban-board/kanban-board';
import {Dialog} from 'primeng/dialog';
import {CreateProjectForm} from '../../components/forms/create-project-form/create-project-form';
import {SignalRService} from '../../services/signal.service';

@Component({
  selector: 'app-projects',
  imports: [
    InputText,
    InputGroup,
    FontAwesomeModule,
    Accordion,
    BadgeModule,
    AccordionItem,
    FormsModule,
    KanbanBoard,
    Dialog,
    CreateProjectForm
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects implements OnInit {
  protected readonly faSearch = faSearch;
  protected readonly faFolderClosed = faFolderClosed;
  protected readonly faPlus = faPlus;

  public projects: ProjectDetails[] = [];
  public selectedProjectId: number | null = 0;
  createProjectsVisible:WritableSignal<boolean> = signal(false);

  get getSelectedProject(): ProjectDetails | null {
    if (this.selectedProjectId === null) return null;
    return this.projects.find(p => p.id === this.selectedProjectId) ?? null;
  }

  constructor(private projectService: ProjectService, private cdr: ChangeDetectorRef,
              private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.projectService.getAllProjectsWithDetails().subscribe(projects => {
      this.projects = projects;
      this.cdr.markForCheck();
    });

    this.signalRService.onProjectCreated(project => {
      let projectDetails = project as ProjectDetails;

      this.onProjectCreated();

      if(!projectDetails.tasks)
        projectDetails.tasks = [];

      this.projects.push(projectDetails);
    });
  }

  onProjectCreated() {
    this.createProjectsVisible.set(false);
  }

  onProjectClick(projectId: number) {
    this.selectedProjectId = projectId;
  }

  onProjectAddClick() {
    this.createProjectsVisible.set(true);
  }
}
