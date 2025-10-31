from fastapi import FastAPI
from app.api.routes import router as api_router

app = FastAPI()

app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI application!"}

@app.get("/hello")
def hello_world():
    return {"message": "Hello World from FastAPI!"}

@app.get("/hello/{name}")
def hello_name(name: str):
    return {"message": f"Hello {name}!"}