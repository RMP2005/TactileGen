import easyocr
import cv2
import numpy as np

# Singleton reader
_reader = None

def get_reader():
    global _reader
    if _reader is None:
        _reader = easyocr.Reader(['en'], gpu=False)
    return _reader

class OCRExtractor:
    def __init__(self):
        pass
        
    def extract(self, img_bgr: np.ndarray) -> list:
        reader = get_reader()
        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        results = reader.readtext(img_rgb)
        
        labels = []
        for (bbox, text, prob) in results:
            # bbox is list of 4 points: [tl, tr, br, bl]
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
