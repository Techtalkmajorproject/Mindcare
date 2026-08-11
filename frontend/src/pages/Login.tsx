import { useNavigate } from 'react-router-dom';
export default function Login() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-slate-50 flex">
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 text-white flex-col justify-center">
                <h1 className="text-4xl font-bold mb-4">Mindcare AI</h1>
                <p className="text-xl text-blue-100 max-w-md">AI-assisted multimodal child screening and referral support.</p>
                <div className="mt-8 p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                    <h3 className="font-medium">Confidentiality Notice</h3>
                    <p className="text-sm mt-2 text-blue-50">This system is for authorized professional use only.</p>
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-center p-8 lg:p-24">
                <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Psychologist Login</h2>
                    <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input type="email" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="dr.smith@clinic.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input type="password" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="••••••••" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-slate-600">
                                <input type="checkbox" className="mr-2" /> Remember me
                            </label>
                            <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    );
}