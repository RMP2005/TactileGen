# TactileGen

> **"Make every diagram touchable."**

TactileGen is an AI-powered accessibility platform that transforms educational STEM diagrams into simplified, tactile-ready representations for blind and low-vision learners.

Using computer vision, deep learning, OCR, and geometric simplification, TactileGen converts complex visual diagrams into clean vector structures that can be explored digitally or exported for tactile production.

---

## 🌐 Live Demo

**Frontend:**  
https://tactile-gen.vercel.app

**Backend API:**  
https://tactilegen-production.up.railway.app

---

# 🏗️ Technology Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide Icons
- Web Audio API
- Vibration API

## Backend

- Python 3.11
- FastAPI
- PyTorch
- TorchVision
- OpenCV
- EasyOCR
- NumPy
- Pydantic V2

## Deployment

- Frontend → Vercel
- Backend → Railway
- Containerization → Docker

---

# 🧠 System Architecture

User Upload
  |
  ▼
Next.js Interactive Workspace
  |
  | REST Multipart API
  ▼
FastAPI Computer Vision Pipeline
  |
  ├── Image Preprocessing
  |
  ├── Semantic Segmentation
  |
  ├── OCR Label Extraction
  |
  ├── Geometry Simplification
  |
  └── Tactile Output Generation

  |
  ▼
Interactive Tactile Explorer
(Audio + Haptic Feedback)

---

# 🤖 AI & Computer Vision Pipeline

| Component | Technology | Purpose |
|---|---|---|
| Image Enhancement | OpenCV CLAHE + Bilateral Filtering | Improves contrast while preserving edges |
| Semantic Understanding | DeepLabV3 MobileNetV3 | Detects major diagram regions |
| Label Extraction | EasyOCR | Extracts diagram annotations |
| Edge Processing | Canny + Morphological Operations | Extracts structural boundaries |
| Simplification | Ramer-Douglas-Peucker Algorithm | Removes noise and unnecessary points |
| Output Generation | SVG Compiler + PNG Renderer | Produces tactile-ready outputs |

---

# ✨ Key Features

## 🧩 AI Diagram Understanding

Transforms raw educational diagrams into structured tactile representations:

- Biology diagrams
- Electrical circuits
- Optical ray diagrams
- Scientific illustrations

Pipeline:

Original Image
        ↓
Understanding
        ↓
Segmentation
        ↓
Simplification
        ↓
Tactile Output

---

## ✋ Interactive Tactile Canvas

Features:

- Interactive pan and zoom
- Proximity-based cursor exploration
- Audio feedback using Web Audio API
- Haptic feedback using Vibration API
- Vector-based tactile rendering
- Label highlighting
- Simulated tactile elevation

---

## 📤 Export Formats

### SVG Export

- Clean vector paths
- Compatible with tactile production workflows
- Suitable for embossing pipelines

### PNG Export

- High contrast representation
- Optimized for low-vision accessibility

---

# 🚀 Production Architecture

          Vercel

            |
            |

    Next.js Frontend

            |
         REST API

            |

          Railway

            |

    FastAPI Backend

            |

 Computer Vision Pipeline

---

# ⚙️ Local Development

## Backend Setup

```bash
cd backend

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload --port 8000
Health check:
http://localhost:8000/api/v1/health
Frontend Setup
cd frontend

npm install

npm run dev
Open:
http://localhost:3000
📡 API
POST /api/v1/process
Upload a diagram and receive tactile-ready representations.
Input
Image file
Simplification level
Stroke width
Output
Returns:
Generated tactile SVG
High contrast PNG
Semantic regions
Extracted labels
Simplified vector paths
🧪 Evaluation
Tested on representative STEM diagrams:
Diagram	Output
Biology Cell Structure	Region detection + label extraction + tactile paths
Electrical Circuit	Component separation + vector simplification
Optics Ray Diagram	Ray and geometry extraction


♿ Accessibility Note
TactileGen creates digital tactile-ready representations intended for educational and assistive workflows.
Limitations:
Physical tactile outputs should be reviewed before classroom usage.
Browser audio/haptic feedback is a simulation.
The system does not replace dedicated tactile hardware.
🔮 Future Roadmap

STEM-specific Vision Language Model

*Automatic Braille label translation

*Direct embosser integration

*Textbook chapter conversion dashboard

*Teacher accessibility platform

*Teacher accessibility dashboard 

<img width="1470" height="835" alt="image" src="https://github.com/user-attachments/assets/ca2472b2-8f36-4dd4-a21e-013010c22d81" />
<img width="1470" height="842" alt="image" src="https://github.com/user-attachments/assets/a479d761-1685-471a-aff2-ea6e374f6318" />

