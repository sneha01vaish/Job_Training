export interface TrainingJob {
  job_id: string;
  status: "QUEUED" | "RUNNING" | "COMPLETED";
  progress: number;
  loss: number;
  log_message: string;
}
