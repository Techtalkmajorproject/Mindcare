from pathlib import Path
import json
import random

import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.utils.class_weight import (
    compute_class_weight
)

from tensorflow.keras import (
    layers,
    models,
    callbacks
)

from tensorflow.keras.applications import (
    MobileNetV2
)

from tensorflow.keras.applications.mobilenet_v2 import (
    preprocess_input
)

import matplotlib.pyplot as plt


# ============================================================
# REPRODUCIBILITY
# ============================================================

SEED = 42

random.seed(SEED)
np.random.seed(SEED)
tf.random.set_seed(SEED)


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

ARTIFACT_DIR.mkdir(
    parents=True,
    exist_ok=True
)

RESULT_DIR.mkdir(
    parents=True,
    exist_ok=True
)

TRAIN_MANIFEST = (
    DATA_DIR
    / "train.csv"
)

VALIDATION_MANIFEST = (
    DATA_DIR
    / "validation.csv"
)

MODEL_PATH = (
    ARTIFACT_DIR
    / "facial_emotion_model.keras"
)

CLASS_NAMES_PATH = (
    ARTIFACT_DIR
    / "class_names.json"
)


# ============================================================
# CONFIGURATION
# ============================================================

IMAGE_SIZE = (
    224,
    224
)

BATCH_SIZE = 32

HEAD_EPOCHS = 12

FINE_TUNE_EPOCHS = 10

HEAD_LEARNING_RATE = 1e-4

FINE_TUNE_LEARNING_RATE = 1e-5


CLASS_NAMES = [
    "angry",
    "disgust",
    "fear",
    "happy",
    "neutral",
    "sad",
    "surprise"
]


# ============================================================
# LOAD MANIFEST
# ============================================================

def load_manifest(
    path
):

    if not path.exists():

        raise FileNotFoundError(
            f"Manifest not found:\n{path}\n\n"
            f"Run prepare_dataset.py first."
        )

    df = pd.read_csv(
        path
    )

    required = {
        "image_path",
        "label"
    }

    missing = (
        required
        - set(df.columns)
    )

    if missing:

        raise ValueError(
            f"Missing columns: {missing}"
        )

    return df


# ============================================================
# IMAGE LOADING
# ============================================================

