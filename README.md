TactileGen
"Make every diagram touchable."

TactileGen is an AI-powered accessibility platform that transforms educational STEM diagrams into simplified, tactile-ready representations for blind and low-vision learners.
Using computer vision, deep learning, OCR, and geometric simplification, TactileGen converts complex visual diagrams into clean vector structures that can be explored digitally or exported for tactile production.
🌐 Live Demo
Frontend:
https://tactile-gen.vercel.app
Backend API:
https://tactilegen-production.up.railway.app
Technology Stack
Frontend
Next.js 16
React 19
TypeScript
Tailwind CSS 4
Framer Motion
Web Audio API
Vibration API

Backend
Python 3.11
FastAPI
PyTorch
TorchVision
OpenCV
EasyOCR
NumPy
Pydantic V2

Deployment
Frontend: Vercel
Backend: Railway
Containerization: Docker

System Architecture
User Upload
     |
     ▼
Next.js Interactive Workspace
     |
     | REST Multipart API
     ▼
FastAPI Computer Vision Pipeline

1. Image Preprocessing
   |
2. Semantic Region Analysis
   |
3. OCR Label Extraction
   |
4. Geometry Simplification
   |
5. Tactile SVG + PNG Generation

     |
     ▼

Interactive Tactile Explorer
(Audio + Haptic Feedback)
AI Pipeline
Component	Technology	Purpose
Image Enhancement	OpenCV CLAHE + Bilateral Filtering	Improves contrast while preserving structural edges
Semantic Understanding	DeepLabV3 MobileNetV3	Detects major diagram regions
Text Extraction	EasyOCR	Separates labels from structural geometry
Edge Processing	Canny + Morphological Operations	Extracts diagram boundaries
Simplification	Ramer-Douglas-Peucker Algorithm	Removes unnecessary points and noise
Output Generation	SVG Compiler + PNG Renderer	Produces tactile-ready representations


Key Features
🧠 AI Diagram Understanding
Transforms raw educational diagrams into structured tactile representations:
Biology diagrams
Electrical circuits
Optical ray diagrams
Scientific illustrations
Pipeline stages:
Original Image
      ↓
Understanding
      ↓
Segmentation
      ↓
Simplification
      ↓
Tactile Output
✋ Interactive Tactile Canvas
The browser-based exploration system provides:
Pan and zoom navigation
Proximity-based cursor interaction
Audio feedback using Web Audio API
Haptic vibration feedback on supported devices
Vector-based tactile path rendering
Label highlighting
📤 Export Formats
Generated outputs:
SVG
Vector paths
Compatible with tactile production workflows
Suitable for embossing pipelines
PNG
High contrast representation
Optimized for low-vision accessibility
Production Deployment
Current production architecture:
                 Vercel
                   |
                   |
            Next.js Frontend
                   |
              REST API
                   |
                   ▼
              Railway
                   |
             FastAPI Backend
                   |
        Computer Vision Pipeline
The backend includes:
Lazy model loading
Memory-aware inference lifecycle
Sequential ML model management
Optimized NumPy/OpenCV memory handling
Production error handling
Local Development
Backend
cd backend

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload --port 8000
Health check:
http://localhost:8000/api/v1/health
Frontend
cd frontend

npm install

npm run dev
Open:
http://localhost:3000
Current Limitations
TactileGen generates tactile-ready digital representations but does not replace certified accessibility hardware.
Physical tactile outputs should be reviewed by accessibility specialists before classroom usage.
Browser haptic/audio feedback is a simulation of tactile exploration.
Deep learning segmentation works best when combined with strong diagram structure and clear outlines.

Future Roadmap -

*STEM-specific Vision Language Model fine tuning

*Automatic Braille label translation

*Direct tactile embosser integration

*Textbook chapter batch conversion

*Teacher accessibility dashboard 
<img width="1470" height="835" alt="image" src="https://github.com/user-attachments/assets/ca2472b2-8f36-4dd4-a21e-013010c22d81" />
<img width="1470" height="842" alt="image" src="https://github.com/user-attachments/assets/a479d761-1685-471a-aff2-ea6e374f6318" />

