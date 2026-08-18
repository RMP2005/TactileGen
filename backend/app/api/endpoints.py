import gc
import time
import uuid
import traceback

from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.api.schema import (
    ProcessResponse,
    ProcessMetadata,
    HealthResponse,
    SemanticRegionModel,
    ExtractedLabelModel,
    TactilePathModel,
    RegionBounds
)

from app.config import settings
from app.pipeline.preprocessor import Preprocessor
from app.pipeline.segmenter import Segmenter
from app.pipeline.ocr_extractor import OCRExtractor
from app.pipeline.simplifier import Simplifier
from app.pipeline.tactile_builder import TactileBuilder
from app.utils.memlog import log_mem


router = APIRouter()


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


    allowed_content_types = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ]


    if file.content_type not in allowed_content_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type"
        )


    content = await file.read()


    if len(content) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File too large"
        )


    try:

        img_bgr = preprocessor.process(content)
        del content
        h, w = img_bgr.shape[:2]

        log_mem("preprocess")

        regions = segmenter.segment(img_bgr)
        log_mem("segment")

        labels = ocr_extractor.extract(img_bgr)
        log_mem("ocr")

        simplified_paths = simplifier.simplify(
            img_bgr,
            regions,
            labels,
            simplification_level
        )
        del img_bgr
        log_mem("simplify")

        svg_str, png_b64, tactile_metadata = tactile_builder.build(
            w,
            h,
            simplified_paths,
            regions,
            labels,
            min_stroke_width
        )
        log_mem("tactile_build")


        n_regions = len(regions)
        n_labels = len(labels)

        formatted_regions = [
            SemanticRegionModel.model_construct(
                id=f"region_{i+1}",
                label=f"Region {i+1}",
                category="structural",
                confidence=0.92,
                bounds=RegionBounds.model_construct(
                    x=r["bbox"][0],
                    y=r["bbox"][1],
                    width=r["bbox"][2],
                    height=r["bbox"][3]
                ),
                polygon_points=r.get("contour", [])
            )
            for i, r in enumerate(regions)
        ]


        formatted_labels = [
            ExtractedLabelModel.model_construct(
                id=f"label_{i+1}",
                text=l["text"],
                x=l["bbox"][0],
                y=l["bbox"][1],
                width=l["bbox"][2],
                height=l["bbox"][3],
                confidence=float(l.get("confidence", 0.9))
            )
            for i, l in enumerate(labels)
        ]


        formatted_paths = [
            TactilePathModel.model_construct(
                id=f"path_{i+1}",
                path_d=(
                    f"M {p[0][0]} {p[0][1]} "
                    + " ".join(f"L {pt[0]} {pt[1]}" for pt in p[1:])
                ),
                stroke_width=min_stroke_width,
                layer_type="primary_outline"
            )
            for i, p in enumerate(simplified_paths)
            if len(p) >= 2
        ]

        n_paths = len(formatted_paths)

        del regions, labels, simplified_paths
        gc.collect()
        log_mem("formatted")


        processing_time_ms = int(
            (time.time()-start_time)*1000
        )


        resp = ProcessResponse.model_construct(
            job_id=f"tg_{uuid.uuid4().hex[:8]}",
            status="success",
            processing_time_ms=processing_time_ms,
            metadata=ProcessMetadata.model_construct(
                original_width=w,
                original_height=h,
                total_regions_detected=n_regions,
                total_lines_simplified=n_paths,
                labels_count=n_labels
            ),
            tactile_svg=svg_str,
            processed_image_base64=png_b64,
            semantic_regions=formatted_regions,
            extracted_labels=formatted_labels,
            tactile_paths=formatted_paths
        )

        del formatted_regions, formatted_labels, formatted_paths
        del svg_str, png_b64
        log_mem("response_built")

        return resp



    except Exception as e:

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )
