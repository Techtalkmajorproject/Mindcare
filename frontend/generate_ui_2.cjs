const fs = require('fs');
const path = require('path');

const files = {
    'src/pages/Children.tsx': `import { useNavigate } from 'react-router-dom';
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
                                            <button onClick={() => navigate(\`/children/\${child.id}\`)} className="text-blue-600 font-medium hover:text-blue-800">View</button>
                                            <button onClick={() => navigate(\`/screenings/new?childId=\${child.id}\`)} className="text-blue-600 font-medium hover:text-blue-800">Start Screening</button>
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
}`,
    'src/pages/CreateChild.tsx': `import { useNavigate } from 'react-router-dom';

export default function CreateChild() {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Frontend only logic for now
        navigate('/children/CH-NEW123');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Create Screening Profile</h2>
                <p className="text-sm text-slate-500">Add a new child profile to start a screening session.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Age (Years)</label>
                        <input 
                            type="number" 
                            required 
                            min="3" 
                            max="18"
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                            placeholder="e.g. 6" 
                        />
                        <p className="mt-1 text-xs text-slate-500">Must be between 3 and 18 years.</p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Sex</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="sex" required value="Male" className="text-blue-600 focus:ring-blue-500" />
                                <span className="text-sm text-slate-700">Male</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="sex" required value="Female" className="text-blue-600 focus:ring-blue-500" />
                                <span className="text-sm text-slate-700">Female</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="sex" required value="Other" className="text-blue-600 focus:ring-blue-500" />
                                <span className="text-sm text-slate-700">Other</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
                        <button type="button" onClick={() => navigate('/children')} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors">Cancel</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">Create Screening Profile</button>
                    </div>
                </form>
            </div>
            
            <p className="text-xs text-center text-slate-400 pb-4 mt-6">AI-assisted screening support only. This system does not provide a clinical diagnosis.</p>
        </div>
    );
}`,
    'src/pages/ChildProfile.tsx': `import { useNavigate, useParams } from 'react-router-dom';
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
                <button onClick={() => navigate(\`/screenings/new-session?id=\${id}\`)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">Start New Screening</button>
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
                    <button onClick={() => navigate(\`/screenings/\${id}/workspace\`)} className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors">Start Screening</button>
                </div>
            </div>
            
            <p className="text-xs text-center text-slate-400 pb-4">AI-assisted screening support only. This system does not provide a clinical diagnosis.</p>
        </div>
    );
}`
};

Object.entries(files).forEach(([filepath, content]) => {
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, content);
});
console.log('UI Generator step 2 complete.');
