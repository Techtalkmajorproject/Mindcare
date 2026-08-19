# Mindcare AI - Multimodal Child Screening System

Mindcare AI is an advanced, AI-assisted multimodal child screening and referral support platform for child psychologists and clinical professionals. The system fuses together a robust digital workspace, real-time video observation, and deep learning analytics to support early identification of child emotional and psychological statuses.

**Disclaimer:** *This system is intended strictly as an AI-assisted support tool and does not provide clinical or medical diagnoses.*

---

## 🌟 Key Features

- **Professional Dashboard & Management**: Dedicated dashboard for psychologists to manage child records and historical screenings.
- **Multimodal Screening Workspace**:
  - **Drawing Workspace**: A digital canvas for children to draw directly, complete with drawing tools, undo/redo mechanisms, and image upload capabilities.
  - **Facial Observation Camera**: Seamlessly records the child's facial expressions and reactions alongside the drawing session for parallel analysis using MediaRecorder APIs.
- **Deep Learning Analysis Pipeline**:
  - Leverages pre-trained convolutional neural networks (MobileNetV2 based architecture) using TensorFlow and Keras.
  - Predicts emotional affect (e.g., *Happiness* vs *Sadness*) based on visual characteristics observed in the children's drawings (Model fine-tuned on the KIDO dataset).
- **Secure APIs**: Express backend handling stateless operations, session mocking, and analysis orchestrations.
- **Reporting Generator**: Interactive UI to view and approve final screening confidence reports.

---

## 📁 System Architecture

The repository is modularized into three core components:

```
multimodal-child-screening/
├── frontend/        # React, Vite, TypeScript, TailwindCSS
├── backend/         # Node.js, Express.js API Gateway
├── models/          # TensorFlow Deep Learning Models
│   └── drawing/     # Drawing Emotion Classifier (MobileNetV2)
└── datasets/        # Datasets storage (e.g., KIDO Dataset for drawings)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (3.10+)
- npm or yarn

### 1. Backend Setup

The backend serves the API endpoints that power the frontend functionality.

```bash
cd backend
npm install
npm run dev
```
*The backend server will run on http://localhost:5000*

### 2. Frontend Setup

The frontend provides the clinician portal and interactive workspace.

```bash
cd frontend
npm install
npm run dev
```
*The React portal will run on the local Vite port.*

### 3. Machine Learning Setup

To re-train or evaluate the provided Drawing Emotion model, make sure you have the KIDO Dataset loaded in `datasets/drawing/Dataset/`.

```bash
# Prepare python environment
python -m pip install -r models/drawing/requirements.txt

# Run dataset preparation script to generate train/test CSV manifests
python models/drawing/prepare_dataset.py

# Train the MobileNetV2 architecture
python models/drawing/train.py

# Evaluate test accuracy and generate confusion matrices
python models/drawing/evaluate.py
```

*Trained artifacts (models, graphs) will be dumped into `models/drawing/artifacts/` and `models/drawing/results/`.*

---

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide React (Icons), React Router
- **Backend:** Node.js, Express, Cors
- **Machine Learning:** TensorFlow, Keras, scikit-learn, Pandas, NumPy, OpenCV (Pillow), Matplotlib
- **Data Collection:** WebRTC / MediaRecorder APIs

---

## 🛡 Confidentiality protocols

All data, media blobs, and camera access feeds generated in the Screening Workspace are governed by strict ethical constraints. In this specific prototype implementation, data operations reside natively across localhost in-memory allocations and mock responses to heavily limit exposure. 

---

## 📜 License

For academic and authorized professional use only.
