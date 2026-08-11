export interface User { id: string; email: string; name: string; role: string; }
export interface Child { id: string; age: number; sex: 'Male'|'Female'|'Other'; createdAt: string; }
export interface ScreeningSession { id: string; childId: string; date: string; status: 'Active'|'Completed'; }
export interface DrawingData { fileBlob: Blob; timestamp: number; }
export interface DrawingAnalysis { dominantEmotion: string; distribution: Record<string, number>; confidence: number; quality: number; modelVersion: string; }
export interface FacialObservation { videoBlob: Blob; duration: number; }
export interface FacialAnalysis { dominantEmotion: string; distribution: Record<string, number>; observationDuration: number; framesAnalyzed: number; confidence: number; quality: number; modelVersion: string; }
export interface ContextData { notes: string; }
export interface AnxietyIndicator { level: 'Low'|'Moderate'|'Elevated'|'High'|'Unavailable'; confidence: number; quality: number; modelVersion: string; }
export interface FusionResult { consistency: 'High'|'Moderate'|'Low'|'Unavailable'; indicator: AnxietyIndicator; }
export interface ScreeningResult { drawing: DrawingAnalysis | null; facial: FacialAnalysis | null; fusion: FusionResult | null; status: string; }
export interface Report { id: string; screeningId: string; status: 'Draft'|'Pending Review'|'Reviewed'|'Approved'; notes: string; recommendation: string; priority: string; }