import { TaskDetails } from './task';

export class Project {
  public id: number = 0;
  public name: string = "";
  public description: string = "";
  public created_at: Date = new Date();
  public is_archived: boolean = false;
}

export class ProjectDetails extends Project {
  public tasks: TaskDetails[] = [];
}
