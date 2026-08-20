<h1 align="center">
🖐️ TactileGen
</h1>

<h3 align="center">
Make every diagram touchable.
</h3>

<p align="center">
An AI accessibility platform that transforms educational diagrams into simplified, high-contrast, tactile-ready representations with multi-sensory digital exploration for blind and low-vision learners.
</p>

<br/>

![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/Frontend-TypeScript-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Frontend-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Backend-Python%203.11-3776AB?style=for-the-badge&logo=python)
![PyTorch](https://img.shields.io/badge/AI-PyTorch-EE4C2C?style=for-the-badge&logo=pytorch)
![OpenCV](https://img.shields.io/badge/AI-OpenCV-5C3EE8?style=for-the-badge&logo=opencv)
![Computer Vision](https://img.shields.io/badge/AI-Computer%20Vision-yellow?style=for-the-badge)
![Deep Learning](https://img.shields.io/badge/AI-Deep%20Learning-yellow?style=for-the-badge)
![OCR](https://img.shields.io/badge/AI-OCR-yellow?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge)
![Railway](https://img.shields.io/badge/Deploy-Railway-0B0D2E?style=for-the-badge)
![Docker](https://img.shields.io/badge/Deploy-Docker-2496ED?style=for-the-badge&logo=docker)

---

# 🚀 Live Demo

Frontend:

🔗 https://tactile-gen.vercel.app

Backend API:

🔗 https://tactilegen-production.up.railway.app

---

# 🌟 Overview

Educational STEM diagrams—such as cell structures, optical ray diagrams, and circuit schematics—are visual by design. For over 2.2 billion people worldwide with visual impairments, textbook diagrams remain one of the steepest barriers to STEM education.

Standard image filters produce noisy, jagged, unreadable lines when converted to tactile formats. Physical tactile embossing requires clear separation between lines, uncluttered regions, legible labels, and high contrast.

**TactileGen bridges this gap** by combining learned semantic segmentation, OCR text isolation, and geometric line skeletonization to produce clean, embossable vector outputs and an interactive browser-based tactile preview.

---

# 🏗️ System Architecture

```
                              TactileGen Architecture

  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                           NEXT.JS FRONTEND                                  │
  │                                                                             │
  │   Landing Page (Cinematic) ──► Workspace (3-Column Layout)                  │
  │                                   │                                         │
  │   ┌───────────────────────────────┴───────────────────────────────┐         │
  │   ▼                               ▼                               ▼         │
  │  Upload & Preset Selector     Before/After Slider      Tactile Canvas      │
  │  (Drag-and-Drop / Samples)    (Interactive Split)      (Interactive Engine)│
  │                                                                   │         │
  │                                                           ┌───────┴───────┐ │
  │                                                           ▼               ▼ │
  │                                                     Web Audio API    Vibrate│
  │                                                     (Sonification)     API  │
  └──────────────────────────────────────────────────────────────────────────────┘
                                          │ Multipart Form / REST
                                          ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                            FASTAPI ML BACKEND                               │
  │                                                                             │
  │  1. Preprocessing (Grayscale, CLAHE Contrast Normalization, Bilateral Filter)│
  │  2. Semantic Segmentation (PyTorch DeepLabV3 MobileNetV3 + Contour Analysis)│
  │  3. Text Isolation & Extraction (EasyOCR Deep Character Recognition)        │
  │  4. Geometry Simplification (Morphological Skeletonization + RDP Reduction) │
  │  5. Output Synthesis (Tactile SVG Compiler + High-Contrast Base64 PNG)      │
  └─────────────────────────────────────────────────────────────────────────────┘
```

---

# 🧠 AI & Computer Vision Pipeline

We believe in **technical honesty**. TactileGen explicitly distinguishes between learned machine learning, classical computer vision, and browser simulation:

| Component | Method / Technology | Role in Pipeline | Classification |
| :--- | :--- | :--- | :--- |
| **Preprocessing** | OpenCV CLAHE + Bilateral Filtering | Normalizes contrast and suppresses background paper texture without blurring structural lines. | Classical Computer Vision |
| **Semantic Segmentation** | PyTorch `deeplabv3_mobilenet_v3_large` | Isolates major semantic regions. When diagram fills are sparse, triggers topological contour extraction. | Learned Deep Learning |
| **Label Extraction** | EasyOCR (Deep CRAFT text detector) | Detects and transcribes diagram annotations, extracting $(x, y, w, h)$ bounding boxes to prevent text from cluttering structural vector lines. | Learned Deep Learning |
| **Skeletonization** | Morphological thinning (Zhang-Suen) | Reduces thick or fuzzy strokes into single-pixel centerlines. | Classical Computer Vision |
| **Line Simplification** | Ramer-Douglas-Peucker (RDP) | Approximates polylines within a tactile tolerance $\epsilon$, eliminating jitter and merging micro-segments. | Geometric Algorithm |
| **Tactile Exploration** | Web Audio API + Haptics | Simulates tactile exploration in the browser using dynamic pitch modulation ($220\text{ Hz} \to 880\text{ Hz}$) and proximity contraction. | Browser Simulation |

---

# 🧩 Features

### 🌟 Signature Transformation

When a diagram is uploaded, TactileGen executes an animated multi-stage transformation:

1. **Raw Input**: Ingests original textbook diagram.
2. **Understand**: Deep learning analysis of structural regions.
3. **Segment**: Region masking separates shapes from text.
4. **Simplify**: Clutter and noise are stripped away; geometry is simplified.
5. **Tactile**: High-contrast raised lines and dashed semantic boundaries assemble in real-time.

### 🔊 Interactive Tactile Preview Canvas

- **Proximity Cursor**: A dynamic concentric ring that contracts around the cursor as you approach vector lines.
- **Audio Sonification**: Web Audio oscillator modulates frequency and volume in real-time based on proximity to the nearest tactile line (starts strictly on user click/interaction).
- **Tactile Elevation**: SVG vector paths render with simulated 3D drop-shadow relief.
- **Label Synchronization**: Hovering over detected labels highlights their positions on the tactile canvas.
- **Pan & Zoom**: Smooth matrix zoom ($10\% \to 500\%$) and drag-pan for detailed exploration.

### 📥 Multi-Format Export

- **Tactile Vector SVG**: Clean `<path>` elements formatted for swell paper printers and physical embosser software.
- **High-Contrast PNG**: Crisp white lines on deep black background for low-vision learners.

---

# 🔧 Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 16 | React Framework |
| React 19 | UI Components |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Web Audio API | Audio Sonification |

### Backend

| Technology | Purpose |
|---|---|
| FastAPI | REST API |
| Python 3.11 | Backend Logic |
| PyTorch | Deep Learning |
| OpenCV | Image Processing |
| EasyOCR | Text Recognition |
| NumPy | Numerical Computing |

### AI & Computer Vision

| Technology | Purpose |
|---|---|
| DeepLabV3 MobileNetV3 | Semantic Segmentation |
| EasyOCR CRAFT | Text Detection & Recognition |
| Zhang-Suen | Morphological Skeletonization |
| Ramer-Douglas-Peucker | Line Simplification |

### Deployment

| Platform | Usage |
|---|---|
| Vercel | Frontend Hosting |
| Railway | Backend Hosting |
| Docker | Containerization |

---

# ⚡ Production Architecture

```
Browser ──► Vercel (Next.js Frontend) ──► Railway (FastAPI Backend) ──► CV Pipeline
                                                                    │
                                                          ┌────────┴────────┐
                                                          │  DeepLabV3      │
                                                          │  EasyOCR        │
                                                          │  OpenCV         │
                                                          │  SVG Compiler   │
                                                          └─────────────────┘
```

---

# 📂 Project Structure

```
TactileGen
│
├── frontend
│   ├── src
│   ├── app
│   ├── components
│   └── package.json
│
├── backend
│   ├── app
│   ├── models
│   ├── routes
│   ├── requirements.txt
│   └── Dockerfile
│
├── screenshots
│
└── README.md
```

---

# 🛠️ Local Development

### Prerequisites

- Node.js 18+ & npm
- Python 3.10+

---

## Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend runs on:

```
http://localhost:8000
```

Health check: `http://localhost:8000/api/v1/health`

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

# 📡 API Reference

### `POST /api/v1/process`

Upload an educational diagram image and receive structured tactile representations.

**Content-Type**: `multipart/form-data`

**Form Fields**:

| Field | Type | Description | Default |
|---|---|---|---|
| `file` | File | Image file (`.png`, `.jpg`, `.jpeg`, `.webp`, max 10MB) | Required |
| `simplification_level` | Float | Line simplification tolerance (`0.1` - `1.0`) | `0.5` |
| `min_stroke_width` | Integer | Minimum stroke width for tactile output (`2` - `12`) | `4` |

**Response**:

```json
{
  "job_id": "tg_98f4a12b",
  "status": "success",
  "processing_time_ms": 1120,
  "metadata": {
    "original_width": 800,
    "original_height": 600,
    "total_regions_detected": 4,
    "total_lines_simplified": 52,
    "labels_count": 3
  },
  "tactile_svg": "<svg ...>...</svg>",
  "processed_image_base64": "data:image/png;base64,...",
  "semantic_regions": [
    {
      "id": "region_1",
      "label": "Structure 1",
      "category": "semantic",
      "confidence": 0.88,
      "bounds": {"x": 150, "y": 150, "width": 500, "height": 300},
      "polygon_points": [[150, 150], [650, 150]]
    }
  ],
  "extracted_labels": [
    {
      "id": "label_1",
      "text": "Cell Membrane",
      "x": 60,
      "y": 90,
      "width": 180,
      "height": 24,
      "confidence": 0.96
    }
  ],
  "tactile_paths": [
    {
      "id": "path_1",
      "path_d": "M 150 150 L 650 150",
      "stroke_width": 4,
      "layer_type": "primary_outline"
    }
  ]
}
```

---

# 📊 Evaluation

We evaluated TactileGen across representative educational diagrams:

| Test Diagram | Regions Detected | Lines Simplified | Labels Detected | Inference Latency (Warm) |
| :--- | :--- | :--- | :--- | :--- |
| **Biology Cell Structure** | 2 semantic regions | 74 simplified paths | 3 labels (Membrane, Nucleus, Mitochondria) | ~1.2s |
| **Electrical Circuit Schematic** | 6 circuit regions | 61 simplified paths | 3 labels (Battery 12V, Resistor R1, Capacitor C1) | ~1.1s |
| **Optics Ray Diagram** | 3 focal/ray regions | 51 simplified paths | 3 labels (2F, F1, Convex Lens) | ~1.0s |

### DeepLabV3 Findings

Pretrained Pascal/COCO segmentation models detect natural object silhouettes (people, cars, animals). For line diagrams without natural texture fills, DeepLabV3 detects primary enclosed bodies. TactileGen gracefully couples this with morphological edge detection and contour approximation, ensuring clean vector extraction across both filled and schematic diagram types.

---

# ♿ Accessibility Note

TactileGen creates **tactile-ready digital representations** intended for educational and assistive workflows.

- Output graphics should be reviewed by a certified TVI (Teacher of the Visually Impaired) before physical production on swell paper or embosser hardware.
- The web browser interface simulates tactile feedback using Web Audio sonification and CSS relief effects; it does not replace physical refreshable tactile displays.
- Does not claim medical or formal accessibility certification.

---

# 🗺️ Roadmap

- [ ] Fine-tuned Vision-Language segmentation model (SAM-HQ) trained on STEM diagrams.
- [ ] Direct Grade 1 & Grade 2 Unified English Braille (UEB) label translation.
- [ ] Direct driver integration for ViewPlus and Index Braille embossers.
- [ ] Batch textbook chapter conversion dashboard.

---

# 🤝 Contributing

Contributions are welcome.

```bash
git checkout -b feature-name
git add .
git commit -m "Added feature"
git push origin feature-name
```

Create a Pull Request 🚀

---

# 📄 License

This project is licensed under the MIT License.

---

# Built With ❤️

Built by developers who believe accessibility should be intelligent, automated, and accessible.
