/**
 * 파일 저장 경로 (학습 데이터 일자별 디렉토리 기준)
 * /training-data/YYYY-MM-DD/image.jpg
 */
export const TRAINING_DATA_BASE_PATH = 'training-data';

/**
 * 서비스용 이미지 경로 (frame.path, vlm_frame.path 상대 경로 기준)
 */
export const SERVICE_DATA_PATH = 'service_data';

/**
 * POI Detection Class (문서 7.1)
 */
export const POI_DETECTION_CLASSES = [
  'crack',
  'pothole',
  'puddle',
  'manhole',
  'traffic_cone',
] as const;

export type PoiDetectionClass = (typeof POI_DETECTION_CLASSES)[number];

/**
 * VLM Detection Class (문서 7.2)
 */
export const VLM_DETECTION_CLASSES = [
  'veg_encroachment',
  'soil_subsidence',
  'guardrail_damage',
  'lane_damage',
  'sign_damage',
] as const;

export type VlmDetectionClass = (typeof VLM_DETECTION_CLASSES)[number];

/**
 * VLM bbox JSONB 키
 */
export const VLM_BBOX_KEYS = ['x1', 'y1', 'x2', 'y2'] as const;
