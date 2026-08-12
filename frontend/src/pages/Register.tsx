import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-800 to-blue-600 p-12 text-white flex-col justify-center">
                <h1 className="text-4xl font-bold mb-4">Mindcare AI</h1>
                <p className="text-xl text-blue-100 max-w-md">Join the platform to perform AI-assisted multimodal child screenings seamlessly.</p>
                <div className="mt-8 p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                    <h3 className="font-medium">Confidentiality Notice</h3>
                    <p className="text-sm mt-2 text-blue-50">This system is designed exclusively for authorized child psychologists and medical professionals.</p>
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-center p-8 lg:p-24">
                <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Create an Account</h2>
                    <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input type="text" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Dr. John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input type="email" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="dr.doe@clinic.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input type="password" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="••••••••" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                            <input type="password" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="••••••••" />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors mt-2">Sign Up</button>
                    </form>
                    <div className="mt-6 text-center text-sm text-slate-500">
                        Already have an account? <button onClick={() => navigate('/login')} className="text-blue-600 font-medium hover:underline">Sign in</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
