from pydantic import BaseModel
from typing import Optional, Any, Dict

class FallnummerResponse(BaseModel):
    """Response model for Fallnummer data"""
    fallnummer: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    message: Optional[str] = None
    
    class Config:
        json_encoders = {
            # Handle any special encoding if needed
        }

class FallnummerRequest(BaseModel):
    """Request model for Fallnummer lookup"""
    fallnummer: str
    
    class Config:
        schema_extra = {
            "example": {
                "fallnummer": "12345"
            }
        }

class ExcelInfoResponse(BaseModel):
    """Response model for Excel file information"""
    total_records: int
    columns: list[str]
    available_fallnummers: list[str]
    
class ErrorResponse(BaseModel):
    """Error response model"""
    error: str
    message: str