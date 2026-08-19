import { useNavigate } from 'react-router-dom';
import { Users, Activity, FileText, CheckCircle } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Child Screening Dashboard</h2>
                    <p className="text-sm text-slate-500">Monitor screening sessions and review AI-assisted findings.</p>
                </div>
                <button onClick={() => navigate('/children/new')} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">+ New Screening</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Children', val: '—', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
                    { label: 'Active Screenings', val: '—', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Pending Reviews', val: '—', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Completed Reports', val: '—', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-slate-600">{stat.label}</span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.bg}`}>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-slate-800">{stat.val}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200">
                <div className="p-5 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-800">RECENT SCREENING SESSIONS</h3>
                </div>
                <div className="p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Activity className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-800 mb-1">No screening sessions yet</h4>
                    <p className="text-sm text-slate-500 mb-6">Start a screening session to begin gathering data.</p>
                    <button onClick={() => navigate('/children')} className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors">View Children</button>
                </div>
            </div>

            <div className="bg-teal-50 p-6 rounded-xl border border-teal-100 flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto shadow-sm">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                    <h4 className="font-semibold text-teal-900 mb-1">SCREENING WORKFLOW</h4>
                    <p className="text-xs text-teal-600 max-w-xs">End-to-end multimodal screening process</p>
                </div>
                <div className="hidden sm:block h-8 w-px bg-teal-200 mx-4"></div>
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-600 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                    <span className="bg-white px-2 py-1 rounded shadow-sm">Drawing</span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-white px-2 py-1 rounded shadow-sm">Facial Obs.</span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-white px-2 py-1 rounded shadow-sm">Context</span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded shadow-sm">Multimodal Analysis</span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-teal-50 text-teal-700 px-2 py-1 rounded shadow-sm border border-teal-100">Report</span>
                </div>
            </div>
            <p className="text-xs text-center text-slate-400 pb-4">AI-assisted screening support only. This system does not provide a clinical diagnosis. Results should be interpreted by a qualified professional.</p>
        </div>
    );
}