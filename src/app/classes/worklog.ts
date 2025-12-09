export class Worklog {
  public id: number = 0;
  public taskId: number = 0;
  public startedAt: Date = new Date();
  public endedAt: Date | null = null;
  public comment: string | null = null;
}
