export interface DrawingAnalysis {
    status: string;
    emotion?: string;
    confidence?: number;
    quality?: string;
}

export interface FacialAnalysis {
    status: string;
    domEmotion?: string;
    confidence?: number;
    quality?: string;
}

export interface ContextAnalysis {
    indicator?: string;
    confidence?: number;
}

export interface FusionResult {
    score?: number;
    consistencyLevel?: string;
    available?: string[];
    overallScreeningLevel?: string;
}

export interface ScreeningSession {
    id: string;
    childId: string;
    status: 'CREATED' | 'DRAWING_PENDING' | 'FACE_PENDING' | 'ANALYZING' | 'COMPLETED' | 'REVIEWED' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;

    drawingAnalysis?: DrawingAnalysis | null;
    facialAnalysis?: FacialAnalysis | null;
    contextAnalysis?: ContextAnalysis | null;
    fusionResult?: FusionResult | null;
}
