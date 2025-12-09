import { Component, NgZone } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faArrowUpRightDots } from '@fortawesome/free-solid-svg-icons';
import { AsyncPipe } from '@angular/common';
import {BehaviorSubject, Observable} from 'rxjs';
import { TasksService } from '../../../services/task.service';
import {SignalRService} from '../../../services/signal.service';

@Component({
  selector: 'app-tasks-todo',
  standalone: true,
  imports: [FontAwesomeModule, AsyncPipe],
  templateUrl: './tasks-todo.html',
  styleUrl: './tasks-todo.css',
})
export class TasksTodo {
  protected readonly faArrowUpRightDots = faArrowUpRightDots;
  protected readonly faEye = faEye;

  count$ = new BehaviorSubject<number>(0);

  constructor(private service: TasksService, private signalRService: SignalRService,
              private ngZone: NgZone) {}

  private refreshCount() {
    this.service.getTodoProjectsCount().subscribe(count => {
      console.log('[TasksCompleted] new count from API:', count);
      this.count$.next(count);
    });
  }

  ngOnInit(): void {
    this.refreshCount();

    this.signalRService.onTaskCreated(task => {
      this.ngZone.run(() => {
        this.refreshCount();
      });
    });

    this.signalRService.onTaskUpdated(task => {
      this.ngZone.run(() => {
        this.refreshCount();
      });
    });
  }
}
