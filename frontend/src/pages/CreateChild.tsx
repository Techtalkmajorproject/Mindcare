import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { childService } from '../services/child.service';

export default function CreateChild() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        age: '',
        gender: '',
        parentName: '',
        parentContact: '',
        primaryIssue: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await childService.createChild(formData);
            if (res.data && res.data.success) {
                navigate(`/children/${res.data.childId}`);
            }
        } catch (error) {
            console.error('Failed to create child profile:', error);
            alert('Failed to create child profile.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. John Doe" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                            <input type="date" name="dateOfBirth" required value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Age (Years)</label>
                            <input type="number" name="age" required min="3" max="18" value={formData.age} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. 6" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                        <div className="flex space-x-4">
                            {['Male', 'Female', 'Other'].map((g) => (
                                <label key={g} className="flex items-center space-x-2">
                                    <input type="radio" name="gender" required value={g} checked={formData.gender === g} onChange={handleChange} className="text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm text-slate-700">{g}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Parent Name</label>
                            <input type="text" name="parentName" required value={formData.parentName} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Jane Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Parent Contact</label>
                            <input type="text" name="parentContact" required value={formData.parentContact} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. 555-0123" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Primary Issue / Presenting Problem</label>
                        <textarea name="primaryIssue" required rows={3} value={formData.primaryIssue} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" placeholder="Briefly describe the reason for screening..."></textarea>
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