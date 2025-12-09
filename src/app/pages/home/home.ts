import { Component } from '@angular/core';
import {DashboardItem} from '../../components/dashboard/dashboard-item/dashboard-item';
import {TasksCompleted} from '../../components/dashboard/tasks-completed/tasks-completed';
import {TasksTodo} from '../../components/dashboard/tasks-todo/tasks-todo';

@Component({
  selector: 'app-home',
  imports: [
    DashboardItem,
    TasksCompleted,
    TasksTodo
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',

})
export class Home {

}
