import { Injectable } from '@angular/core';
import {Project, ProjectDetails} from '../classes/project';
import {HttpClient} from '@angular/common/http';
import {Worklog} from '../classes/worklog';

@Injectable({
  providedIn: 'root',
})
export class WorklogsService {

  constructor(private http: HttpClient) { }

  getAllWorkLogsByTask(taskId: number) {
    return this.http.get<Worklog[]>(`/api/worklogs/task/${taskId}`);
  }

  getWorkLogById(id: number) {
    return this.http.get<Worklog>(`/api/worklogs/${id}`);
  }

  createWorkLog(workLog: Worklog) {
    return this.http.post<Worklog>(`/api/worklogs/create`, {
      task_item_id: workLog.taskId,
      comment: workLog.comment,
    });
  }
}
