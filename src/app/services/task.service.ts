import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Task, TaskDetails, TaskPriority, TaskStatus} from '../classes/task';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) { }

  getAllTasks() {
    return this.http.get<Task[]>('/api/tasks/all');
  }

  getAllTasksWithDetails() {
    return this.http.get<Task[]>('/api/tasks/all/details');
  }

  getAllTasksByProject(projectId: number) {
    return this.http.get<Task[]>(`/api/tasks/project/${projectId}`);
  }

  getAllTasksByProjectWithDetails(projectId: number) {
    return this.http.get<TaskDetails[]>(`/api/tasks/project/${projectId}/details`);
  }

  getTaskById(id: number) {
    return this.http.get<Task>(`/api/tasks/${id}`);
  }

  getTaskByIdWithDetails(id: number) {
    return this.http.get<TaskDetails>(`/api/tasks/${id}/details`);
  }

  getTodoProjectsCount() {
    return this.getAllTasksWithDetails().pipe(
      map(taskList =>
        taskList.filter(task => task.status === 0).length
      )
    );
  }

  getCompletedProjectsCount() {
    return this.getAllTasksWithDetails().pipe(
      map(taskList =>
        taskList.filter(task => task.status === 2).length
      )
    );
  }

  createTask(projectId: number, task: Task) {
    return this.http.post<Task>('/api/tasks/create', task);
  }

  updateTask(id: number, task: Task) {
    return this.http.put<Task>(`/api/tasks/update`, {
      id: id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      completed_at: task.completed_at
    });
  }

  updateStatus(id: number, status: TaskStatus) {
    return this.http.patch<Task>(`/api/tasks/${id}/status`, {
      "status": status,
    });
  }
}
