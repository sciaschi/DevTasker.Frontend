import {Worklog} from './worklog';

export enum TaskStatus
{
  Todo,
  InProgress,
  Done,
  Blocked,
}

export enum TaskPriority
{
  VeryHigh,
  High,
  Medium,
  Low,
  VeryLow,
}

export class Task {
  public id: number = 0;
  public project_id: number = 0;
  public title: string = "";
  public description: string | null = null;
  public status: TaskStatus = 0;
  public priority: TaskPriority = 4;
  public due_date: Date | null = null;
  public completed_at: Date | null = null;
}

export class TaskDetails extends Task {
  public work_logs: Worklog[] = [];
}