def load_image(
    image_path,
    label
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

    return (
        image,
        label
    )


# ============================================================
# DATASET
# ============================================================

def create_dataset(
    df,
    label_to_index,
    training=False
):

    paths = df[
        "image_path"
    ].astype(str).values

    labels = np.array(
        [
            label_to_index[label]
            for label
            in df["label"]
        ],
        dtype=np.int32
    )

    dataset = tf.data.Dataset.from_tensor_slices(
        (
            paths,
            labels
        )
    )

    if training:

        dataset = dataset.shuffle(
            buffer_size=len(df),
            seed=SEED,
            reshuffle_each_iteration=True
        )

    dataset = dataset.map(
        load_image,
        num_parallel_calls=tf.data.AUTOTUNE
    )

    dataset = dataset.batch(
        BATCH_SIZE
    )

    dataset = dataset.prefetch(
        tf.data.AUTOTUNE
    )

    return dataset


# ============================================================
# DATA AUGMENTATION
# ============================================================

augmentation = tf.keras.Sequential(
    [
        layers.RandomFlip(
            "horizontal"
        ),

        layers.RandomRotation(
            0.08
        ),

        layers.RandomZoom(
            0.10
        ),

        layers.RandomTranslation(
            0.05,
            0.05
        ),

        layers.RandomContrast(
            0.10
        )
    ],
    name="facial_augmentation"
)


# ============================================================
# MODEL
# ============================================================

def build_model():

    base_model = MobileNetV2(
        include_top=False,
        weights="imagenet",
        input_shape=(
            224,
            224,
            3
        )
    )

    base_model.trainable = False

    inputs = layers.Input(
        shape=(
            224,
            224,
            3
        )
    )

    x = augmentation(
        inputs
    )

    x = base_model(
        x,
        training=False
    )

    x = layers.GlobalAveragePooling2D()(
        x
    )

    x = layers.Dense(
        256,
        activation="relu"
    )(x)

    x = layers.Dropout(
        0.5
    )(x)

    outputs = layers.Dense(
        len(CLASS_NAMES),
        activation="softmax"
    )(x)

    model = models.Model(
        inputs,
        outputs
    )

    model.compile(
        optimizer=tf.keras.optimizers.Adam(
            learning_rate=HEAD_LEARNING_RATE
        ),
        loss=(
            "sparse_categorical_crossentropy"
        ),
        metrics=[
            "accuracy"
        ]
    )

    return model, base_model


# ============================================================
# CLASS WEIGHTS
# ============================================================

def calculate_class_weights(
    train_df,
    label_to_index
):

    labels = np.array(
        [
            label_to_index[label]
            for label
            in train_df["label"]
        ]
    )

    class_indices = np.arange(
        len(CLASS_NAMES)
    )

    weights = compute_class_weight(
        class_weight="balanced",
        classes=class_indices,
        y=labels
    )

    class_weights = {
        int(index): float(weight)
        for index, weight
        in zip(
            class_indices,
            weights
        )
    }

    print()
    print("=" * 60)
    print("CLASS WEIGHTS")
    print("=" * 60)

    for index, weight in class_weights.items():

        print(
            f"{CLASS_NAMES[index]}: "
            f"{weight:.4f}"
        )

    return class_weights


# ============================================================
# CALLBACKS
# ============================================================

def create_callbacks():

    checkpoint = callbacks.ModelCheckpoint(
        filepath=str(MODEL_PATH),
        monitor="val_accuracy",
        mode="max",
        save_best_only=True,
        verbose=1
    )

    early_stopping = callbacks.EarlyStopping(
        monitor="val_loss",
        patience=5,
        restore_best_weights=True,
        verbose=1
    )

    reduce_lr = callbacks.ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=2,
        min_lr=1e-7,
        verbose=1
    )

    return [
        checkpoint,
        early_stopping,
        reduce_lr
    ]


# ============================================================
# SAVE TRAINING PLOTS
# ============================================================

def save_training_plots(
    history1,
    history2
):

    accuracy = (
        history1.history.get(
            "accuracy",
            []
        )
        +
        history2.history.get(
            "accuracy",
            []
        )
    )

    validation_accuracy = (
        history1.history.get(
            "val_accuracy",
            []
        )
        +
        history2.history.get(
            "val_accuracy",
            []
        )
    )

    loss = (
        history1.history.get(
            "loss",
            []
        )
        +
        history2.history.get(
            "loss",
            []
        )
    )

    validation_loss = (
        history1.history.get(
            "val_loss",
            []
        )
        +
        history2.history.get(
            "val_loss",
            []
        )
    )

    # --------------------------------------------------------
    # Accuracy
    # --------------------------------------------------------

    plt.figure(
        figsize=(10, 6)
    )

    plt.plot(
        accuracy,
        label="Training Accuracy"
    )

    plt.plot(
        validation_accuracy,
        label="Validation Accuracy"
    )

    plt.xlabel(
        "Epoch"
    )

    plt.ylabel(
        "Accuracy"
    )

    plt.title(
        "FER2013 Facial Emotion Accuracy"
    )

    plt.legend()

    plt.tight_layout()

    plt.savefig(
        RESULT_DIR
        / "training_accuracy.png",
        dpi=150
    )

    plt.close()

    # --------------------------------------------------------
    # Loss
    # --------------------------------------------------------

    plt.figure(
        figsize=(10, 6)
    )

    plt.plot(
        loss,
        label="Training Loss"
    )

    plt.plot(
        validation_loss,
        label="Validation Loss"
    )

    plt.xlabel(
        "Epoch"
    )

    plt.ylabel(
        "Loss"
    )

    plt.title(
        "FER2013 Facial Emotion Loss"
    )

    plt.legend()

    plt.tight_layout()

    plt.savefig(
        RESULT_DIR
        / "training_loss.png",
        dpi=150
    )

    plt.close()


