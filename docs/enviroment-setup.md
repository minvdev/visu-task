# Environment Setup

This guide explains how to configure the development environment, install the backend dependencies, run the tests, and start the application using Docker Compose.

## 1. Prerequisites

Install the following tools before proceeding:

- **Git:** required to clone the repository.
- **uv:** manages the backend's Python version, virtual environment and dependencies. See the [installation guide](https://docs.astral.sh/uv/getting-started/installation/).
- **Python 3.14 or later (optional):** if no compatible interpreter is found, uv downloads one automatically. Check `backend/pyproject.toml` for the authoritative version constraint.
- **Docker Engine and Docker Compose:** Docker must be running, and Docker Compose must be available as `docker compose`. The documented setup was tested with Docker Compose v5.6.0 or later.

Verify the installed versions:

````bash
git --version
uv --version
docker --version
docker compose version

## 2. Project setup

### 2.1. Clone the repository

Clone the repository and enter its root directory:

```bash
git clone https://github.com/minvdev/visu-task.git
cd visu-task
````

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

### 3.1. Install dependencies

Enter the backend directory and sync the environment:

```bash
cd backend
uv sync
```

This creates `backend/.venv` if it does not exist and installs the project in editable mode, together with the `dev` dependency group, using the versions pinned in `uv.lock`.

### 3.2. Run the tests

From the `backend/` directory, run:

```bash
uv run pytest
```

`uv run` executes the command inside the project environment, so there is no need to activate it. If you prefer to activate it manually, run `source .venv/bin/activate` and then `pytest`.

### 3.3. Manage dependencies

```bash
uv add <package>               # runtime dependency
uv add --group dev <package>   # development dependency
uv remove <package>
```

Commit both `pyproject.toml` and `uv.lock` after changing dependencies. Avoid `pip install`: it ignores `uv.lock` and leaves the environment out of sync.

## 4. Run the application with Docker Compose

Return to the repository root:

```bash
cd ..
```

Build the required images and start the services:

```bash
docker compose up --build
```

The backend image installs its dependencies with uv from uv.lock, so the lockfile must be committed.

Docker Compose reads `compose.yaml` and the project-level `.env` file, builds the backend image if necessary, and starts the configured services.

On startup, the backend waits for PostgreSQL to become available, applies the Alembic migrations, and then starts the FastAPI server.

### Optional initial data

Initial data loading is disabled by default. To enable it, set `LOAD_INITIAL_DATA=true`; `INIT_SQL_FILE` selects a SQL file from `backend/seeds/` and defaults to `init_data.sql`. The seed is intended only for a newly initialized, empty application database.

The seed creates a development account for manual API testing:

| Field    | Value       |
| -------- | ----------- |
| Username | `demo-user` |
| Password | `demo-user` |

Authenticate with `POST /auth/login`, sending `username` and `password` as form fields. These credentials are for local development only and must not be used in production.

Do not enable the seed against an existing database that has not recorded that seed in `app_seed_history`. Seed inserts can conflict with existing records, for example on primary keys. The loader runs the seed in a transaction, so a conflict rolls back the whole attempt and does not leave partial seed data or a success record, but startup will fail until the conflict is addressed. Keep initial loading disabled for existing databases. If sample data is needed there, review and adapt the SQL against that database separately; do not manually mark the seed as applied in `app_seed_history`.

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

Run these commands from `backend/`:

| Command         | Purpose                                                             |
| --------------- | ------------------------------------------------------------------- |
| `uv sync`       | Install the project and its dependencies, including the `dev` group |
| `uv run pytest` | Run the test suite in the project environment                       |

For additional configuration details, consult the relevant `.env.example` files and `backend/pyproject.toml`.
