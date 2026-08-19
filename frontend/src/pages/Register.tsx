import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { apiClient } from '../services/api';

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        if (password !== confirm) {
            setErrorMsg("Passwords do not match");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Now notify our backend to create the user doc
            // api.ts automatically attaches the token now!
            await apiClient.post('/auth/register', { name, email, role: 'psychologist' });
            navigate('/dashboard');
        } catch (error: any) {
            let userFriendlyMsg = "An unexpected error occurred during registration. Please try again.";
            if (error.code === 'auth/email-already-in-use') {
                userFriendlyMsg = "This email address is already registered. Please sign in instead.";
            } else if (error.code === 'auth/weak-password') {
                userFriendlyMsg = "Password is too weak. Please use at least 6 characters.";
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
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-800 to-teal-600 p-12 text-white flex-col justify-center">
                <h1 className="text-4xl font-bold mb-4">Mindcare AI</h1>
                <p className="text-xl text-teal-100 max-w-md">Join the platform to perform AI-assisted multimodal child screenings seamlessly.</p>

            </div>
            <div className="flex-1 flex flex-col justify-center p-8 lg:p-24">
                <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Create an Account</h2>
                    {errorMsg && (
                        <div className="flex items-start bg-red-50 border-l-4 border-red-500 p-3 mb-6 rounded shadow-sm">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                            <p className="text-sm text-red-800 font-medium">{errorMsg}</p>
                        </div>
                    )}
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} type="text" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="Dr. John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="dr.doe@clinic.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="••••••••" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                            <input value={confirm} onChange={e => setConfirm(e.target.value)} type="password" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="••••••••" />
                        </div>
                        <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition-colors mt-2">Sign Up</button>
                    </form>
                    <div className="mt-6 text-center text-sm text-slate-500">
                        Already have an account? <button onClick={() => navigate('/login')} className="text-teal-600 font-medium hover:underline">Sign in</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
