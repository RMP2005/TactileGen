import io
import cv2
import numpy as np
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def create_cell_diagram():
    # 800x600 biology diagram
    img = np.full((600, 800, 3), 255, dtype=np.uint8)
    
    # Outer cell membrane
    cv2.ellipse(img, (400, 300), (320, 220), 10, 0, 360, (40, 40, 40), 4)
    
    # Inner nucleus
    cv2.circle(img, (380, 280), 90, (30, 30, 30), 4)
    cv2.circle(img, (360, 270), 30, (80, 80, 80), -1)
    
    # Mitochondria (organelles)
    cv2.ellipse(img, (200, 200), (45, 25), 35, 0, 360, (50, 50, 50), 3)
    cv2.ellipse(img, (580, 380), (50, 30), -20, 0, 360, (50, 50, 50), 3)
    
    # Labels
    cv2.putText(img, "Cell Membrane", (60, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)
    cv2.line(img, (180, 100), (280, 170), (0, 0, 0), 2)
    
    cv2.putText(img, "Nucleus", (450, 160), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)
    cv2.line(img, (450, 170), (400, 240), (0, 0, 0), 2)
    
    cv2.putText(img, "Mitochondria", (540, 480), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)
    cv2.line(img, (600, 450), (590, 410), (0, 0, 0), 2)
    
    _, buf = cv2.imencode('.png', img)
    return buf.tobytes()

def create_circuit_diagram():
    # 800x600 circuit diagram
    img = np.full((600, 800, 3), 255, dtype=np.uint8)
    
    # Circuit loop rectangle
    cv2.rectangle(img, (150, 150), (650, 450), (30, 30, 30), 3)
    
    # Battery symbol on left branch
    cv2.rectangle(img, (140, 270), (160, 330), (255, 255, 255), -1)
    cv2.line(img, (120, 280), (180, 280), (0, 0, 0), 4)
    cv2.line(img, (135, 310), (165, 310), (0, 0, 0), 6)
    
    # Resistor on top branch (zigzag)
    cv2.rectangle(img, (340, 140), (460, 160), (255, 255, 255), -1)
    resistor_pts = np.array([[340, 150], [355, 130], [375, 170], [395, 130], [415, 170], [435, 130], [445, 170], [460, 150]])
    cv2.polylines(img, [resistor_pts], False, (0, 0, 0), 3)
    
    # Capacitor on right branch
    cv2.rectangle(img, (640, 270), (660, 330), (255, 255, 255), -1)
    cv2.line(img, (625, 285), (675, 285), (0, 0, 0), 4)
    cv2.line(img, (625, 315), (675, 315), (0, 0, 0), 4)
    
    # Labels
    cv2.putText(img, "Battery 12V", (30, 300), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
    cv2.putText(img, "Resistor R1", (350, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
    cv2.putText(img, "Capacitor C1", (670, 300), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
    
    _, buf = cv2.imencode('.png', img)
    return buf.tobytes()

def create_optics_diagram():
    # 800x600 optics diagram
    img = np.full((600, 800, 3), 255, dtype=np.uint8)
    
    # Principal axis
    cv2.line(img, (50, 300), (750, 300), (100, 100, 100), 2)
    
    # Convex lens (vertical ellipse)
    cv2.ellipse(img, (400, 300), (25, 180), 0, 0, 360, (0, 0, 0), 3)
    
    # Object arrow
    cv2.arrowedLine(img, (200, 300), (200, 180), (0, 0, 0), 4, tipLength=0.15)
    
    # Rays
    cv2.line(img, (200, 180), (400, 180), (0, 0, 200), 2)
    cv2.line(img, (400, 180), (600, 420), (0, 0, 200), 2)
    cv2.line(img, (200, 180), (600, 420), (0, 150, 0), 2)
    
    # Inverted image arrow
    cv2.arrowedLine(img, (600, 300), (600, 420), (0, 0, 0), 4, tipLength=0.15)
    
    # Labels
    cv2.putText(img, "2F", (190, 330), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
    cv2.putText(img, "F1", (290, 330), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
    cv2.putText(img, "O", (395, 330), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
    cv2.putText(img, "F2", (490, 330), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
    cv2.putText(img, "2F2", (585, 330), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
    cv2.putText(img, "Convex Lens", (340, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)
    
    _, buf = cv2.imencode('.png', img)
    return buf.tobytes()

def test_process_cell_diagram():
    png_bytes = create_cell_diagram()
    response = client.post(
        "/api/v1/process",
        files={"file": ("cell.png", io.BytesIO(png_bytes), "image/png")},
        data={"simplification_level": "0.5", "min_stroke_width": "4"}
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["status"] == "success"
    assert data["metadata"]["total_lines_simplified"] > 0
    assert len(data["tactile_svg"]) > 100
    assert "<svg" in data["tactile_svg"]
    print(f"Cell Diagram: {data['metadata']['total_regions_detected']} regions, {data['metadata']['total_lines_simplified']} paths, {data['metadata']['labels_count']} labels in {data['processing_time_ms']}ms")

def test_process_circuit_diagram():
    png_bytes = create_circuit_diagram()
    response = client.post(
        "/api/v1/process",
        files={"file": ("circuit.png", io.BytesIO(png_bytes), "image/png")},
        data={"simplification_level": "0.5", "min_stroke_width": "4"}
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["status"] == "success"
    assert data["metadata"]["total_lines_simplified"] > 0
    print(f"Circuit Diagram: {data['metadata']['total_regions_detected']} regions, {data['metadata']['total_lines_simplified']} paths, {data['metadata']['labels_count']} labels in {data['processing_time_ms']}ms")

def test_process_optics_diagram():
    png_bytes = create_optics_diagram()
    response = client.post(
        "/api/v1/process",
        files={"file": ("optics.png", io.BytesIO(png_bytes), "image/png")},
        data={"simplification_level": "0.5", "min_stroke_width": "4"}
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["status"] == "success"
    assert data["metadata"]["total_lines_simplified"] > 0
    print(f"Optics Diagram: {data['metadata']['total_regions_detected']} regions, {data['metadata']['total_lines_simplified']} paths, {data['metadata']['labels_count']} labels in {data['processing_time_ms']}ms")
