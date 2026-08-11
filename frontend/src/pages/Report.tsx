import { useParams } from 'react-router-dom';
import { Save, Download, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function Report() {
    const { id } = useParams();
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState<'Draft' | 'Pending Review' | 'Approved'>('Draft');

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
                        <span className={`flex items-center px-2 py-0.5 rounded border text-xs font-bold ${status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
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
}