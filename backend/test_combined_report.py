#!/usr/bin/env python3
"""
Test script for the getCombinedReport endpoint
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

# Sample request body
request_body = {
    "fallnummer": "18693120",
    "data": {
        "Case number": 18693120,
        "G": "W",
        "Date": "2024-08-06T00:00:00",
        "Procedure": "Oncological resection",
        "Creation date": "2024-08-03T00:00:00",
        "Chief AdHoc": 0,
        "Mostly elective": 1,
        "Tumor diagnosis": "moderately differentiated acinar adenocarcinoma of the right upper lobe, ED 11/24, pT1a, pNX, pMx, L0, V0, pM0, G2, R0",
        "Histo Cyto": "Molecular pathology: adenocarcinoma of the lung with pathogenic mutation of KRAS and TP 53",
        "Tumor history": "During the initial diagnosis of breast cancer, a suspicious mass was found in the right upper lobe of the lung.",
        "Imaging": "PET/CT: Currently no evidence of tumor residues or locoregional lymph nodes or Distant metastases.",
        "Staging clinic cT": None,
        "Staging Clinic M": "0",
        "Staging Clinic N": "0",
        "Staging Clinic UICC": "IA3",
        "Staging Path M": None,
        "Staging Path N": None,
        "Staging Path pT": "1a",
        "Staging Path UICC": None,
        "Secondary diagnoses": "Nicotine abuse, arterial hypertension, Hypothyroidism, Depression",
        "therapy so far": None,
        "Question": "Re-resection oncological?",
        "curative": 1,
        "palliative": 0,
        "pall connection": 0,
        "Last_Vided_on": "2025-02-05T00:00:00",
        "Old": 68
    }
}

def test_get_combined_report():
    """Test the getCombinedReport endpoint"""
    print("Testing /api/v1/getCombinedReport endpoint...")
    print(f"URL: {BASE_URL}/api/v1/getCombinedReport")
    print(f"Request body: {json.dumps(request_body, indent=2)}\n")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/getCombinedReport",
            json=request_body,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("\n✓ Test PASSED!")
            return True
        else:
            print("\n✗ Test FAILED!")
            return False
            
    except requests.exceptions.ConnectionError:
        print("✗ Connection Error: Backend is not running on http://127.0.0.1:8000")
        print("  Start the backend with: python -m uvicorn app.main:app --reload")
        return False
    except Exception as e:
        print(f"✗ Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_get_combined_report()
