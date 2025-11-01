#!/bin/bash
# Quick Reference: getCombinedReport Endpoint

# ============================================================================
# QUICK START
# ============================================================================

# 1. Ensure backend is running
# cd backend
# python -m uvicorn app.main:app --reload

# 2. Test the endpoint with curl

# Test with sample data
curl -X POST http://127.0.0.1:8000/api/v1/getCombinedReport \
  -H "Content-Type: application/json" \
  -d '{
    "fallnummer": "18693120",
    "data": {
      "Case number": 18693120,
      "Tumor diagnosis": "moderately differentiated acinar adenocarcinoma",
      "Tumor history": "Patient with initial breast cancer diagnosis; lung mass found",
      "Imaging": "PET/CT: No evidence of tumor residues",
      "Histo Cyto": "Adenocarcinoma with KRAS and TP53 mutations",
      "Staging clinic cT": null,
      "Staging Clinic M": "0",
      "Staging Clinic N": "0",
      "Staging Clinic UICC": "IA3",
      "Staging Path pT": "1a",
      "Secondary diagnoses": "Nicotine abuse, hypertension, hypothyroidism",
      "therapy so far": null,
      "curative": 1,
      "Old": 68
    }
  }'

# ============================================================================
# INTEGRATION WITH EXISTING API
# ============================================================================

# Get case data from fallnummer API and generate report
curl -s http://127.0.0.1:8000/api/v1/fallnummer/18717770 | \
  jq -c '{fallnummer: .fallnummer, data: .data}' | \
  curl -X POST http://127.0.0.1:8000/api/v1/getCombinedReport \
    -H "Content-Type: application/json" -d @-

# ============================================================================
# RESPONSE FIELDS
# ============================================================================

# fallnummer: The case number submitted
# clinical_report: Multi-section clinical summary from AI
# timestamp: ISO 8601 timestamp of report generation
# message: Status message

# ============================================================================
# PYTHON EXAMPLE
# ============================================================================

"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/v1"

def generate_report(fallnummer, patient_data):
    payload = {
        "fallnummer": fallnummer,
        "data": patient_data
    }
    
    response = requests.post(
        f"{BASE_URL}/getCombinedReport",
        json=payload,
        timeout=30
    )
    
    return response.json()

# Usage
report = generate_report("18717770", case_data)
print(report["clinical_report"])
"""

# ============================================================================
# JAVASCRIPT/FETCH EXAMPLE
# ============================================================================

"""
async function generateReport(fallnummer, caseData) {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/getCombinedReport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fallnummer,
        data: caseData
      })
    });
    
    const result = await response.json();
    return result.clinical_report;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage
const report = await generateReport('18717770', caseData);
console.log(report);
"""

# ============================================================================
# TROUBLESHOOTING
# ============================================================================

# Check if backend is running:
curl http://127.0.0.1:8000/api/v1/excel/fallnummers

# Check environment variables are loaded:
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print(os.getenv('AZURE_OPENAI_API_KEY')[:20])"

# Test Azure OpenAI connection:
python -c "
from openai import AzureOpenAI
import os
from dotenv import load_dotenv
load_dotenv()
client = AzureOpenAI(
    api_version=os.getenv('OPENAI_API_VERSION'),
    azure_endpoint=os.getenv('AZURE_OPENAI_ENDPOINT'),
    api_key=os.getenv('AZURE_OPENAI_API_KEY'),
)
print('✓ Azure OpenAI connected successfully')
"

# ============================================================================
# API DOCUMENTATION
# ============================================================================
# See: backend/COMBINED_REPORT_API.md for full documentation
