export class Worklog {
  public id: number = 0;
  public task_item_id: number = 0;
  public started_at: Date = new Date();
  public ended_at: Date | null = null;
  public comment: string | null = null;
  public created_at: Date = new Date();
}
