import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MODEL_DEVICE: str = os.getenv("MODEL_DEVICE", "cpu")
    MAX_FILE_SIZE_MB: int = int(os.getenv("MAX_FILE_SIZE_MB", 10))
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")

settings = Settings()
