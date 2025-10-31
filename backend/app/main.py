from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router

app = FastAPI(
    title="Agathon Tumorboard API",
    description="API for accessing Tumorboard data by Fallnummer",
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
