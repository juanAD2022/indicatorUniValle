from pydantic import BaseModel
from typing import Optional


class ImportError(BaseModel):
    row: int
    field: str
    message: str


class ImportChange(BaseModel):
    row: int
    periodo: str
    action: str
    fields_changed: list[str]
    old_values: Optional[dict] = None
    new_values: Optional[dict] = None


class ImportPendingRow(BaseModel):
    action: str
    row: int
    data: dict
    record_id: Optional[int] = None
    old: Optional[dict] = None


class ImportPreviewResponse(BaseModel):
    filename: str
    total_rows: int
    to_create: int
    to_update: int
    unchanged: int
    errors: list[ImportError]
    sample_changes: list[ImportChange]
    pending_rows: list[ImportPendingRow]


class ImportConfirmRequest(BaseModel):
    rows: list[ImportPendingRow]


class ImportConfirmResponse(BaseModel):
    success: bool
    created: int
    updated: int
    message: str
