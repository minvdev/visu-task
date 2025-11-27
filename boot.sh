#!/bin/bash
echo "Waiting for the database to be ready"
until alembic upgrade head; do
    echo "Upgrade command failed, retrying in 5 secs..."
    sleep 5
done

echo "Starting uvicorn"

uvicorn app.main:app --host 0.0.0.0 --port 8000