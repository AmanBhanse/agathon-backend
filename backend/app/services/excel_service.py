import pandas as pd
from typing import Optional, Dict, Any
import os
from pathlib import Path

class ExcelService:
    def __init__(self):
        # Path to the Excel file
        self.excel_path = Path(__file__).parent.parent.parent / "asset" / "Tumorboard_final_eng.xlsx"
        self._data = None
        self._load_data()
    
    def _load_data(self):
        """Load the Excel file into memory"""
        try:
            if os.path.exists(self.excel_path):
                # Read Excel file - you might need to specify the sheet name
                self._data = pd.read_excel(self.excel_path)
                print(f"Loaded Excel file with {len(self._data)} rows")
                print(f"Columns: {list(self._data.columns)}")
            else:
                print(f"Excel file not found at: {self.excel_path}")
                self._data = pd.DataFrame()
        except Exception as e:
            print(f"Error loading Excel file: {e}")
            self._data = pd.DataFrame()
    
    def get_data_by_fallnummer(self, fallnummer: str) -> Optional[Dict[str, Any]]:
        """Get all data for a specific Fallnummer"""
        if self._data is None or self._data.empty:
            return None
        
        # Assuming there's a column named 'Fallnummer' or similar
        # We'll check different possible column names
        possible_columns = ['Case number', 'Fallnummer', 'fallnummer', 'Fall-Nr', 'Fall Nr', 'Case Number', 'Case_Number']
        
        fallnummer_column = None
        for col in possible_columns:
            if col in self._data.columns:
                fallnummer_column = col
                break
        
        if fallnummer_column is None:
            # If no standard column found, use the first column
            if len(self._data.columns) > 0:
                fallnummer_column = self._data.columns[0]
            else:
                return None
        
        # Filter data by Fallnummer
        matching_rows = self._data[self._data[fallnummer_column].astype(str) == str(fallnummer)]
        
        if matching_rows.empty:
            return None
        
        # Convert to dictionary and handle NaN values
        result = matching_rows.iloc[0].to_dict()
        
        # Replace NaN values with None for JSON serialization
        for key, value in result.items():
            if pd.isna(value):
                result[key] = None
        
        return result
    
    def get_all_fallnummers(self) -> list:
        """Get all available Fallnummers"""
        if self._data is None or self._data.empty:
            return []
        
        # Find the Fallnummer column
        possible_columns = ['Case number', 'Fallnummer', 'fallnummer', 'Fall-Nr', 'Fall Nr', 'Case Number', 'Case_Number']
        
        fallnummer_column = None
        for col in possible_columns:
            if col in self._data.columns:
                fallnummer_column = col
                break
        
        if fallnummer_column is None and len(self._data.columns) > 0:
            fallnummer_column = self._data.columns[0]
        
        if fallnummer_column:
            return self._data[fallnummer_column].dropna().astype(str).tolist()
        
        return []
    
    def get_columns(self) -> list:
        """Get all column names"""
        if self._data is None:
            return []
        return list(self._data.columns)

# Create a singleton instance
excel_service = ExcelService()