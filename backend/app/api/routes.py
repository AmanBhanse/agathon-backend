from fastapi import APIRouter, HTTPException, Query
from app.services.excel_service import excel_service
from app.models.schemas import FallnummerResponse, ExcelInfoResponse, ErrorResponse
from typing import Optional

router = APIRouter()

@router.get("/fallnummer/{fallnummer}", response_model=FallnummerResponse)
async def get_fallnummer_data(fallnummer: str):
    """
    Get all data for a specific Fallnummer from the Excel file
    """
    try:
        data = excel_service.get_data_by_fallnummer(fallnummer)
        
        if data is None:
            raise HTTPException(
                status_code=404, 
                detail=f"No data found for Fallnummer: {fallnummer}"
            )
        
        return FallnummerResponse(
            fallnummer=fallnummer,
            data=data,
            message="Data retrieved successfully"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving data: {str(e)}"
        )

@router.get("/fallnummer", response_model=FallnummerResponse)
async def get_fallnummer_data_query(fallnummer: str = Query(..., description="The Fallnummer to search for")):
    """
    Get all data for a specific Fallnummer using query parameter
    """
    try:
        data = excel_service.get_data_by_fallnummer(fallnummer)
        
        if data is None:
            raise HTTPException(
                status_code=404, 
                detail=f"No data found for Fallnummer: {fallnummer}"
            )
        
        return FallnummerResponse(
            fallnummer=fallnummer,
            data=data,
            message="Data retrieved successfully"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving data: {str(e)}"
        )

@router.get("/excel/info", response_model=ExcelInfoResponse)
async def get_excel_info():
    """
    Get information about the Excel file (columns, available Fallnummers, etc.)
    """
    try:
        columns = excel_service.get_columns()
        fallnummers = excel_service.get_all_fallnummers()
        
        return ExcelInfoResponse(
            total_records=len(fallnummers),
            columns=columns,
            available_fallnummers=fallnummers[:10]  # Limit to first 10 for display
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting Excel info: {str(e)}"
        )

@router.get("/excel/fallnummers")
async def get_all_fallnummers():
    """
    Get all available Fallnummers
    """
    try:
        fallnummers = excel_service.get_all_fallnummers()
        return {
            "fallnummers": fallnummers,
            "total_count": len(fallnummers)
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting Fallnummers: {str(e)}"
        )