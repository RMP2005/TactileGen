import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.config import settings

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Preloading ML models...")
    from app.pipeline.segmenter import Segmenter
    from app.pipeline.ocr_extractor import get_reader
    seg = Segmenter()
    seg._load_model()
    get_reader()
    logger.info("ML models loaded.")
    yield

app = FastAPI(
    title="TactileGen API",
    description="Backend for TactileGen - AI accessibility product for tactile diagrams",
    version="1.0.0",
    lifespan=lifespan,
)

# Setup CORS
origins = settings.CORS_ORIGINS.split(",") if settings.CORS_ORIGINS else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")
app.include_router(api_router, prefix="/api")
