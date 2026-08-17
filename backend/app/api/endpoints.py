import time
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from app.api.schema import (
    ProcessResponse, ProcessMetadata, HealthResponse,
    SemanticRegionModel, ExtractedLabelModel, TactilePathModel, RegionBounds
)
from app.config import settings
from app.pipeline.preprocessor import Preprocessor
from app.pipeline.segmenter import Segmenter
from app.pipeline.ocr_extractor import OCRExtractor
from app.pipeline.simplifier import Simplifier
from app.pipeline.tactile_builder import TactileBuilder
import traceback

router = APIRouter()

# Instantiate pipeline components
preprocessor = Preprocessor()
segmenter = Segmenter()
ocr_extractor = OCRExtractor()
simplifier = Simplifier()
tactile_builder = TactileBuilder()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="ok",
        version="1.0.0",
        ml_device=settings.MODEL_DEVICE
    )

@router.get("/samples")
async def get_samples():
    return [
        {"id": "sample_1", "name": "Biology Cell Structure", "type": "biology"},
        {"id": "sample_2", "name": "Electrical Circuit Diagram", "type": "physics"},
        {"id": "sample_3", "name": "Optics Ray Diagram", "type": "optics"},
    ]

@router.post("/process", response_model=ProcessResponse)
async def process_image(
    file: UploadFile = File(...),
    simplification_level: float = Form(0.5),
    min_stroke_width: int = Form(4)
):
    start_time = time.time()
    
    # Validate file type
    allowed_content_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_content_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, and WebP are supported.")
    
    # Check file size
    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File size exceeds {settings.MAX_FILE_SIZE_MB}MB limit.")
        
    try:
        # Pipeline execution
        img_bgr = preprocessor.process(content)
        h, w = img_bgr.shape[:2]
        
        regions = segmenter.segment(img_bgr)
        labels = ocr_extractor.extract(img_bgr)
        simplified_paths = simplifier.simplify(img_bgr, regions, simplification_level)
        
        svg_str, png_b64, tactile_metadata = tactile_builder.build(
            w, h, simplified_paths, regions, labels, min_stroke_width
        )
        
        # Format structured regions
        formatted_regions: list[SemanticRegionModel] = []
        for i, r in enumerate(regions):
            bbox = r["bbox"]
            formatted_regions.append(SemanticRegionModel(
                id=f"region_{i+1}",
                label=f"Region {i+1}" if r.get("class_id") == 255 else f"Semantic Shape {r.get('class_id')}",
                category="structural" if r.get("class_id") == 255 else "semantic",
                confidence=0.92 if r.get("class_id") == 255 else 0.85,
                bounds=RegionBounds(x=bbox[0], y=bbox[1], width=bbox[2], height=bbox[3]),
                polygon_points=r.get("contour", [])
            ))
            
        # Format structured labels
        formatted_labels: list[ExtractedLabelModel] = []
        for i, l in enumerate(labels):
            bbox = l["bbox"]
            formatted_labels.append(ExtractedLabelModel(
                id=f"label_{i+1}",
                text=l["text"],
                x=bbox[0],
                y=bbox[1],
                width=bbox[2],
                height=bbox[3],
                confidence=float(l.get("confidence", 0.9))
            ))
            
        # Format structured tactile paths
        formatted_paths: list[TactilePathModel] = []
        for i, p in enumerate(simplified_paths):
            if len(p) < 2:
                continue
            d = f"M {p[0][0]} {p[0][1]} " + " ".join([f"L {pt[0]} {pt[1]}" for pt in p[1:]])
            formatted_paths.append(TactilePathModel(
                id=f"path_{i+1}",
                path_d=d,
                stroke_width=min_stroke_width,
                layer_type="primary_outline"
            ))
        
        processing_time_ms = int((time.time() - start_time) * 1000)
        
        return ProcessResponse(
            job_id=f"tg_{uuid.uuid4().hex[:8]}",
            status="success",
            processing_time_ms=processing_time_ms,
            metadata=ProcessMetadata(
                original_width=w,
                original_height=h,
                total_regions_detected=len(formatted_regions),
                total_lines_simplified=len(formatted_paths),
                labels_count=len(formatted_labels)
            ),
            tactile_svg=svg_str,
            processed_image_base64=png_b64,
            semantic_regions=formatted_regions,
            extracted_labels=formatted_labels,
            tactile_paths=formatted_paths
        )
        
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