# ============================================================
# MAIN
# ============================================================

def main():

    print()
    print("=" * 60)
    print("FER2013 FACIAL EMOTION MODEL TRAINING")
    print("=" * 60)

    train_df = load_manifest(
        TRAIN_MANIFEST
    )

    validation_df = load_manifest(
        VALIDATION_MANIFEST
    )

    label_to_index = {
        label: index
        for index, label
        in enumerate(CLASS_NAMES)
    }

    # --------------------------------------------------------
    # Save class mapping
    # --------------------------------------------------------

    with open(
        CLASS_NAMES_PATH,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            CLASS_NAMES,
            file,
            indent=4
        )

    # --------------------------------------------------------
    # Dataset
    # --------------------------------------------------------

    train_dataset = create_dataset(
        train_df,
        label_to_index,
        training=True
    )

    validation_dataset = create_dataset(
        validation_df,
        label_to_index,
        training=False
    )

    # --------------------------------------------------------
    # Class weights
    # --------------------------------------------------------

    class_weights = (
        calculate_class_weights(
            train_df,
            label_to_index
        )
    )

    # --------------------------------------------------------
    # Model
    # --------------------------------------------------------

    model, base_model = (
        build_model()
    )

    model.summary()

    # --------------------------------------------------------
    # Phase 1 — frozen backbone
    # --------------------------------------------------------

    print()
    print("=" * 60)
    print("PHASE 1 — TRAINING CLASSIFICATION HEAD")
    print("=" * 60)

    history1 = model.fit(
        train_dataset,
        validation_data=validation_dataset,
        epochs=HEAD_EPOCHS,
        class_weight=class_weights,
        callbacks=create_callbacks()
    )

    # --------------------------------------------------------
    # Phase 2 — fine tuning
    # --------------------------------------------------------

    print()
    print("=" * 60)
    print("PHASE 2 — FINE TUNING")
    print("=" * 60)

    base_model.trainable = True

    # Freeze most of the backbone.
    # Only fine-tune the last 30 layers.

    for layer in base_model.layers[:-30]:

        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(
            learning_rate=FINE_TUNE_LEARNING_RATE
        ),
        loss=(
            "sparse_categorical_crossentropy"
        ),
        metrics=[
            "accuracy"
        ]
    )

    history2 = model.fit(
        train_dataset,
        validation_data=validation_dataset,
        epochs=FINE_TUNE_EPOCHS,
        class_weight=class_weights,
        callbacks=create_callbacks()
    )

    # --------------------------------------------------------
    # Load best saved model
    # --------------------------------------------------------

    if not MODEL_PATH.exists():

        raise RuntimeError(
            "Best model was not saved."
        )

    best_model = tf.keras.models.load_model(
        MODEL_PATH
    )

    # --------------------------------------------------------
    # Save plots
    # --------------------------------------------------------

    save_training_plots(
        history1,
        history2
    )

    # --------------------------------------------------------
    # Final validation evaluation
    # --------------------------------------------------------

    validation_loss, validation_accuracy = (
        best_model.evaluate(
            validation_dataset,
            verbose=1
        )
    )

    print()
    print("=" * 60)
    print("TRAINING COMPLETE")
    print("=" * 60)

    print(
        f"\nBest validation accuracy: "
        f"{validation_accuracy * 100:.2f}%"
    )

    print(
        f"\nModel saved at:\n"
        f"{MODEL_PATH}"
    )

    print(
        f"\nClass mapping saved at:\n"
        f"{CLASS_NAMES_PATH}"
    )


if __name__ == "__main__":
    main()
