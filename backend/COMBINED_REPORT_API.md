# Combined Clinical Report Endpoint

## Overview

The `/getCombinedReport` endpoint generates AI-powered clinical summaries for tumor board cases using Azure OpenAI GPT-4o-mini. It processes patient data and produces comprehensive clinical reports following a structured timeline.

## Endpoint Details

### URL

```
POST /api/v1/getCombinedReport
```

### Base URL

```
http://127.0.0.1:8000
```

## Request Format

### Headers

```
Content-Type: application/json
```

### Request Body

```json
{
  "fallnummer": "string - case number/ID",
  "data": {
    "Case number": "number",
    "Tumor diagnosis": "string",
    "Tumor history": "string",
    "Imaging": "string",
    "Histo Cyto": "string",
    "Staging clinic cT": "string or null",
    "Staging Clinic M": "string",
    "Staging Clinic N": "string",
    "Staging Clinic UICC": "string",
    "Staging Path pT": "string or null",
    "Staging Path N": "string or null",
    "Staging Path M": "string or null",
    "Staging Path UICC": "string or null",
    "Secondary diagnoses": "string",
    "therapy so far": "string or null",
    "curative": "number (0 or 1)",
    "palliative": "number (0 or 1)",
    "pall connection": "number (0 or 1)",
    "Old": "number - patient age"
  }
}
```

### Example Request

```bash
curl -X POST http://127.0.0.1:8000/api/v1/getCombinedReport \
  -H "Content-Type: application/json" \
  -d '{
    "fallnummer": "18693120",
    "data": {
      "Case number": 18693120,
      "Tumor diagnosis": "moderately differentiated acinar adenocarcinoma of the right upper lobe",
      "Tumor history": "Patient with initial breast cancer diagnosis; suspicious lung mass found during imaging",
      "Imaging": "PET/CT: No evidence of tumor residues or lymph node involvement",
      "Histo Cyto": "Histology shows adenocarcinoma with KRAS and TP53 mutations",
      "Staging clinic cT": null,
      "Staging Clinic M": "0",
      "Staging Clinic N": "0",
      "Staging Clinic UICC": "IA3",
      "Staging Path pT": "1a",
      "Staging Path N": null,
      "Staging Path M": null,
      "Staging Path UICC": null,
      "Secondary diagnoses": "Nicotine abuse, arterial hypertension, hypothyroidism",
      "therapy so far": null,
      "curative": 1,
      "palliative": 0,
      "pall connection": 0,
      "Old": 68
    }
  }'
```

## Response Format

### Success Response (HTTP 200)

```json
{
  "fallnummer": "18693120",
  "clinical_report": "**Tumor History:** ...\n\n**Imaging Findings:** ...\n\n**Clinical Staging Summary:** ...\n\n**Pathological Staging Summary:** ...\n\n**Missing or Outdated Information:** ...\n\n**Final Assessment:** ...",
  "timestamp": "2025-11-01T01:26:41.583900",
  "message": "Report generated successfully"
}
```

### Report Structure

The generated report includes:

1. **Tumor History** (1-2 sentences): Summary of patient history and secondary diagnoses
2. **Imaging Findings** (1-2 sentences): Key imaging findings and conclusions
3. **Clinical Staging Summary** (1-2 sentences): TNM clinical stage
4. **Pathological Staging Summary** (1-2 sentences): TNM pathological stage
5. **Missing or Outdated Information**: List of missing or incomplete data
6. **Final Assessment** (5-10 sentences): Comprehensive case summary with recommendations

### Error Response (HTTP 400)

```json
{
  "detail": "Both fallnummer and data are required"
}
```

### Error Response (HTTP 500)

```json
{
  "detail": "Error generating report: [error details]"
}
```

## Configuration

### Environment Variables (.env)

Located at `backend/.env`:

```
AZURE_OPENAI_ENDPOINT=https://agathonaifoundry.cognitiveservices.azure.com/
AZURE_OPENAI_API_KEY=your_api_key_here
OPENAI_API_VERSION=2024-12-01-preview
OPENAI_DEPLOYMENT_NAME=gpt-4o-mini
```

### Installation

1. Install required packages:

```bash
cd backend
pip install openai python-dotenv
```

2. Ensure `.env` file exists with Azure credentials

3. Start the backend:

```bash
python -m uvicorn app.main:app --reload
```

## Service Architecture

### OpenAI Service (`app/services/openai_service.py`)

- Initializes Azure OpenAI client
- Constructs clinical prompt based on patient data
- Generates report using GPT-4o-mini with deterministic settings
- Handles errors and edge cases

### Route Handler (`app/api/routes.py`)

- Validates request body
- Calls OpenAI service
- Returns formatted response with timestamp

## Features

✅ **AI-Powered Analysis**: Uses Azure OpenAI GPT-4o-mini for clinical summarization  
✅ **Comprehensive Reporting**: Follows established tumor board reporting timeline  
✅ **Error Handling**: Graceful error messages and validation  
✅ **Timestamp Tracking**: Records when reports are generated  
✅ **Missing Data Detection**: AI identifies gaps in clinical information

## Testing

Run the test script:

```bash
python backend/test_combined_report.py
```

Or use curl for manual testing (see Example Request above).

## Notes

- The endpoint requires valid Azure OpenAI credentials
- Processing time depends on Azure OpenAI service response time (typically 5-15 seconds)
- Report generation uses deterministic parameters (temperature=0.0) for reproducible output
- Maximum token output is limited to 800 tokens
