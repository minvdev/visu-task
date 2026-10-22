# Environment Setup

This guide explains how to configure the development environment, install the backend dependencies, run the tests, and start the application using Docker Compose.

## 1. Prerequisites

Install the following tools before proceeding:

- **Git:** required to clone the repository.
- **Python 3.14 or later:** required by the backend. Check `backend/pyproject.toml` for the authoritative version constraint.
- **Docker Engine and Docker Compose:** Docker must be running, and Docker Compose must be available as `docker compose`. The documented setup tested is Docker Compose v5.6.0 or later.

Verify the installed versions:

```bash
git --version
python3 --version
docker --version
docker compose version
```

## 2. Project setup

### 2.1. Clone the repository

Clone the repository and enter its root directory:

```bash
git clone https://github.com/minvdev/visu-task.git
cd visu-task
```

The following instructions assume that the commands are executed from the repository root unless stated otherwise.

### 2.2. Configure environment variables

The project uses two environment files for different purposes:

- **`.env`**: project-level configuration used by Docker Compose, including PostgreSQL credentials and the secrets required by the application.
- **`backend/.env`**: backend configuration for local development and testing, including the database connection URL and API keys.

Create both files from their corresponding examples:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

Edit both files and replace the example values with appropriate values for your environment. In particular, configure valid database credentials and a suitable application secret.

The database connection URL must match the environment in which the backend runs. When connecting from the host machine to the database exposed by Docker Compose, use the host address and published port. When connecting from a container, use the database service name and its internal port.

**Do not commit the actual `.env` files.** They may contain credentials and secrets. The `.env.example` files document the required configuration without exposing sensitive values.

## 3. Backend setup

### 3.1. Create a virtual environment

Enter the backend directory, create a virtual enviroment and activate it:

> Create the virtual environment with the correct python version instalated.
> You can check the python's version with `python3 --version`

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

The virtual environment isolates the project's Python dependencies from the system installation.

### 3.2. Install dependencies

Install the backend package in editable mode, including the development dependency group:

```bash
python3 -m pip install -e . --group dev
```

This installs the project and its development dependencies as declared in `pyproject.toml`.

### 3.3. Run the tests

From the `backend/` directory, with the virtual environment activated, run:

```bash
pytest
```

## 4. Run the application with Docker Compose

Return to the repository root:

```bash
cd ..
```

Build the required images and start the services:

```bash
docker compose up --build
```

Docker Compose reads `compose.yaml` and the project-level `.env` file, builds the backend image if necessary, and starts the configured services.

On startup, the backend waits for PostgreSQL to become available, applies the Alembic migrations, and then starts the FastAPI server.

To stop the services, press `Ctrl+C`. To stop and remove the containers and network without deleting the database volume, run:

```bash
docker compose down
```

The named PostgreSQL volume persists independently of the containers, so stopping or recreating them does not normally erase the database.

## 5. Useful commands

Run these commands from the repository root:

| Command                     | Purpose                                    |
| --------------------------- | ------------------------------------------ |
| `docker compose up --build` | Build and start the services               |
| `docker compose up -d`      | Start the services in the background       |
| `docker compose logs -f`    | Follow service logs                        |
| `docker compose ps`         | Show service status                        |
| `docker compose down`       | Stop and remove containers and the network |

For additional configuration details, consult the relevant `.env.example` files and `backend/pyproject.toml`.
