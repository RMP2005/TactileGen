import cv2
import numpy as np

class Simplifier:
    def __init__(self):
        pass
        
    def _zhang_suen_thinning(self, img: np.ndarray) -> np.ndarray:
        # A simple morphological thinning fallback since ximgproc may not be available
        size = np.size(img)
        skel = np.zeros(img.shape, np.uint8)
        
        ret, img = cv2.threshold(img, 127, 255, 0)
        element = cv2.getStructuringElement(cv2.MORPH_CROSS, (3,3))
        done = False
        
        while(not done):
            eroded = cv2.erode(img, element)
            temp = cv2.dilate(eroded, element)
            temp = cv2.subtract(img, temp)
            skel = cv2.bitwise_or(skel, temp)
            img = eroded.copy()
            
            zeros = size - cv2.countNonZero(img)
            if zeros == size:
                done = True
                
        return skel
        
    def simplify(self, img_bgr: np.ndarray, regions: list, level: float = 0.5) -> list:
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        
        # Mask out label regions if possible to avoid interpreting text as structural lines
        # (Though we don't have labels here, we can use regions if desired)
        
        try:
            # Requires opencv-contrib-python which we might not have
            skeleton = cv2.ximgproc.thinning(edges)
        except AttributeError:
            skeleton = self._zhang_suen_thinning(edges)
            
        contours, _ = cv2.findContours(skeleton, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
        
        simplified_paths = []
        epsilon_factor = 0.01 + (level * 0.04) # 0.01 to 0.05 based on level
        
        # We need to enforce minimum distance between lines.
        # As an approximation, we filter out paths that are too short
        # or merge very close endpoints. For this MVP, we just simplify.
        
        min_distance = 10
        
        for contour in contours:
            length = cv2.arcLength(contour, False)
            if length > 20: # Minimum distance/length threshold
                epsilon = epsilon_factor * length
                approx = cv2.approxPolyDP(contour, epsilon, False)
                simplified_paths.append(approx.reshape(-1, 2).tolist())
                
        return simplified_paths
