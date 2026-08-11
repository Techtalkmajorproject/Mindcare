import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

type StageState = 'waiting' | 'processing' | 'completed' | 'failed' | 'unavailable';

export default function AnalysisProgress() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Stages: Drawing Analysis, Facial Emotion Analysis, Context Analysis, Multimodal Fusion, Report Preparation
    const [stages, setStages] = useState<{ name: string, state: StageState }[]>([
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
                        navigate(`/screenings/${id}/results`);
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
                                <p className={`font-medium ${stage.state === 'waiting' || stage.state === 'unavailable' ? 'text-slate-400' : 'text-slate-700'}`}>
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
}