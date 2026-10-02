import { apiClient } from "./api";


export interface DrawingPrediction {
    screeningId: string;
    prediction: string;
    confidence: number;
    probabilities: Record<string, number>;
    modality: "drawing";
    model: string;
}


export interface FacialPrediction {
    screeningId: string;
    prediction: string;
    confidence: number;
    probabilities: Record<string, number>;
    modality: "facial";
    model: string;
}


export async function analyzeDrawing(
    drawingBlob: Blob,
    screeningId: string
): Promise<DrawingPrediction> {

    const formData =
        new FormData();

    formData.append(
        "drawing",
        drawingBlob,
        "drawing.png"
    );

    formData.append(
        "screeningId",
        screeningId
    );

    const response =
        await apiClient.post(
        "/ml/drawing",
            formData
        );

    return response.data;
}


export async function analyzeFace(
    faceBlob: Blob,
    screeningId: string
): Promise<FacialPrediction> {

    const formData =
        new FormData();

    formData.append(
        "face",
        faceBlob,
        "face.jpg"
    );

    formData.append(
        "screeningId",
        screeningId
    );

    const response =
        await apiClient.post(
        "/ml/facial",
            formData
        );

    return response.data;
}
