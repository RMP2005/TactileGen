export interface ProcessingResult {
  job_id: string;
  status: 'success' | 'error';
  processing_time_ms: number;
  metadata: DiagramMetadata;
  tactile_svg: string;
  processed_image_base64: string;
  semantic_regions: SemanticRegion[];
  extracted_labels: ExtractedLabel[];
  tactile_paths: TactilePath[];
}

export interface DiagramMetadata {
  original_width: number;
  original_height: number;
  total_regions_detected: number;
  total_lines_simplified: number;
  labels_count: number;
}

export interface SemanticRegion {
  id: string;
  label: string;
  category: string;
  confidence: number;
  bounds: { x: number; y: number; width: number; height: number };
  polygon_points: number[][];
}

export interface ExtractedLabel {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  connected_region_id?: string;
}

export interface TactilePath {
  id: string;
  path_d: string;
  stroke_width: number;
  layer_type: 'primary_outline' | 'secondary_detail' | 'region_boundary';
}

export type PipelineStage = 'idle' | 'uploading' | 'understanding' | 'segmenting' | 'simplifying' | 'tactile' | 'complete' | 'error';
