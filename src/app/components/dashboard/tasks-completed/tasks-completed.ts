import { Component, NgZone } from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faCheckCircle} from '@fortawesome/free-regular-svg-icons';
import {faArrowUpRightDots} from '@fortawesome/free-solid-svg-icons';
import {BehaviorSubject, Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {TasksService} from '../../../services/task.service';
import {SignalRService} from '../../../services/signal.service';

@Component({
  selector: 'app-tasks-completed',
  imports: [FontAwesomeModule, AsyncPipe],
  templateUrl: './tasks-completed.html',
  styleUrl: './tasks-completed.css',
})
export class TasksCompleted {

  protected readonly faCheckCircle = faCheckCircle;
  protected readonly faArrowUpRightDots = faArrowUpRightDots;

  count$ = new BehaviorSubject<number>(0);

  constructor(private service: TasksService, private signalRService: SignalRService,
              private ngZone: NgZone) {
  }

  private refreshCount() {
    this.service.getCompletedProjectsCount().subscribe(count => {
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
