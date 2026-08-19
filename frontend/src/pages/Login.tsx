import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (error: any) {
            let userFriendlyMsg = "An unexpected error occurred during login. Please try again.";
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                userFriendlyMsg = "Invalid email or password. Please try again.";
            } else if (error.code === 'auth/too-many-requests') {
                userFriendlyMsg = "Account temporarily disabled due to too many failed attempts. Try again later.";
            } else if (error.code === 'auth/invalid-email') {
                userFriendlyMsg = "Please enter a valid email address.";
            } else if (error.message) {
                userFriendlyMsg = error.message;
            }
            setErrorMsg(userFriendlyMsg);
        }
    };
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
                    {errorMsg && (
                        <div className="flex items-start bg-red-50 border-l-4 border-red-500 p-3 mb-6 rounded shadow-sm">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                            <p className="text-sm text-red-800 font-medium">{errorMsg}</p>
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="dr.smith@clinic.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="••••••••" />
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <label className="flex items-center text-slate-600">
                                <input type="checkbox" className="mr-2" /> Remember me
                            </label>
                            <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">Sign In</button>
                    </form>
                    <div className="mt-6 text-center text-sm text-slate-500">
                        Don't have an account? <button onClick={() => navigate('/register')} className="text-blue-600 font-medium hover:underline">Sign up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}