import { useNavigate } from 'react-router-dom';
import { Users, Activity, FileText, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { statsService } from '../services/stats.service';

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalChildren: 0,
        activeScreenings: 0,
        pendingReviews: 0,
        completedReports: 0,
        recentScreenings: [] as any[]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await statsService.getDashboardStats();
                setStats(res.data);
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

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
                    { label: 'Total Children', val: loading ? '...' : stats.totalChildren, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
                    { label: 'Active Screenings', val: loading ? '...' : stats.activeScreenings, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Pending Reviews', val: loading ? '...' : stats.pendingReviews, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Completed Reports', val: loading ? '...' : stats.completedReports, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' }
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
                {loading ? (
                    <div className="p-12 text-center text-slate-500">Loading...</div>
                ) : stats.recentScreenings.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {stats.recentScreenings.map((session) => (
                            <div key={session.id} className="p-4 hover:bg-slate-50 flex items-center justify-between transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                        <Users className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">{session.childName}</p>
                                        <p className="text-xs text-slate-500">
                                            Status: <span className="font-medium">{session.status}</span>
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => navigate(`/screenings/${session.id}/workspace`)} className="text-sm font-medium text-teal-600 hover:text-teal-800 cursor-pointer">
                                    Open Workspace
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Activity className="w-8 h-8 text-slate-400" />
                        </div>
                        <h4 className="text-lg font-medium text-slate-800 mb-1">No screening sessions yet</h4>
                        <p className="text-sm text-slate-500 mb-6">Start a screening session to begin gathering data.</p>
                        <button onClick={() => navigate('/children')} className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors">View Children</button>
                    </div>
                )}
            </div>


            <p className="text-xs text-center text-slate-400 pb-4">AI-assisted screening support only. This system does not provide a clinical diagnosis. Results should be interpreted by a qualified professional.</p>
        </div>
    );
}