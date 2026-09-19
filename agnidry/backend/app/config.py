from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_DB_PATH = BASE_DIR / "agnidry.db"

class Settings(BaseSettings):
    app_name: str = "AgniDry Backend API"
    version: str = "1.0.0"
    device_id: str = "AGNI-001"
    database_url: str = f"sqlite:///{DEFAULT_DB_PATH}"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    # Local-first safety thresholds
    default_max_temperature: float = 55.0
    default_target_humidity: float = 40.0
    default_min_battery_voltage: float = 11.8

    model_config = {"env_prefix": "AGNIDRY_"}

settings = Settings()
