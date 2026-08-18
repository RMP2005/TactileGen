import cv2
import numpy as np
from app.utils.memlog import log_mem

class Preprocessor:
    def __init__(self, max_size=1024):
        self.max_size = max_size
        
    def process(self, image_bytes: bytes) -> np.ndarray:
        log_mem("preprocess_start")
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        del nparr
        
        if img is None:
            raise ValueError("Could not decode image.")
            
        h, w = img.shape[:2]
        if max(h, w) > self.max_size:
            scale = self.max_size / max(h, w)
            new_w, new_h = int(w * scale), int(h * scale)
            img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
            
        lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        del lab
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        cl = clahe.apply(l)
        del l
        limg = cv2.merge((cl, a, b))
        del cl, a, b
        img_clahe = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
        del limg
        
        img_filtered = cv2.bilateralFilter(img_clahe, d=9, sigmaColor=75, sigmaSpace=75)
        del img_clahe
        
        log_mem("preprocess_end")
        return img_filtered
