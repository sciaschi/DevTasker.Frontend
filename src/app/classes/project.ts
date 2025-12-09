import {Timestamp} from 'rxjs';
import {Task, TaskDetails} from './task';

export class Project {
  public id: number = 0;
  public name: string = "";
  public description: string = "";
  public created_at: Date = new Date();
  public isArchived: boolean = false;
}

export class ProjectDetails {
  public id: number = 0;
  public name: string = "";
  public description: string = "";
  public created_at: Date = new Date();
  public is_archived: boolean = false;
  public tasks: TaskDetails[] = [];
}
