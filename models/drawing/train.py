from pathlib import Path
import json
import random

import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.model_selection import train_test_split

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
    / "drawing"
    / "data"
)

ARTIFACT_DIR = (
    PROJECT_ROOT
    / "models"
    / "drawing"
    / "artifacts"
)

RESULT_DIR = (
    PROJECT_ROOT
    / "models"
    / "drawing"
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

TRAIN_MANIFEST = DATA_DIR / "train.csv"

MODEL_PATH = (
    ARTIFACT_DIR
    / "drawing_emotion_model.keras"
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

VALIDATION_SIZE = 0.20

INITIAL_EPOCHS = 20

LEARNING_RATE = 1e-4


# ============================================================
# LOAD MANIFEST
# ============================================================

def load_manifest():

    if not TRAIN_MANIFEST.exists():

        raise FileNotFoundError(
            f"Training manifest not found:\n"
            f"{TRAIN_MANIFEST}\n\n"
            f"Run prepare_dataset.py first."
        )

    df = pd.read_csv(
        TRAIN_MANIFEST
    )

    required_columns = {
        "image_path",
        "label"
    }

    missing = (
        required_columns
        - set(df.columns)
    )

    if missing:

        raise ValueError(
            f"Missing required columns: {missing}"
        )

    return df


# ============================================================
# LABEL MAPPING
# ============================================================

def create_label_mapping(df):

    class_names = sorted(
        df["label"]
        .unique()
        .tolist()
    )

    expected = [
        "Happiness",
        "Sadness"
    ]

    if class_names != expected:

        raise ValueError(
            "Unexpected class names.\n"
            f"Expected: {expected}\n"
            f"Found: {class_names}"
        )

    label_to_index = {
        label: index
        for index, label
        in enumerate(class_names)
    }

    return (
        class_names,
        label_to_index
    )


# ============================================================
# LOAD IMAGE
# ============================================================

def load_image(
    image_path,
    label,
    label_to_index
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

    numeric_label = tf.cast(
        label_to_index[label.numpy().decode()],
        tf.int32
    )

    return (
        image,
        numeric_label
    )


# ============================================================
# PYTHON WRAPPER
# ============================================================

def load_image_py(
    image_path,
    label,
    label_to_index
):

    image, numeric_label = tf.py_function(
        func=lambda p, l:
        load_image(
            p,
            l,
            label_to_index
        ),
        inp=[
            image_path,
            label
        ],
        Tout=[
            tf.float32,
            tf.int32
        ]
    )

    image.set_shape(
        [224, 224, 3]
    )

    numeric_label.set_shape([])

    return (
        image,
        numeric_label
    )


# ============================================================
# AUGMENTATION
# ============================================================

data_augmentation = tf.keras.Sequential(
    [
        layers.RandomRotation(
            0.04
        ),

        layers.RandomZoom(
            height_factor=0.08,
            width_factor=0.08
        ),

        layers.RandomTranslation(
            height_factor=0.05,
            width_factor=0.05
        )
    ],
    name="drawing_augmentation"
)


# ============================================================
# DATASET CREATION
# ============================================================

def create_dataset(
    df,
    label_to_index,
    training=False
):

    paths = df[
        "image_path"
    ].astype(str).values

    labels = df[
        "label"
    ].astype(str).values

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
        lambda path, label:
        load_image_py(
            path,
            label,
            label_to_index
        ),
        num_parallel_calls=tf.data.AUTOTUNE
    )

    if training:

        dataset = dataset.map(
            lambda image, label:
            (
                data_augmentation(image, training=True),
                label
            ),
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

    x = base_model(
        inputs,
        training=False
    )

    x = layers.GlobalAveragePooling2D()(x)

    x = layers.Dense(
        128,
        activation="relu"
    )(x)

    x = layers.Dropout(
        0.4
    )(x)

    outputs = layers.Dense(
        2,
        activation="softmax"
    )(x)

    model = models.Model(
        inputs,
        outputs
    )

    model.compile(
        optimizer=tf.keras.optimizers.Adam(
            learning_rate=LEARNING_RATE
        ),
        loss="sparse_categorical_crossentropy",
        metrics=[
            "accuracy"
        ]
    )

    return model


# ============================================================
# MAIN
# ============================================================

def main():

    print()
    print("=" * 60)
    print("KIDO DRAWING EMOTION MODEL TRAINING")
    print("=" * 60)

    df = load_manifest()

    print()
    print(
        f"Total training samples: {len(df)}"
    )

    class_names, label_to_index = (
        create_label_mapping(df)
    )

    print()
    print(
        f"Classes: {class_names}"
    )

    # --------------------------------------------------------
    # Train/validation split
    # --------------------------------------------------------

    train_df, validation_df = (
        train_test_split(
            df,
            test_size=VALIDATION_SIZE,
            random_state=SEED,
            stratify=df["label"]
        )
    )

    print()
    print(
        f"Training samples: "
        f"{len(train_df)}"
    )

    print(
        f"Validation samples: "
        f"{len(validation_df)}"
    )

    # --------------------------------------------------------
    # Save class mapping
    # --------------------------------------------------------

    with open(
        CLASS_NAMES_PATH,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            class_names,
            file,
            indent=4
        )

    # --------------------------------------------------------
    # Create datasets
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
    # Build model
    # --------------------------------------------------------

    model = build_model()

    model.summary()

    # --------------------------------------------------------
    # Callbacks
    # --------------------------------------------------------

    early_stopping = callbacks.EarlyStopping(
        monitor="val_loss",
        patience=5,
        restore_best_weights=True
    )

    model_checkpoint = callbacks.ModelCheckpoint(
        filepath=str(MODEL_PATH),
        monitor="val_accuracy",
        save_best_only=True,
        verbose=1
    )

    reduce_lr = callbacks.ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=2,
        min_lr=1e-7,
        verbose=1
    )

    # --------------------------------------------------------
    # Training
    # --------------------------------------------------------

    history = model.fit(
        train_dataset,
        validation_data=validation_dataset,
        epochs=INITIAL_EPOCHS,
        callbacks=[
            early_stopping,
            model_checkpoint,
            reduce_lr
        ]
    )

    # --------------------------------------------------------
    # Training history
    # --------------------------------------------------------

    import matplotlib.pyplot as plt

    plt.figure(
        figsize=(10, 5)
    )

    plt.plot(
        history.history["accuracy"],
        label="Training Accuracy"
    )

    plt.plot(
        history.history["val_accuracy"],
        label="Validation Accuracy"
    )

    plt.xlabel("Epoch")
    plt.ylabel("Accuracy")
    plt.title(
        "Drawing Emotion Model Accuracy"
    )
    plt.legend()
    plt.tight_layout()

    accuracy_path = (
        RESULT_DIR
        / "training_accuracy.png"
    )

    plt.savefig(
        accuracy_path,
        dpi=150
    )

    plt.close()

    plt.figure(
        figsize=(10, 5)
    )

    plt.plot(
        history.history["loss"],
        label="Training Loss"
    )

    plt.plot(
        history.history["val_loss"],
        label="Validation Loss"
    )

    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.title(
        "Drawing Emotion Model Loss"
    )
    plt.legend()
    plt.tight_layout()

    loss_path = (
        RESULT_DIR
        / "training_loss.png"
    )

    plt.savefig(
        loss_path,
        dpi=150
    )

    plt.close()

    print()
    print("=" * 60)
    print("TRAINING COMPLETE")
    print("=" * 60)

    print()
    print(
        f"Best model saved at:\n"
        f"{MODEL_PATH}"
    )

    print()
    print(
        f"Class names saved at:\n"
        f"{CLASS_NAMES_PATH}"
    )

    print()
    print(
        f"Training accuracy plot:\n"
        f"{accuracy_path}"
    )

    print()
    print(
        f"Training loss plot:\n"
        f"{loss_path}"
    )


if __name__ == "__main__":
    main()
