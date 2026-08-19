from pathlib import Path
import pandas as pd


# ============================================================
# PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATASET_ROOT = (
    PROJECT_ROOT
    / "datasets"
    / "drawing"
    / "Dataset"
)

EMOTION_IMAGE_ROOT = (
    DATASET_ROOT
    / "Images"
    / "Emotion"
)

EMOTION_TEXT_ROOT = (
    DATASET_ROOT
    / "Texts"
    / "Emotion"
)

OUTPUT_DIR = (
    PROJECT_ROOT
    / "models"
    / "drawing"
    / "data"
)

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
)

TRAIN_CSV = EMOTION_TEXT_ROOT / "Emotion_Train.csv"
TEST_CSV = EMOTION_TEXT_ROOT / "Emotion_Test.csv"

TRAIN_IMAGE_ROOT = EMOTION_IMAGE_ROOT / "train"
TEST_IMAGE_ROOT = EMOTION_IMAGE_ROOT / "test"

OUTPUT_TRAIN = OUTPUT_DIR / "train.csv"
OUTPUT_TEST = OUTPUT_DIR / "test.csv"


# ============================================================
# IMAGE INDEX
# ============================================================

def build_image_index(root: Path) -> dict[str, str]:

    image_index = {}

    valid_extensions = {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    }

    if not root.exists():
        raise FileNotFoundError(
            f"Image directory does not exist: {root}"
        )

    for image_path in root.rglob("*"):

        if not image_path.is_file():
            continue

        if image_path.suffix.lower() not in valid_extensions:
            continue

        image_id = image_path.stem

        if image_id in image_index:

            raise ValueError(
                f"Duplicate image ID detected: {image_id}\n"
                f"First image: {image_index[image_id]}\n"
                f"Second image: {image_path}"
            )

        image_index[image_id] = str(
            image_path.resolve()
        )

    return image_index


# ============================================================
# READ CSV
# ============================================================

def read_emotion_csv(csv_path: Path) -> pd.DataFrame:

    if not csv_path.exists():

        raise FileNotFoundError(
            f"CSV file does not exist: {csv_path}"
        )

    df = pd.read_csv(
        csv_path,
        header=None,
        dtype=str,
        keep_default_na=False
    )

    if df.shape[1] < 4:

        raise ValueError(
            f"Unexpected CSV structure: {csv_path}\n"
            f"Expected at least 4 columns.\n"
            f"Found: {df.shape[1]}"
        )

    df = df.iloc[:, :4].copy()

    df.columns = [
        "image_id",
        "text_tr",
        "text_en",
        "emotion"
    ]

    for column in df.columns:

        df[column] = (
            df[column]
            .astype(str)
            .str.strip()
        )

    df = df[
        (df["image_id"] != "")
        &
        (df["emotion"] != "")
    ].copy()

    return df


# ============================================================
# CREATE MANIFEST
# ============================================================

def create_manifest(
    csv_path: Path,
    image_root: Path,
    split_name: str
) -> pd.DataFrame:

    df = read_emotion_csv(csv_path)

    image_index = build_image_index(
        image_root
    )

    records = []
    missing_ids = []

    for _, row in df.iterrows():

        image_id = row["image_id"]
        emotion = row["emotion"]

        image_path = image_index.get(
            image_id
        )

        if image_path is None:

            missing_ids.append(
                image_id
            )

            continue

        records.append(
            {
                "image_id": image_id,
                "image_path": image_path,
                "label": emotion
            }
        )

    manifest = pd.DataFrame(
        records,
        columns=[
            "image_id",
            "image_path",
            "label"
        ]
    )

    print()
    print("=" * 60)
    print(f"{split_name.upper()} DATASET")
    print("=" * 60)

    print(
        f"CSV rows:       {len(df)}"
    )

    print(
        f"Matched images: {len(manifest)}"
    )

    print(
        f"Missing images: {len(missing_ids)}"
    )

    if not manifest.empty:

        print()
        print("Class distribution:")

        print(
            manifest["label"]
            .value_counts()
            .to_string()
        )

    if missing_ids:

        missing_file = (
            OUTPUT_DIR
            / f"{split_name}_missing_images.txt"
        )

        with open(
            missing_file,
            "w",
            encoding="utf-8"
        ) as file:

            for image_id in missing_ids:

                file.write(
                    image_id + "\n"
                )

        print()
        print(
            f"Missing IDs saved to: "
            f"{missing_file}"
        )

    return manifest


# ============================================================
# MAIN
# ============================================================

def main():

    print()
    print("=" * 60)
    print("KIDO DRAWING EMOTION DATASET PREPARATION")
    print("=" * 60)

    train_manifest = create_manifest(
        TRAIN_CSV,
        TRAIN_IMAGE_ROOT,
        "train"
    )

    test_manifest = create_manifest(
        TEST_CSV,
        TEST_IMAGE_ROOT,
        "test"
    )

    expected_labels = {
        "Happiness",
        "Sadness"
    }

    train_labels = set(
        train_manifest["label"].unique()
    )

    test_labels = set(
        test_manifest["label"].unique()
    )

    unexpected_train = (
        train_labels - expected_labels
    )

    unexpected_test = (
        test_labels - expected_labels
    )

    if unexpected_train:

        raise ValueError(
            "Unexpected training labels: "
            f"{unexpected_train}"
        )

    if unexpected_test:

        raise ValueError(
            "Unexpected test labels: "
            f"{unexpected_test}"
        )

    if train_manifest.empty:

        raise ValueError(
            "Training manifest is empty."
        )

    if test_manifest.empty:

        raise ValueError(
            "Test manifest is empty."
        )

    train_manifest.to_csv(
        OUTPUT_TRAIN,
        index=False
    )

    test_manifest.to_csv(
        OUTPUT_TEST,
        index=False
    )

    print()
    print("=" * 60)
    print("DATASET PREPARATION COMPLETE")
    print("=" * 60)

    print()
    print(
        f"Training manifest:\n"
        f"{OUTPUT_TRAIN}"
    )

    print()
    print(
        f"Test manifest:\n"
        f"{OUTPUT_TEST}"
    )

    print()
    print(
        f"Training samples: "
        f"{len(train_manifest)}"
    )

    print(
        f"Test samples: "
        f"{len(test_manifest)}"
    )


if __name__ == "__main__":
    main()
