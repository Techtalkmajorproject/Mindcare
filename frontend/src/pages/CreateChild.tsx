import { useNavigate } from 'react-router-dom';

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
}