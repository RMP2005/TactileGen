import cv2
import numpy as np
import base64
from app.utils.image_io import encode_image

class TactileBuilder:
    def __init__(self):
        pass
        
    def build(self, width: int, height: int, paths: list, regions: list, labels: list, stroke_width: int):
        # Create SVG
        svg_parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" style="background-color: white;">']
        
        # Add regions
        for r in regions:
            pts_str = " ".join([f"{x},{y}" for x, y in r["contour"]])
            svg_parts.append(f'<polygon points="{pts_str}" fill="none" stroke="black" stroke-width="{stroke_width}" stroke-dasharray="10,5" />')
            
        # Add paths
        for path in paths:
            if len(path) < 2: continue
            d = f"M {path[0][0]} {path[0][1]} " + " ".join([f"L {x} {y}" for x, y in path[1:]])
            svg_parts.append(f'<path d="{d}" fill="none" stroke="black" stroke-width="{stroke_width}" />')
            
        # Add labels
        for l in labels:
            x, y, w, h = l["bbox"]
            text = l["text"].replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            svg_parts.append(f'<text x="{x}" y="{y + h}" font-family="Arial" font-size="{max(16, h)}" fill="black">{text}</text>')
            
        svg_parts.append('</svg>')
        svg_str = "\n".join(svg_parts)
        
        # Create PNG
        img = np.zeros((height, width, 3), dtype=np.uint8)
        
        for r in regions:
            contour = np.array(r["contour"]).reshape((-1, 1, 2))
            cv2.polylines(img, [contour], True, (255, 255, 255), stroke_width)
            
        for path in paths:
            pts = np.array(path).reshape((-1, 1, 2))
            cv2.polylines(img, [pts], False, (255, 255, 255), stroke_width)
            
        for l in labels:
            x, y, bw, bh = l["bbox"]
            cv2.putText(img, l["text"], (x, y + bh), cv2.FONT_HERSHEY_SIMPLEX, bh/20.0, (255, 255, 255), max(1, int(stroke_width/2)))
            
        png_b64 = "data:image/png;base64," + encode_image(img)
        
        return svg_str, png_b64, {}
