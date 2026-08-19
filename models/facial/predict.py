from pathlib import Path
import json
import sys

import numpy as np
import tensorflow as tf

from tensorflow.keras.applications.mobilenet_v2 import (
    preprocess_input
)


# ============================================================
# PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

ARTIFACT_DIR = (
    PROJECT_ROOT
    / "models"
    / "facial"
    / "artifacts"
)

MODEL_PATH = (
    ARTIFACT_DIR
    / "facial_emotion_model.keras"
)

CLASS_NAMES_PATH = (
    ARTIFACT_DIR
    / "class_names.json"
)

IMAGE_SIZE = (
    224,
    224
)


# ============================================================
# LOAD MODEL
# ============================================================

def load_model_and_classes():

    if not MODEL_PATH.exists():

        raise FileNotFoundError(
            f"Model not found:\n"
            f"{MODEL_PATH}"
        )

    if not CLASS_NAMES_PATH.exists():

        raise FileNotFoundError(
            f"Class mapping not found:\n"
            f"{CLASS_NAMES_PATH}"
        )

    model = tf.keras.models.load_model(
        MODEL_PATH
    )

    with open(
        CLASS_NAMES_PATH,
        "r",
        encoding="utf-8"
    ) as file:

        class_names = json.load(
            file
        )

    return (
        model,
        class_names
    )


# ============================================================
# PREPARE IMAGE
# ============================================================

def prepare_image(
    image_path
):

    path = Path(
        image_path
    )

    if not path.exists():

        raise FileNotFoundError(
            f"Image not found:\n"
            f"{path}"
        )

    image = tf.io.read_file(
        str(path)
    )

    image = tf.image.decode_image(
        image,
        channels=3,
        expand_animations=False
    )

    image.set_shape(
        [None, None, 3]
    )

    image = tf.image.resize(
        image,
        IMAGE_SIZE
    )

    image = tf.cast(
        image,
        tf.float32
    )

    image = preprocess_input(
        image
    )

    image = tf.expand_dims(
        image,
        axis=0
    )

    return image


# ============================================================
# PREDICT
# ============================================================

def predict(
    image_path
):

    model, class_names = (
        load_model_and_classes()
    )

    image = prepare_image(
        image_path
    )

    probabilities = model.predict(
        image,
        verbose=0
    )[0]

    predicted_index = int(
        np.argmax(
            probabilities
        )
    )

    predicted_emotion = (
        class_names[
            predicted_index
        ]
    )

    confidence = float(
        probabilities[
            predicted_index
        ]
    )

    return (
        predicted_emotion,
        confidence,
        probabilities,
        class_names
    )


# ============================================================
# MAIN
# ============================================================

def main():

    if len(sys.argv) != 2:

        print(
            "Usage:"
        )

        print(
            "python models/facial/predict.py "
            "\"path/to/image.jpg\""
        )

        sys.exit(1)

    image_path = sys.argv[1]

    (
        predicted_emotion,
        confidence,
        probabilities,
        class_names
    ) = predict(
        image_path
    )

    print()
    print("=" * 60)
    print("FACIAL EMOTION PREDICTION")
    print("=" * 60)

    print()
    print(
        f"Image:\n{image_path}"
    )

    print()
    print(
        f"Predicted emotion: "
        f"{predicted_emotion}"
    )

    print(
        f"Confidence: "
        f"{confidence * 100:.2f}%"
    )

    print()
    print("Emotion probabilities:")

    for class_name, probability in zip(
        class_names,
        probabilities
    ):

        print(
            f"{class_name}: "
            f"{probability * 100:.2f}%"
        )


if __name__ == "__main__":
    main()
