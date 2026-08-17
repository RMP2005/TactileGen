from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class RegionBounds(BaseModel):
    x: int
    y: int
    width: int
    height: int

class SemanticRegionModel(BaseModel):
    id: str
    label: str
    category: str
    confidence: float
    bounds: RegionBounds
    polygon_points: List[List[int]]

class ExtractedLabelModel(BaseModel):
    id: str
    text: str
    x: int
    y: int
    width: int
    height: int
    confidence: float
    connected_region_id: Optional[str] = None

class TactilePathModel(BaseModel):
    id: str
    path_d: str
    stroke_width: int
    layer_type: str

class ProcessMetadata(BaseModel):
    original_width: int
    original_height: int
    total_regions_detected: int
    total_lines_simplified: int
    labels_count: int

class ProcessResponse(BaseModel):
    job_id: str
    status: str
    processing_time_ms: int
    metadata: ProcessMetadata
    tactile_svg: str
    processed_image_base64: str
    semantic_regions: List[SemanticRegionModel]
    extracted_labels: List[ExtractedLabelModel]
    tactile_paths: List[TactilePathModel]

class HealthResponse(BaseModel):
    status: str
    version: str
    ml_device: str
