import os
from pathlib import Path

from sqlalchemy import create_engine, text

SEEDS_DIR = Path(__file__).resolve().parent.parent / "seeds"


def main() -> None:
    load_initial_data = os.getenv("LOAD_INITIAL_DATA", "false").strip().lower()

    if load_initial_data not in {"true", "false", "1", "0", "yes", "no", "on", "off"}:
        raise ValueError("LOAD_INITIAL_DATA must be a boolean value")

    if load_initial_data not in {"true", "1", "yes", "on"}:
        print("Initial data loading is disabled")
        return

    filename = os.getenv("INIT_SQL_FILE", "init_data.sql")

    # Solo se permiten nombres de archivo, no rutas arbitrarias.
    if Path(filename).name != filename or Path(filename).suffix.lower() != ".sql":
        raise ValueError("INIT_SQL_FILE must be an SQL filename inside backend/seeds")

    seed_path = SEEDS_DIR / filename

    if not seed_path.is_file():
        raise FileNotFoundError(f"Seed file does not exist: {seed_path}")

    sql = seed_path.read_text(encoding="utf-8").strip()

    if not sql:
        raise ValueError(f"Seed file is empty: {seed_path}")

    database_url = os.environ["DATABASE_URL"]
    engine = create_engine(database_url)

    try:
        with engine.begin() as connection:
            # Registro de los archivos que ya se han aplicado.
            connection.exec_driver_sql(
                """
                CREATE TABLE IF NOT EXISTS app_seed_history (
                    filename TEXT PRIMARY KEY,
                    applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
                """
            )

            already_applied = connection.execute(
                text("SELECT 1 FROM app_seed_history WHERE filename = :filename"),
                {"filename": filename},
            ).first()

            if already_applied:
                print(f"Seed already applied: {filename}")
                return

            # El archivo debe contener SQL ordinario, no comandos de psql.
            connection.exec_driver_sql(sql)

            connection.execute(
                text("INSERT INTO app_seed_history (filename) VALUES (:filename)"),
                {"filename": filename},
            )

        print(f"Seed applied successfully: {filename}")

    finally:
        engine.dispose()


if __name__ == "__main__":
    main()
