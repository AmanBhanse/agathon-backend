from pydantic import BaseModel
from typing import Optional, Any, Dict, List

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


class RAGChunkInfo(BaseModel):
    """Information about a relevant chunk from RAG"""
    rank: int
    text: str
    similarity: float
    similarity_percentage: float
    
    class Config:
        json_schema_extra = {
            "example": {
                "rank": 1,
                "text": "Sample text from guideline...",
                "similarity": 0.8542,
                "similarity_percentage": 85.42
            }
        }


class RAGQueryRequest(BaseModel):
    """Request model for RAG query"""
    question: str
    model: str = "gpt-4o-mini"
    temperature: float = 0.3
    top_k: int = 3
    
    class Config:
        schema_extra = {
            "example": {
                "question": "What are the treatment recommendations for early-stage breast cancer?",
                "model": "gpt-4o-mini",
                "temperature": 0.3,
                "top_k": 3
            }
        }


class RAGQueryResponse(BaseModel):
    """Response model for RAG query"""
    answer: str
    relevant_chunks: List[RAGChunkInfo]
    message: str = "Query answered successfully"


class RAGStatusResponse(BaseModel):
    """Response model for RAG system status"""
    indexed: bool
    chunks_count: int
    embeddings_file: str
    message: str = "Status retrieved successfully"