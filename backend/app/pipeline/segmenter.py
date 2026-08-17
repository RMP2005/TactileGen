from abc import ABC, abstractmethod
import cv2
import numpy as np
import torch
from torchvision import models, transforms
from app.config import settings

class BaseSegmenter(ABC):
    @abstractmethod
    def segment(self, img_bgr: np.ndarray) -> list:
        pass

class Segmenter(BaseSegmenter):
    def __init__(self):
        self.device = torch.device(settings.MODEL_DEVICE)
        self.model = None
        self.transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize(520),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        
    def _load_model(self):
        if self.model is None:
            # Lazy load the model
            weights = models.segmentation.DeepLabV3_MobileNet_V3_Large_Weights.DEFAULT
            self.model = models.segmentation.deeplabv3_mobilenet_v3_large(weights=weights)
            self.model.to(self.device)
            self.model.eval()
            
    def segment(self, img_bgr: np.ndarray) -> list:
        self._load_model()
        
        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        input_tensor = self.transform(img_rgb).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            output = self.model(input_tensor)['out'][0]
        
        output_predictions = output.argmax(0).byte().cpu().numpy()
        h, w = img_bgr.shape[:2]
        mask = cv2.resize(output_predictions, (w, h), interpolation=cv2.INTER_NEAREST)
        
        regions = []
        unique_classes = np.unique(mask)
        for cls in unique_classes:
            if cls == 0: continue # background
            
            cls_mask = (mask == cls).astype(np.uint8) * 255
            contours, _ = cv2.findContours(cls_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            for contour in contours:
                area = cv2.contourArea(contour)
                if area > 100: # min area threshold
                    x, y, bw, bh = cv2.boundingRect(contour)
                    regions.append({
                        "class_id": int(cls),
                        "bbox": [int(x), int(y), int(bw), int(bh)],
                        "contour": contour.reshape(-1, 2).tolist()
                    })
                    
        # Fallback to Canny edge detection for structural lines if semantic segmentation found few regions
        # This addresses educational diagrams which often lack semantic fills but have strong lines
        if len(regions) < 3:
            gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
            edges = cv2.Canny(gray, 50, 150)
            
            # Dilate to connect edges
            kernel = np.ones((3,3), np.uint8)
            edges_dilated = cv2.dilate(edges, kernel, iterations=1)
            
            canny_contours, _ = cv2.findContours(edges_dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            for contour in canny_contours:
                area = cv2.contourArea(contour)
                if area > 500: # slightly larger threshold for Canny regions to avoid noise
                    x, y, bw, bh = cv2.boundingRect(contour)
                    
                    # Avoid adding regions that completely overlap with existing semantic regions
                    is_new = True
                    for r in regions:
                        rx, ry, rbw, rbh = r["bbox"]
                        # rough intersection check
                        if (x >= rx and y >= ry and x+bw <= rx+rbw and y+bh <= ry+rbh):
                            is_new = False
                            break
                    
                    if is_new:
                        regions.append({
                            "class_id": 255, # 255 for structural lines fallback
                            "bbox": [int(x), int(y), int(bw), int(bh)],
                            "contour": contour.reshape(-1, 2).tolist()
                        })
                    
        return regions
