export interface Report {
    id: string;
    screeningId: string;
    status: 'DRAFT' | 'APPROVED';
    content: any; // Dynamic JSON structure for report findings
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
