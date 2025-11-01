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

class CombinedReportRequest(BaseModel):
    """Request model for combined clinical report generation"""
    fallnummer: str
    data: Dict[str, Any]
    
    class Config:
        schema_extra = {
            "example": {
                "fallnummer": "18693120",
                "data": {
                    "Case number": 18693120,
                    "Tumor diagnosis": "adenocarcinoma",
                    "Tumor history": "patient history",
                    "Imaging": "imaging findings",
                    "Staging clinic cT": "2a",
                    "Staging Clinic N": "3",
                    "Staging Clinic M": "0",
                    "Staging clinic UICC": "IIIB",
                    "Staging Path pT": "2a",
                    "Staging Path N": "3",
                    "Staging Path M": "0",
                    "Histo Cyto": "histology findings",
                    "Secondary diagnoses": "comorbidities",
                    "therapy so far": "prior treatments",
                    "curative": 1,
                    "Old": 62
                }
            }
        }

class CombinedReportResponse(BaseModel):
    """Response model for combined clinical report"""
    fallnummer: str
    clinical_report: str
    timestamp: Optional[str] = None
    message: str = "Report generated successfully"