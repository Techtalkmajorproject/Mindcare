import { useNavigate, useParams } from 'react-router-dom';
import { User, Calendar, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { childService } from '../services/child.service';
import { Child, ScreeningSession } from '../types';

export default function ChildProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [child, setChild] = useState<Child | null>(null);
    const [screenings, setScreenings] = useState<ScreeningSession[]>([]);

    useEffect(() => {
        if (!id) return;
        childService.getChild(id).then(res => setChild(res.data)).catch(console.error);
        childService.getChildScreenings(id).then(res => setScreenings(res.data)).catch(console.error);
    }, [id]);

    if (!child) return <div className="p-6">Loading...</div>;

    const createdAtDisplay = child.createdAt
        ? new Date((child.createdAt as any)._seconds ? (child.createdAt as any)._seconds * 1000 : child.createdAt).toLocaleDateString()
        : 'Unknown';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Child Profile: {child.name || child.id}</h2>
                    <p className="text-sm text-slate-500">Review details and screening history.</p>
                </div>
                <button onClick={() => navigate(`/children/${id}/screening/new`)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">Start New Screening</button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase">Screening ID</p>
                        <p className="text-lg font-medium text-slate-900">{id}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase">Age</p>
                        <p className="text-lg font-medium text-slate-900">{child.age} yrs</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase">Gender</p>
                        <p className="text-lg font-medium text-slate-900">{child.gender}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase">Created Date</p>
                        <div className="flex items-center text-slate-900">
                            <Calendar className="w-4 h-4 mr-1 text-slate-400" />
                            <p className="text-lg font-medium">{createdAtDisplay}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200">
                <div className="p-5 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-800">SCREENING HISTORY</h3>
                </div>
                {screenings.length > 0 ? (
                    <div className="p-4 space-y-4">
                        {screenings.map(screening => (
                            <div key={screening.id} className="border border-slate-200 rounded p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-slate-800">Session: {screening.id}</p>
                                    <p className="text-xs text-slate-500">Status: {screening.status}</p>
                                </div>
                                <div className="space-x-3">
                                    <button onClick={() => navigate(`/screenings/${screening.id}/workspace`)} className="text-sm text-blue-600 hover:underline">Workspace</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Activity className="w-8 h-8 text-slate-400" />
                        </div>
                        <h4 className="text-lg font-medium text-slate-800 mb-1">No screening sessions yet.</h4>
                        <p className="text-sm text-slate-500 mb-6">Start gathering data by beginning a new screening.</p>
                        <button onClick={() => navigate(`/children/${id}/screening/new`)} className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors">Start Screening</button>
                    </div>
                )}
            </div>

            <p className="text-xs text-center text-slate-400 pb-4 mt-6">AI-assisted screening support only. This system does not provide a clinical diagnosis.</p>
        </div>
    );
}