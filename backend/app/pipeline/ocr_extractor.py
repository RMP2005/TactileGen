import gc
import easyocr
import cv2
import numpy as np
from app.utils.memlog import log_mem
from app.utils.model_gate import get_model_load_lock

_reader = None


def get_reader():
    global _reader
    if _reader is not None:
        return _reader
    lock = get_model_load_lock()
    with lock:
        if _reader is not None:
            return _reader
        log_mem("ocr_before_load")
        _reader = easyocr.Reader(['en'], gpu=False)
        log_mem("ocr_after_load")
    return _reader


def release_reader():
    """Release the OCR reader from memory."""
    global _reader
    if _reader is not None:
        del _reader
        _reader = None
        gc.collect()
        log_mem("ocr_released")


class OCRExtractor:
    def __init__(self):
        pass

    def extract(self, img_bgr: np.ndarray) -> list:
        reader = get_reader()
        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        results = reader.readtext(img_rgb)
        del img_rgb

        labels = []
        for (bbox, text, prob) in results:
            x_min = int(min([pt[0] for pt in bbox]))
            y_min = int(min([pt[1] for pt in bbox]))
            x_max = int(max([pt[0] for pt in bbox]))
            y_max = int(max([pt[1] for pt in bbox]))

            labels.append({
                "text": text,
                "bbox": [x_min, y_min, x_max - x_min, y_max - y_min],
                "confidence": float(prob)
            })

        return labels
