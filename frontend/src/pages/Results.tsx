import { useNavigate, useParams } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { reportService } from '../services/report.service';

export default function Results() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [unavailableData, setUnavailableData] = useState(true);
    const [results, setResults] = useState<any>(null);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                // Fetch results from backend
                const response = await fetch(`http://localhost:5000/api/screenings/${id}/results`, {
                    headers: { 'Authorization': `Bearer ${await (await import('../firebase/config')).auth.currentUser?.getIdToken()}` }
                });
                const data = await response.json();
                if (data && data.riskLevel) {
                    setResults(data);
                    setUnavailableData(false);
                } else if (data && data.childId) {
                    setResults(data);
                }
            } catch (e) { }
        };
        fetchResults();
    }, [id]);

    const handleReviewReport = async () => {
        if (!id) return;
        setGenerating(true);
        try {
            // we should have childId on results. If not, we might need a fallback.
            const childId = results?.childId || 'UNKNOWN';
            const res = await reportService.createReport({ childId, screeningId: id });
            if (res.data && res.data.success) {
                navigate(`/reports/${res.data.reportId}`);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to create report.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between md:items-end space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Screening Results</h2>
                    <div className="flex items-center mt-2 space-x-4 text-sm text-slate-500 font-medium">
                        <span>ID: {id}</span>
                        <span>•</span>
                        <span>Date: {new Date().toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="flex items-center text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">Analysis completed</span>
                    </div>
                </div>
                <button onClick={handleReviewReport} disabled={generating} className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50">
                    {generating ? 'Creating...' : 'Review Report'}
                </button>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-3" />
                    <div>
                        <h3 className="text-sm font-bold text-amber-800">Disclaimer</h3>
                        <p className="text-sm text-amber-700 mt-1">
                            AI-assisted screening support only. This system does not provide a clinical diagnosis. Results should be interpreted by a qualified professional.
                        </p>
                    </div>
                </div>
            </div>

            {/* Overall Screening Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-1 md:col-span-2">
                    <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center mb-4"><ShieldAlert className="w-4 h-4 mr-2" /> Anxiety-related Screening Indicator</h3>

                    <div className="flex items-end space-x-6">
                        <div className="text-4xl font-bold text-slate-800">
                            {unavailableData ? 'Not available' : (results?.riskLevel === 'high' ? 'Elevated' : (results?.riskLevel === 'moderate' ? 'Moderate' : 'Low'))}
                        </div>
                    </div>
                    {unavailableData && <p className="text-sm text-slate-400 mt-2">Awaiting analysis data from the backend.</p>}
                    {!unavailableData && <p className="text-sm text-slate-600 mt-2">{results?.logic}</p>}
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Referral Review</h3>
                    <div className="font-bold text-xl text-slate-800">{unavailableData ? 'Not available' : (results?.riskLevel === 'high' ? 'Recommended' : 'Monitor')}</div>
                    <p className="text-xs text-slate-500 mt-1">Model Confidence: {unavailableData ? 'Not available' : results?.confidence || 'High'}</p>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">DRAWING ANALYSIS</h3>
                    {unavailableData ? (
                        <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            <span className="text-slate-400 font-medium">No drawing analysis available.</span>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                            <span className="text-slate-600">Drawing Analysis Pending Model Integration</span>
                        </div>
                    )}
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg">
                        <div>
                            <span className="text-slate-500 block mb-1 text-xs uppercase font-semibold">Dominant Emotion</span>
                            <span className="font-medium text-slate-700">{unavailableData ? 'Not available' : (results?.emotion || 'Unknown')}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block mb-1 text-xs uppercase font-semibold">Input Quality</span>
                            <span className="font-medium text-slate-700">{unavailableData ? 'Not available' : 'Good'}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">FACIAL EMOTION ANALYSIS</h3>
                    {unavailableData ? (
                        <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            <span className="text-slate-400 font-medium">No facial observation data available.</span>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-lg p-4">
                            <span className="text-slate-800 font-bold text-2xl capitalize mb-2">{results?.emotion}</span>
                            <span className="text-slate-600 font-medium">Confidence: {results?.confidence}</span>
                        </div>
                    )}
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg">
                        <div>
                            <span className="text-slate-500 block mb-1 text-xs uppercase font-semibold">Observation Time</span>
                            <span className="font-medium text-slate-700">{unavailableData ? 'Not available' : 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block mb-1 text-xs uppercase font-semibold">Frames Analyzed</span>
                            <span className="font-medium text-slate-700">{unavailableData ? '0' : '1 (Image)'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center">
                    MULTIMODAL FINDINGS <Info className="w-4 h-4 ml-2 text-slate-400" />
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-xs font-semibold text-slate-500 block mb-2 uppercase">Drawing Signal</span>
                        <div className={`font-medium ${unavailableData ? 'text-slate-400' : 'text-slate-800'}`}>{unavailableData ? 'Not available' : 'Processed'}</div>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-xs font-semibold text-slate-500 block mb-2 uppercase">Facial Signal</span>
                        <div className={`font-medium ${unavailableData ? 'text-slate-400' : 'text-slate-800'}`}>{unavailableData ? 'Not available' : (results?.emotion ? 'Analyzed' : 'Pending')}</div>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-xs font-semibold text-slate-500 block mb-2 uppercase">Context Signal</span>
                        <div className={`font-medium ${unavailableData ? 'text-slate-400' : 'text-slate-800'}`}>{unavailableData ? 'Not available' : 'Pending'}</div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-teal-50 border border-teal-100 rounded-lg">
                    <span className="font-medium text-teal-900">Cross-Modal Consistency</span>
                    <span className="font-bold text-teal-600">Not available</span>
                </div>
            </div>
        </div>
    );
}