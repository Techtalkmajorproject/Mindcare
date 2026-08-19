from pathlib import Path
import json

import numpy as np
import pandas as pd
import tensorflow as tf

import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)

from tensorflow.keras.applications.mobilenet_v2 import (
    preprocess_input
)


# ============================================================
# PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATA_DIR = (
    PROJECT_ROOT
    / "models"
    / "facial"
    / "data"
)

ARTIFACT_DIR = (
    PROJECT_ROOT
    / "models"
    / "facial"
    / "artifacts"
)

RESULT_DIR = (
    PROJECT_ROOT
    / "models"
    / "facial"
    / "results"
)

TEST_MANIFEST = (
    DATA_DIR
    / "test.csv"
)

MODEL_PATH = (
    ARTIFACT_DIR
    / "facial_emotion_model.keras"
)

CLASS_NAMES_PATH = (
    ARTIFACT_DIR
    / "class_names.json"
)

REPORT_PATH = (
    RESULT_DIR
    / "classification_report.txt"
)

CONFUSION_PATH = (
    RESULT_DIR
    / "confusion_matrix.png"
)

METRICS_PATH = (
    RESULT_DIR
    / "per_class_metrics.png"
)

IMAGE_SIZE = (
    224,
    224
)


# ============================================================
# IMAGE LOADING
# ============================================================

def load_image(
    image_path
):

    image = tf.io.read_file(
        image_path
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

    return image


# ============================================================
# MAIN
# ============================================================

def main():

    print()
    print("=" * 60)
    print("FER2013 FACIAL EMOTION MODEL EVALUATION")
    print("=" * 60)

    if not TEST_MANIFEST.exists():

        raise FileNotFoundError(
            f"Test manifest not found:\n"
            f"{TEST_MANIFEST}"
        )

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

    test_df = pd.read_csv(
        TEST_MANIFEST
    )

    with open(
        CLASS_NAMES_PATH,
        "r",
        encoding="utf-8"
    ) as file:

        class_names = json.load(
            file
        )

    label_to_index = {
        label: index
        for index, label
        in enumerate(class_names)
    }

    model = tf.keras.models.load_model(
        MODEL_PATH
    )

    y_true = []
    y_pred = []

    print(
        f"\nEvaluating "
        f"{len(test_df)} test images..."
    )

    for _, row in test_df.iterrows():

        image_path = row[
            "image_path"
        ]

        true_label = row[
            "label"
        ]

        image = load_image(
            image_path
        )

        image = tf.expand_dims(
            image,
            axis=0
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

        y_true.append(
            label_to_index[
                true_label
            ]
        )

        y_pred.append(
            predicted_index
        )

    # ========================================================
    # METRICS
    # ========================================================

    accuracy = accuracy_score(
        y_true,
        y_pred
    )

    macro_precision = precision_score(
        y_true,
        y_pred,
        average="macro",
        zero_division=0
    )

    macro_recall = recall_score(
        y_true,
        y_pred,
        average="macro",
        zero_division=0
    )

    macro_f1 = f1_score(
        y_true,
        y_pred,
        average="macro",
        zero_division=0
    )

    weighted_precision = precision_score(
        y_true,
        y_pred,
        average="weighted",
        zero_division=0
    )

    weighted_recall = recall_score(
        y_true,
        y_pred,
        average="weighted",
        zero_division=0
    )

    weighted_f1 = f1_score(
        y_true,
        y_pred,
        average="weighted",
        zero_division=0
    )

    report = classification_report(
        y_true,
        y_pred,
        target_names=class_names,
        zero_division=0
    )

    matrix = confusion_matrix(
        y_true,
        y_pred
    )

    # ========================================================
    # PRINT
    # ========================================================

    print()
    print("=" * 60)
    print("FINAL TEST RESULTS")
    print("=" * 60)

    print(
        f"\nAccuracy: "
        f"{accuracy * 100:.2f}%"
    )

    print(
        f"Macro Precision: "
        f"{macro_precision * 100:.2f}%"
    )

    print(
        f"Macro Recall: "
        f"{macro_recall * 100:.2f}%"
    )

    print(
        f"Macro F1: "
        f"{macro_f1 * 100:.2f}%"
    )

    print(
        f"Weighted Precision: "
        f"{weighted_precision * 100:.2f}%"
    )

    print(
        f"Weighted Recall: "
        f"{weighted_recall * 100:.2f}%"
    )

    print(
        f"Weighted F1: "
        f"{weighted_f1 * 100:.2f}%"
    )

    print()
    print("CLASSIFICATION REPORT")
    print()
    print(report)

    # ========================================================
    # SAVE REPORT
    # ========================================================

    with open(
        REPORT_PATH,
        "w",
        encoding="utf-8"
    ) as file:

        file.write(
            "FER2013 FACIAL EMOTION MODEL\n"
        )

        file.write(
            "FINAL TEST EVALUATION\n\n"
        )

        file.write(
            f"Accuracy: "
            f"{accuracy * 100:.2f}%\n"
        )

        file.write(
            f"Macro Precision: "
            f"{macro_precision * 100:.2f}%\n"
        )

        file.write(
            f"Macro Recall: "
            f"{macro_recall * 100:.2f}%\n"
        )

        file.write(
            f"Macro F1: "
            f"{macro_f1 * 100:.2f}%\n"
        )

        file.write(
            f"Weighted Precision: "
            f"{weighted_precision * 100:.2f}%\n"
        )

        file.write(
            f"Weighted Recall: "
            f"{weighted_recall * 100:.2f}%\n"
        )

        file.write(
            f"Weighted F1: "
            f"{weighted_f1 * 100:.2f}%\n\n"
        )

        file.write(
            "Classification Report:\n\n"
        )

        file.write(
            report
        )

    # ========================================================
    # CONFUSION MATRIX
    # ========================================================

    plt.figure(
        figsize=(9, 8)
    )

    sns.heatmap(
        matrix,
        annot=True,
        fmt="d",
        xticklabels=class_names,
        yticklabels=class_names,
        cmap="Blues"
    )

    plt.xlabel(
        "Predicted Emotion"
    )

    plt.ylabel(
        "Actual Emotion"
    )

    plt.title(
        "FER2013 Facial Emotion Confusion Matrix"
    )

    plt.tight_layout()

    plt.savefig(
        CONFUSION_PATH,
        dpi=150
    )

    plt.close()

    # ========================================================
    # PER CLASS F1
    # ========================================================

    from sklearn.metrics import precision_recall_fscore_support

    precision_values, recall_values, f1_values, _ = (
        precision_recall_fscore_support(
            y_true,
            y_pred,
            labels=list(
                range(
                    len(class_names)
                )
            ),
            zero_division=0
        )
    )

    plt.figure(
        figsize=(10, 6)
    )

    plt.bar(
        class_names,
        f1_values
    )

    plt.xlabel(
        "Emotion"
    )

    plt.ylabel(
        "F1 Score"
    )

    plt.title(
        "FER2013 Per-Class F1 Score"
    )

    plt.ylim(
        0,
        1
    )

    plt.xticks(
        rotation=30
    )

    plt.tight_layout()

    plt.savefig(
        METRICS_PATH,
        dpi=150
    )

    plt.close()

    print()
    print(
        f"Classification report saved:\n"
        f"{REPORT_PATH}"
    )

    print()
    print(
        f"Confusion matrix saved:\n"
        f"{CONFUSION_PATH}"
    )

    print()
    print(
        f"Per-class metrics saved:\n"
        f"{METRICS_PATH}"
    )


if __name__ == "__main__":
    main()
