import cv2
import base64
import numpy as np

def encode_image(img: np.ndarray, ext=".png") -> str:
    _, buffer = cv2.imencode(ext, img)
    return base64.b64encode(buffer).decode("utf-8")
