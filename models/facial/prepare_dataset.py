from pathlib import Path

import pandas as pd

from sklearn.model_selection import train_test_split


# ============================================================
# PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATASET_ROOT = (
    PROJECT_ROOT
    / "datasets"
    / "facial"
)

TRAIN_ROOT = (
    DATASET_ROOT
    / "train"
)

TEST_ROOT = (
    DATASET_ROOT
    / "test"
)

OUTPUT_DIR = (
    PROJECT_ROOT
    / "models"
    / "facial"
    / "data"
)

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# CLASS ORDER
# ============================================================

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
# IMAGE EXTENSIONS
# ============================================================

VALID_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".webp"
}


# ============================================================
# COLLECT IMAGES
# ============================================================

def collect_images(root: Path):

    if not root.exists():

        raise FileNotFoundError(
            f"Dataset directory does not exist:\n{root}"
        )

    records = []

    for class_name in CLASS_NAMES:

        class_dir = (
            root
            / class_name
        )

        if not class_dir.exists():

            raise FileNotFoundError(
                f"Class directory missing:\n"
                f"{class_dir}"
            )

        images = [
            path
            for path in class_dir.rglob("*")
            if (
                path.is_file()
                and path.suffix.lower()
                in VALID_EXTENSIONS
            )
        ]

        for image_path in images:

            records.append(
                {
                    "image_path": str(
                        image_path.resolve()
                    ),
                    "label": class_name
                }
            )

    return pd.DataFrame(
        records
    )


# ============================================================
# PRINT DISTRIBUTION
# ============================================================

def print_distribution(
    df,
    name
):

    print()
    print("=" * 60)
    print(f"{name} DISTRIBUTION")
    print("=" * 60)

    counts = (
        df["label"]
        .value_counts()
        .reindex(
            CLASS_NAMES,
            fill_value=0
        )
    )

    print(
        counts.to_string()
    )

    print(
        f"\nTotal: {len(df)}"
    )


# ============================================================
# MAIN
# ============================================================

def main():

    print()
    print("=" * 60)
    print("FER2013 DATASET PREPARATION")
    print("=" * 60)

    full_training = collect_images(
        TRAIN_ROOT
    )

    test_df = collect_images(
        TEST_ROOT
    )

    print_distribution(
        full_training,
        "FULL TRAINING"
    )

    print_distribution(
        test_df,
        "TEST"
    )

    # --------------------------------------------------------
    # Stratified train / validation split
    # --------------------------------------------------------

    train_df, validation_df = (
        train_test_split(
            full_training,
            test_size=0.20,
            random_state=42,
            stratify=full_training["label"]
        )
    )

    train_df = train_df.reset_index(
        drop=True
    )

    validation_df = validation_df.reset_index(
        drop=True
    )

    test_df = test_df.reset_index(
        drop=True
    )

    # --------------------------------------------------------
    # Save manifests
    # --------------------------------------------------------

    train_path = (
        OUTPUT_DIR
        / "train.csv"
    )

    validation_path = (
        OUTPUT_DIR
        / "validation.csv"
    )

    test_path = (
        OUTPUT_DIR
        / "test.csv"
    )

    train_df.to_csv(
        train_path,
        index=False
    )

    validation_df.to_csv(
        validation_path,
        index=False
    )

    test_df.to_csv(
        test_path,
        index=False
    )

    # --------------------------------------------------------
    # Print final distributions
    # --------------------------------------------------------

    print_distribution(
        train_df,
        "TRAIN"
    )

    print_distribution(
        validation_df,
        "VALIDATION"
    )

    print_distribution(
        test_df,
        "TEST"
    )

    # --------------------------------------------------------
    # Verify classes
    # --------------------------------------------------------

    for df, name in [
        (train_df, "train"),
        (validation_df, "validation"),
        (test_df, "test")
    ]:

        found_classes = set(
            df["label"].unique()
        )

        expected_classes = set(
            CLASS_NAMES
        )

        if found_classes != expected_classes:

            raise ValueError(
                f"Class mismatch in {name}.\n"
                f"Expected: {expected_classes}\n"
                f"Found: {found_classes}"
            )

    print()
    print("=" * 60)
    print("DATASET PREPARATION COMPLETE")
    print("=" * 60)

    print(
        f"\nTraining manifest:\n{train_path}"
    )

    print(
        f"\nValidation manifest:\n"
        f"{validation_path}"
    )

    print(
        f"\nTest manifest:\n{test_path}"
    )


if __name__ == "__main__":
    main()
