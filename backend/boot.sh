#!/bin/bash

set -e

echo "Applying database migrations"
alembic upgrade head

echo "Checking whether initial data should be loaded"
python scripts/load_seed.py

echo "Starting uvicorn"
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload