import { useNavigate, useParams } from 'react-router-dom';
import { User, Calendar, Activity } from 'lucide-react';

export default function ChildProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Child Profile</h2>
                    <p className="text-sm text-slate-500">Review details and screening history.</p>
                </div>
                <button onClick={() => navigate(`/screenings/new-session?id=${id}`)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">Start New Screening</button>
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
                        <p className="text-lg font-medium text-slate-900">6 yrs</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase">Sex</p>
                        <p className="text-lg font-medium text-slate-900">Female</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase">Created Date</p>
                        <div className="flex items-center text-slate-900">
                            <Calendar className="w-4 h-4 mr-1 text-slate-400" />
                            <p className="text-lg font-medium">Oct 12, 2023</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200">
                <div className="p-5 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-800">SCREENING HISTORY</h3>
                </div>
                <div className="p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Activity className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-800 mb-1">No screening sessions yet.</h4>
                    <p className="text-sm text-slate-500 mb-6">Start gathering data by beginning a new screening.</p>
                    <button onClick={() => navigate(`/screenings/${id}/workspace`)} className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors">Start Screening</button>
                </div>
            </div>
            
            <p className="text-xs text-center text-slate-400 pb-4">AI-assisted screening support only. This system does not provide a clinical diagnosis.</p>
        </div>
    );
}