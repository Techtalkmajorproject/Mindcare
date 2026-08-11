const fs = require('fs');
const path = require('path');

const files = {
    'src/pages/AnalysisProgress.tsx': `import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

type StageState = 'waiting' | 'processing' | 'completed' | 'failed' | 'unavailable';

export default function AnalysisProgress() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Stages: Drawing Analysis, Facial Emotion Analysis, Context Analysis, Multimodal Fusion, Report Preparation
    const [stages, setStages] = useState<{name: string, state: StageState}[]>([
        { name: 'Drawing Analysis', state: 'processing' },
        { name: 'Facial Emotion Analysis', state: 'waiting' },
        { name: 'Context Analysis', state: 'waiting' },
        { name: 'Multimodal Fusion', state: 'waiting' },
        { name: 'Report Preparation', state: 'waiting' },
    ]);

    useEffect(() => {
        // Simulate progress for UI completeness, eventually powered by backend AI status polling
        let currentStage = 0;
        const interval = setInterval(() => {
            setStages(prev => {
                const next = [...prev];
                // Mark current as complete
                if (currentStage < next.length) {
                    next[currentStage].state = 'completed';
                }
                currentStage++;
                // Set next as processing
                if (currentStage < next.length) {
                    next[currentStage].state = 'processing';
                }
                
                if (currentStage >= next.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        navigate(\`/screenings/\${id}/results\`);
                    }, 1000);
                }
                
                return next;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [id, navigate]);

    return (
        <div className="max-w-2xl mx-auto py-12">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4 shadow-sm">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Analyzing Screening</h2>
                <p className="text-slate-500 mt-2">The available screening information is being processed by the AI models.</p>
                <div className="mt-4 inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium border border-slate-200">
                    Screening ID: {id}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="space-y-6">
                    {stages.map((stage, i) => (
                        <div key={i} className="flex items-center">
                            <div className="w-8 flex justify-center">
                                {stage.state === 'waiting' && <div className="w-3 h-3 rounded-full bg-slate-200" />}
                                {stage.state === 'processing' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
                                {stage.state === 'completed' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                {stage.state === 'failed' && <AlertCircle className="w-5 h-5 text-red-500" />}
                                {stage.state === 'unavailable' && <div className="w-3 h-3 rounded-full bg-slate-200" />}
                            </div>
                            <div className="ml-4 flex-1">
                                <p className={\`font-medium \${stage.state === 'waiting' || stage.state === 'unavailable' ? 'text-slate-400' : 'text-slate-700'}\`}>
                                    {stage.name}
                                </p>
                            </div>
                            <div className="text-xs font-medium uppercase text-slate-400">
                                {stage.state}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <p className="text-xs text-center text-slate-400 pb-4 mt-8">Please do not close this window. Analysis is performed securely.</p>
        </div>
    );
}`,
    'src/pages/Results.tsx': `import { useNavigate, useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShieldAlert, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function Results() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Simulate data unavailable since backend is pending. 
    // Requirement 36: NO FAKE AI DATA.
    
    const unavailableData = true;

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
                        <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Analysis completed</span>
                    </div>
                </div>
                <button onClick={() => navigate(\`/screenings/\${id}/report\`)} className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                    Review Report
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
                        <div className="text-4xl font-bold text-slate-300">
                            {unavailableData ? 'Not available' : 'TBD'}
                        </div>
                    </div>
                    {unavailableData && <p className="text-sm text-slate-400 mt-2">Awaiting analysis data from the backend.</p>}
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Referral Review</h3>
                    <div className="font-bold text-xl text-slate-400">{unavailableData ? 'Not available' : 'TBD'}</div>
                    <p className="text-xs text-slate-400 mt-1">Model Confidence: Not available</p>
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
                        <div className="h-64">{/* Charts would go here from backend data */}</div>
                    )}
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg">
                        <div>
                            <span className="text-slate-500 block mb-1 text-xs uppercase font-semibold">Dominant Emotion</span>
                            <span className="font-medium text-slate-700">Not available</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block mb-1 text-xs uppercase font-semibold">Input Quality</span>
                            <span className="font-medium text-slate-700">Not available</span>
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
                        <div className="h-64">{/* Chart would go here */}</div>
                    )}
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg">
                        <div>
                            <span className="text-slate-500 block mb-1 text-xs uppercase font-semibold">Observation Time</span>
                            <span className="font-medium text-slate-700">Not available</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block mb-1 text-xs uppercase font-semibold">Frames Analyzed</span>
                            <span className="font-medium text-slate-700">0</span>
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
                        <div className="font-medium text-slate-400">Not available</div>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-xs font-semibold text-slate-500 block mb-2 uppercase">Facial Signal</span>
                        <div className="font-medium text-slate-400">Not available</div>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-xs font-semibold text-slate-500 block mb-2 uppercase">Context Signal</span>
                        <div className="font-medium text-slate-400">Not available</div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <span className="font-medium text-blue-900">Cross-Modal Consistency</span>
                    <span className="font-bold text-blue-400">Not available</span>
                </div>
            </div>
        </div>
    );
}`,
    'src/pages/Report.tsx': `import { useNavigate, useParams } from 'react-router-dom';
import { Save, Download, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function Report() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState<'Draft'|'Pending Review'|'Approved'>('Draft');

    return (
        <div className="space-y-6 pb-20 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between md:items-end space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Screening Report</h2>
                    <div className="flex items-center mt-2 space-x-4 text-sm text-slate-500 font-medium">
                        <span>ID: {id}</span>
                        <span>•</span>
                        <span>Date: {new Date().toLocaleDateString()}</span>
                        <span>•</span>
                        <span className={\`flex items-center px-2 py-0.5 rounded border text-xs font-bold \${
                            status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                        }\`}>
                            {status}
                        </span>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors bg-white">
                        <Save className="w-4 h-4 mr-2" /> Save Draft
                    </button>
                    <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
                        <Download className="w-4 h-4 mr-2" /> Download PDF
                    </button>
                    {status !== 'Approved' && (
                        <button onClick={() => setStatus('Approved')} className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
                            <Check className="w-4 h-4 mr-2" /> Approve Report
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex text-sm text-amber-800 shadow-sm">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 text-amber-600" />
                <p><strong>Required disclaimer:</strong> AI-assisted screening support only. This system does not provide a clinical diagnosis. Results should be interpreted by a qualified professional.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-6">1. Screening Overview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                        <div>
                            <span className="block text-xs font-semibold text-slate-500 uppercase">Child ID</span>
                            <span className="font-medium text-slate-900">{id}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-semibold text-slate-500 uppercase">Age / Sex</span>
                            <span className="font-medium text-slate-900">Unknown</span>
                        </div>
                        <div>
                            <span className="block text-xs font-semibold text-slate-500 uppercase">Screening Date</span>
                            <span className="font-medium text-slate-900">{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-bold text-slate-800 mb-4">2. AI Analysis Findings</h3>
                    <p className="text-sm text-slate-500 italic mb-4">Analysis data is awaiting backend integration. The following sections will be populated once the ML models return results.</p>
                    
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-600 font-medium">Anxiety-related Screening Indicator</span>
                            <span className="text-slate-400 font-bold">Not available</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-600 font-medium">Drawing Emotional Priority</span>
                            <span className="text-slate-400 font-bold">Not available</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-600 font-medium">Facial Expression Continuity</span>
                            <span className="text-slate-400 font-bold">Not available</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600 font-medium">Referral Recommendation</span>
                            <span className="text-slate-400 font-bold">Not available</span>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="font-bold text-slate-800 mb-4">3. Psychologist Notes</h3>
                    <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter clinical observations, context around the screening session, and any interpretation of the AI-assisted findings..."
                        className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y text-slate-700"
                    />
                </div>
            </div>
        </div>
    );
}`
};

Object.entries(files).forEach(([filepath, content]) => {
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, content);
});
console.log('UI Generator step 4 complete.');
