# Agathon Tumorboard Backend API

A FastAPI-based backend service that provides access to tumorboard data by Fallnummer (case number) from Excel files.

## 🚀 Features

- **Excel Data Integration**: Automatically loads and processes tumorboard data from Excel files
- **RESTful API**: Clean and intuitive API endpoints for data retrieval
- **Case Number Lookup**: Search patient data by Fallnummer/case number
- **JSON Response**: Returns structured patient data in JSON format
- **Interactive Documentation**: Auto-generated Swagger UI documentation
- **CORS Support**: Ready for frontend integration

## 📋 Prerequisites

### Windows
- Python 3.8 or higher
- pip (Python package installer)

### macOS/MacBook
- Python 3.8 or higher (install via [python.org](https://www.python.org/downloads/) or Homebrew)
- pip3 (usually comes with Python 3)

#### Installing Python on macOS:
```bash
# Option 1: Using Homebrew (recommended)
brew install python

# Option 2: Download from python.org
# Visit https://www.python.org/downloads/ and download the latest version

# Verify installation
python3 --version
pip3 --version
```

## 🛠️ Installation

### 🍎 Quick Setup for macOS/MacBook Users

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip3 install -r requirements.txt

# 4. Start the server
python3 -m uvicorn app.main:app --reload
```

### 📝 Detailed Installation Steps

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment (Recommended)

#### On Windows:
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate
```

#### On macOS/MacBook:
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate
```

#### On Linux:
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate
```

### 3. Install Dependencies

#### On Windows:
```bash
pip install -r requirements.txt
```

#### On macOS/MacBook:
```bash
# Use pip3 if pip is not available
pip3 install -r requirements.txt
```

#### Alternative (if you encounter permission issues on macOS):
```bash
python3 -m pip install -r requirements.txt
```

## 🏃‍♂️ Running the Application

### Start the Development Server

#### On Windows:
```bash
uvicorn app.main:app --reload
```

#### On macOS/MacBook:
```bash
# Method 1: Direct uvicorn command
uvicorn app.main:app --reload

# Method 2: Using Python module (if Method 1 doesn't work)
python3 -m uvicorn app.main:app --reload

# Method 3: With explicit Python path
PYTHONPATH=. python3 -m uvicorn app.main:app --reload
```

#### Alternative for all platforms:
```bash
python -m uvicorn app.main:app --reload
```

The API will be available at:
- **API Base URL**: `http://localhost:8000`
- **Interactive Documentation**: `http://localhost:8000/docs`
- **Alternative Docs**: `http://localhost:8000/redoc`

## 📚 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Welcome message and API status |
| `GET` | `/hello` | Simple hello world test |
| `GET` | `/copilot` | GitHub Copilot greeting |

### Data Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/fallnummer/{fallnummer}` | Get patient data by case number |
| `GET` | `/api/v1/fallnummer?fallnummer=12345` | Get patient data by query parameter |
| `GET` | `/api/v1/excel/info` | Get Excel file information |
| `GET` | `/api/v1/excel/fallnummers` | Get all available case numbers |

### Example Usage

**Get patient data by case number:**
```bash
curl http://localhost:8000/api/v1/fallnummer/18759158
```

**Get Excel file information:**
```bash
curl http://localhost:8000/api/v1/excel/info
```

**Response Format:**
```json
{
  "fallnummer": "18759158",
  "data": {
    "Case number": "18759158",
    "G": "W",
    "Date": "2025-03-25T00:00:00",
    "Procedure": "...",
    "Tumor diagnosis": "...",
    // ... all other patient fields
  },
  "message": "Data retrieved successfully"
}
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py        # API route definitions
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py       # Pydantic data models
│   └── services/
│       ├── __init__.py
│       └── excel_service.py # Excel file processing logic
├── asset/
│   └── Tumorboard_final_eng.xlsx  # Excel data file
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## 🔧 Configuration

### Excel File
- Place your Excel file in the `asset/` directory
- Default file: `Tumorboard_final_eng.xlsx`
- The service automatically detects the case number column

### Environment Variables
The application can be configured using environment variables:
- `HOST`: Server host (default: 127.0.0.1)
- `PORT`: Server port (default: 8000)

## 🧪 Testing

### Manual Testing
1. Start the server: `uvicorn app.main:app --reload`
2. Visit: `http://localhost:8000/docs`
3. Use the interactive Swagger UI to test endpoints

### Test with curl
```bash
# Test root endpoint
curl http://localhost:8000/

# Test case number lookup
curl http://localhost:8000/api/v1/fallnummer/18759158

# Test Excel info
curl http://localhost:8000/api/v1/excel/info
```

## 📦 Dependencies

- **FastAPI**: Modern, fast web framework for building APIs
- **Uvicorn**: Lightning-fast ASGI server
- **Pandas**: Data manipulation and analysis library
- **Openpyxl**: Excel file reading/writing library
- **Pydantic**: Data validation using Python type annotations

## 🚨 Troubleshooting

### Common Issues

**1. Module not found errors:**
```bash
# Make sure you're in the backend directory
cd backend
# Ensure dependencies are installed
pip install -r requirements.txt
```

**2. Excel file not found:**
- Verify the Excel file exists in `backend/asset/`
- Check file permissions

**3. Port already in use:**
```bash
# Use a different port
uvicorn app.main:app --reload --port 8001
```

### macOS/MacBook Specific Issues

**1. Python command not found:**
```bash
# Use python3 instead of python
python3 --version
python3 -m venv venv
```

**2. Permission denied errors:**
```bash
# Use python3 -m pip instead of pip
python3 -m pip install -r requirements.txt

# Or install with user flag
pip3 install --user -r requirements.txt
```

**3. SSL Certificate issues:**
```bash
# Update certificates
/Applications/Python\ 3.x/Install\ Certificates.command
```

**4. Command not found: uvicorn**
```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Or use python module method
python3 -m uvicorn app.main:app --reload
```

**4. Import errors:**

#### On Windows:
```bash
# Set Python path (if needed)
set PYTHONPATH=%PYTHONPATH%;%cd%
# Then run the server
uvicorn app.main:app --reload
```

#### On macOS/MacBook:
```bash
# Set Python path (if needed)
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
# Then run the server
uvicorn app.main:app --reload

# Alternative method
PYTHONPATH=. python3 -m uvicorn app.main:app --reload
```

## 🔄 Development

### Adding New Endpoints
1. Add route functions to `app/api/routes.py`
2. Create corresponding Pydantic models in `app/models/schemas.py`
3. The server will auto-reload during development

### Modifying Excel Processing
- Edit `app/services/excel_service.py` to change data processing logic
- The service automatically reloads the Excel file on startup

## 📝 Logs

The server provides detailed logging:
- Request/response information
- Excel file loading status
- Error messages with stack traces

## 🤝 Contributing

1. Follow PEP 8 style guidelines
2. Add type hints to new functions
3. Update this README when adding new features
4. Test endpoints before committing

## 📄 License

This project is part of the Agathon Tumorboard application.

---

**Need help?** Check the interactive documentation at `http://localhost:8000/docs` when the server is running.
│   ├── __init__.py
