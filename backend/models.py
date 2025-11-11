from pydantic import BaseModel
from typing import Literal

class TrainingJob(BaseModel):
    job_id: str
    status: Literal["QUEUED", "RUNNING", "COMPLETED"]
    progress: float  # 0.0 to 1.0
    loss: float
    log_message: str
