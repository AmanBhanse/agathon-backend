#!/bin/bash
cd "$(dirname "$0")/backend"
.venv/bin/python -m uvicorn app.main:app --reload --port 8000
