from pathlib import Path
from io import BytesIO
import json

import cv2
import numpy as np
import tensorflow as tf

from fastapi import FastAPI, UploadFile, File, HTTPException
from PIL import Image, ImageOps
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


# ---------------------------------------------------------
# Project paths
# ---------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DRAWING_MODEL_PATH = (
    PROJECT_ROOT
    / "models"
    / "drawing"
    / "artifacts"
    / "drawing_emotion_model.keras"
)

DRAWING_CLASSES_PATH = (
    PROJECT_ROOT
    / "models"
    / "drawing"
    / "artifacts"
    / "class_names.json"
)

FACIAL_MODEL_PATH = (
    PROJECT_ROOT
    / "models"
    / "facial"
    / "artifacts"
    / "facial_emotion_model.keras"
)

FACIAL_CLASSES_PATH = (
    PROJECT_ROOT
    / "models"
    / "facial"
    / "artifacts"
    / "class_names.json"
)


# ---------------------------------------------------------
# FastAPI
# ---------------------------------------------------------

app = FastAPI(
    title="Multimodal Child Screening ML Service",
    version="1.0.0"
)


# ---------------------------------------------------------
# Model loading
# ---------------------------------------------------------

def load_model_bundle(model_path: Path, class_path: Path):

    if not model_path.exists():
        return None, None

    if not class_path.exists():
        return None, None

    model = tf.keras.models.load_model(
        model_path,
        compile=False
    )

    with open(class_path, "r", encoding="utf-8") as f:
        class_names = json.load(f)

    return model, class_names


drawing_model, drawing_classes = load_model_bundle(
    DRAWING_MODEL_PATH,
    DRAWING_CLASSES_PATH
)

facial_model, facial_classes = load_model_bundle(
    FACIAL_MODEL_PATH,
    FACIAL_CLASSES_PATH
)


# ---------------------------------------------------------
# OpenCV face detector
# ---------------------------------------------------------

FACE_CASCADE_PATH = (
    Path(cv2.data.haarcascades)
    / "haarcascade_frontalface_default.xml"
)

face_detector = cv2.CascadeClassifier(
    str(FACE_CASCADE_PATH)
)


# ---------------------------------------------------------
# Image utilities
# ---------------------------------------------------------

def read_image(file_bytes: bytes) -> Image.Image:

    try:
        image = Image.open(
            BytesIO(file_bytes)
        )

        image = ImageOps.exif_transpose(
            image
        )

        image = image.convert("RGB")

        return image

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image file: {exc}"
        )


def image_to_model_array(
    image: Image.Image
) -> np.ndarray:

    image = image.resize(
        (224, 224)
    )

    # Match the MobileNetV2 preprocessing used by training and predict.py.
    array = preprocess_input(
        np.asarray(image, dtype=np.float32)
    )

    array = np.expand_dims(
        array,
        axis=0
    )

    return array


def predict_with_model(
    model,
    class_names,
    image
):

    model_input = image_to_model_array(
        image
    )

    probabilities = model.predict(
        model_input,
        verbose=0
    )[0]

    predicted_index = int(
        np.argmax(probabilities)
    )

    prediction = class_names[
        predicted_index
    ]

    confidence = float(
        probabilities[predicted_index]
    )

    probability_map = {
        class_names[i]: float(
            probabilities[i]
        )
        for i in range(len(class_names))
    }

    return {
        "prediction": prediction,
        "confidence": confidence,
        "probabilities": probability_map
    }


# ---------------------------------------------------------
# Face detection
# ---------------------------------------------------------

def crop_largest_face(
    image: Image.Image
) -> Image.Image:

    rgb = np.asarray(image)

    gray = cv2.cvtColor(
        rgb,
        cv2.COLOR_RGB2GRAY
    )

    faces = face_detector.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(60, 60)
    )

    if len(faces) == 0:
        raise HTTPException(
            status_code=422,
            detail="No face detected in the uploaded image."
        )

    x, y, w, h = max(
        faces,
        key=lambda box: box[2] * box[3]
    )

    # Small padding around detected face
    padding = int(
        0.15 * max(w, h)
    )

    x1 = max(
        0,
        x - padding
    )

    y1 = max(
        0,
        y - padding
    )

    x2 = min(
        rgb.shape[1],
        x + w + padding
    )

    y2 = min(
        rgb.shape[0],
        y + h + padding
    )

    cropped = rgb[
        y1:y2,
        x1:x2
    ]

    return Image.fromarray(
        cropped
    )


# ---------------------------------------------------------
# Health check
# ---------------------------------------------------------

@app.get("/health")
def health():

    return {
        "status": "ok",
        "drawing_model_loaded":
            drawing_model is not None,
        "facial_model_loaded":
            facial_model is not None
    }


# ---------------------------------------------------------
# Drawing prediction
# ---------------------------------------------------------

@app.post("/predict/drawing")
async def predict_drawing(
    file: UploadFile = File(...)
):

    if drawing_model is None:
        raise HTTPException(
            status_code=503,
            detail="Drawing model is not available."
        )

    file_bytes = await file.read()

    image = read_image(
        file_bytes
    )

    result = predict_with_model(
        drawing_model,
        drawing_classes,
        image
    )

    result["modality"] = "drawing"
    result["model"] = (
        "drawing_emotion_model.keras"
    )

    return result


# ---------------------------------------------------------
# Facial prediction
# ---------------------------------------------------------

@app.post("/predict/facial")
async def predict_facial(
    file: UploadFile = File(...)
):

    if facial_model is None:
        raise HTTPException(
            status_code=503,
            detail="Facial model is not available."
        )

    file_bytes = await file.read()

    image = read_image(
        file_bytes
    )

    # Camera sends the full frame.
    # Extract the largest face first.
    face_image = crop_largest_face(
        image
    )

    result = predict_with_model(
        facial_model,
        facial_classes,
        face_image
    )

    result["modality"] = "facial"
    result["model"] = (
        "facial_emotion_model.keras"
    )

    return result
