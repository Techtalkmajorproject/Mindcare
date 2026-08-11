import { useNavigate } from 'react-router-dom';
import { Search, UserCheck } from 'lucide-react';

export default function Children() {
    const navigate = useNavigate();
    
    // Fake data for UI representation
    const childrenList = [
        { id: 'CH-849201', age: 6, sex: 'Female', sessions: 2, lastScreening: '2023-10-12', action: 'View' },
        { id: 'CH-271944', age: 7, sex: 'Male', sessions: 1, lastScreening: '2023-11-05', action: 'View' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Children</h2>
                    <p className="text-sm text-slate-500">Manage screening profiles and previous screening sessions.</p>
                </div>
                <button onClick={() => navigate('/children/new')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">+ Add Child</button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <div className="relative w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Search by screening ID" 
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {childrenList.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Screening ID</th>
                                    <th className="px-6 py-4">Age</th>
                                    <th className="px-6 py-4">Sex</th>
                                    <th className="px-6 py-4">Sessions</th>
                                    <th className="px-6 py-4">Last Screening</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {childrenList.map((child, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{child.id}</td>
                                        <td className="px-6 py-4">{child.age} yrs</td>
                                        <td className="px-6 py-4">{child.sex}</td>
                                        <td className="px-6 py-4">{child.sessions}</td>
                                        <td className="px-6 py-4">{child.lastScreening}</td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button onClick={() => navigate(`/children/${child.id}`)} className="text-blue-600 font-medium hover:text-blue-800">View</button>
                                            <button onClick={() => navigate(`/screenings/new?childId=${child.id}`)} className="text-blue-600 font-medium hover:text-blue-800">Start Screening</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-16 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                            <UserCheck className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-medium text-slate-800 mb-2">No children found</h4>
                        <p className="text-sm text-slate-500 mb-6">You haven't added any screening profiles yet.</p>
                        <button onClick={() => navigate('/children/new')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">+ Add Child</button>
                    </div>
                )}
            </div>
            <p className="text-xs text-center text-slate-400 pb-4">AI-assisted screening support only. This system does not provide a clinical diagnosis. Results should be interpreted by a qualified professional.</p>
        </div>
    );
}