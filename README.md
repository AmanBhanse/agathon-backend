# Agathon Tumorboard Platform

Agathon is a software platform designed to support tumorboard workflows, clinical data review, and AI-powered report generation. It provides a seamless experience for clinicians to review patient data, generate summaries, and access guideline-based recommendations, including palliative care procedures.

## Overview

Agathon consists of two main components:

- **Backend**: Handles data ingestion from Excel, provides RESTful APIs, and integrates AI-powered clinical reporting.
- **Frontend**: Offers a modern, protected web interface for clinicians to interact with patient data, summaries, and recommendations.

## Key Features

- **Tumorboard Data Integration**: Automatically loads and processes tumorboard data from Excel files.
- **Case Lookup**: Search and review patient data by case number (Fallnummer).
- **AI-Powered Reports**: Generate and view clinical summaries and recommendations using AI.
- **Guideline Support**: Access up-to-date clinical guidelines, including detailed palliative care procedures.
- **Palliative Care Alerts**: If a patient is palliative but not connected to palliative care, the system displays a warning and provides a step-by-step dialog with guideline-based recommendations.
- **Interactive Visualizations**: View staging and treatment data with dynamic charts.
- **Secure Access**: Protected routes and authentication for clinical users.

## Typical Workflow

1. **Login**: Clinician logs in with a case number and name.
2. **Home**: Overview and navigation to patient cases.
3. **Summary**: Review patient summary, staging, and treatment data.
4. **Analysis**: Access AI-generated clinical reports and specialist recommendations.
5. **Guidelines**: Query clinical guidelines and review palliative care procedures.
6. **Palliative Care Dialog**: If a palliative patient is not connected to care, a dialog provides a detailed, guideline-based care pathway.

## Setup Instructions

### Backend

1. Ensure Python 3.8+ is installed.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Start the backend server:
   ```bash
   python3 -m uvicorn app.main:app --reload
   ```
   The API will be available at http://127.0.0.1:8000 (Swagger docs at /docs).

### Frontend

1. Ensure Node.js (v18+) and npm are installed.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:5173 by default.

## Configuration

- All API endpoints are centralized in `frontend/src/config.js` for easy environment switching.
- Backend Excel data location and environment variables can be configured in `backend/app/`.

## Technologies Used

- Backend: FastAPI, Uvicorn, Pandas, OpenPyXL, Pydantic, SQLAlchemy, OpenAI API
- Frontend: React, Vite, Zustand, React Router, Plotly.js, Lucide React Icons

## License

This project is for research and clinical workflow prototyping. For production or clinical use, please review all code, dependencies, and data privacy requirements.

## Acknowledgments

- S3-Leitlinie Palliativmedizin für Patienten mit einer nicht‑heilbaren Krebserkrankung (Version 2.1, January 2020)
- [Leitlinienprogramm Onkologie](https://www.leitlinienprogramm-onkologie.de/)
- [CCC Netzwerk](https://www.ccc-netzwerk.de/)
