from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router
from app.services.rag_service import RAGSystem
from app.services.excel_service import excel_service
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Agathon Tumorboard API",
    description="API for accessing Tumorboard data by Fallnummer and RAG-based breast cancer guidelines",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

# Global RAG system instance
rag_system = None


@app.on_event("startup")
async def startup_event():
    """Initialize RAG system on startup and load S3 Guideline Breast Cancer PDF"""
    global rag_system
    try:
        logger.info("Initializing RAG system...")
        
        # Initialize RAG system
        rag_system = RAGSystem(embeddings_path="embeddings.pkl")
        
        # Store RAG system in app state for access in routes
        app.state.rag_system = rag_system
        
        # Try to load the S3 Guideline Breast Cancer PDF if it exists
        pdf_path = os.path.join(os.path.dirname(__file__), "..", "asset", "S3_Guideline_Breast_Cancer.pdf")
        
        if os.path.exists(pdf_path):
            logger.info(f"Found S3 Guideline Breast Cancer PDF at {pdf_path}")
            
            # Check if embeddings already exist
            if rag_system.load_embeddings():
                logger.info("Loaded existing embeddings from disk")
            else:
                logger.info("Creating new embeddings for S3 Guideline Breast Cancer PDF...")
                rag_system.load_pdf(pdf_path, chunk_size=800, overlap=150)
                logger.info(f"Successfully indexed PDF with {len(rag_system.chunks)} chunks")
        else:
            logger.warning(f"S3 Guideline Breast Cancer PDF not found at {pdf_path}")
            logger.info("You can upload a PDF using the /api/v1/indexPDF endpoint")
        
        logger.info("RAG system initialization complete")
    except Exception as e:
        logger.error(f"Error initializing RAG system: {str(e)}")
        # Continue even if RAG initialization fails
        rag_system = None
        app.state.rag_system = None


@app.get("/")
def read_root():
    return {"message": "Welcome to the Agathon Tumorboard API!"}


@app.get("/hello")
def hello_world():
    return {"message": "Hello World from FastAPI!"}


@app.get("/hello/{name}")
def hello_name(name: str):
    return {"message": f"Hello {name}!"}


@app.get("/copilot")
def hello_copilot():
    return {"message": "Hello! I'm GitHub Copilot, your AI programming assistant."}
