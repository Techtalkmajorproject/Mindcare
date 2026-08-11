const fs = require('fs');
const path = require('path');

const files = {
    // --- LAYOUT ---
    'src/components/layout/Sidebar.tsx': `import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, FileText, LogOut } from 'lucide-react';

export default function Sidebar() {
    const navItems = [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/children', label: 'Children', icon: Users },
        { to: '/screenings', label: 'Screenings', icon: Activity },
        { to: '/reports', label: 'Reports', icon: FileText }
    ];

    return (
        <div className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-slate-200">
                <span className="text-lg font-bold text-slate-800">Mindcare AI</span>
            </div>
            
            <nav className="flex-1 py-4 px-3 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => 
                                \`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors \${
                                    isActive 
                                        ? 'bg-blue-50 text-blue-700' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }\`
                            }
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-200">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-700">DR</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700">Dr. Sarah Smith</p>
                        <p className="text-xs text-slate-500">Psychologist</p>
                    </div>
                </div>
                <NavLink to="/login" className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </NavLink>
            </div>
        </div>
    );
}`,
    'src/components/layout/Header.tsx': `import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const getPageInfo = (pathname: string) => {
    if (pathname.includes('/screenings/')) return { title: 'Screening Workspace', desc: 'Active screening session' };
    if (pathname.includes('/children/new')) return { title: 'Add Child', desc: 'Create a new screening profile' };
    if (pathname.includes('/children/')) return { title: 'Child Profile', desc: 'Screening history and details' };
    if (pathname === '/children') return { title: 'Children', desc: 'Manage screening profiles and previous sessions.' };
    if (pathname === '/dashboard') return { title: 'Dashboard', desc: 'Monitor screening sessions and review findings.' };
    if (pathname === '/screenings') return { title: 'Screenings', desc: 'View all past screenings.' };
    if (pathname === '/reports') return { title: 'Reports', desc: 'Review and manage AI-assisted screening reports.' };
    return { title: 'Application', desc: '' };
};

export default function Header() {
    const location = useLocation();
    const { title, desc } = getPageInfo(location.pathname);

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
            <div>
                <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
                <p className="text-sm text-slate-500 hidden sm:block">{desc}</p>
            </div>
            
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>
    );
}`,
    'src/components/layout/AppLayout.tsx': `import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}`,
    'src/routes/AppRoutes.tsx': `import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Children from '../pages/Children';
import CreateChild from '../pages/CreateChild';
import ChildProfile from '../pages/ChildProfile';
import ScreeningWorkspace from '../pages/ScreeningWorkspace';
import AnalysisProgress from '../pages/AnalysisProgress';
import Results from '../pages/Results';
import Report from '../pages/Report';

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/children" element={<Children />} />
                    <Route path="/children/new" element={<CreateChild />} />
                    <Route path="/children/:id" element={<ChildProfile />} />
                    <Route path="/screenings/:id/workspace" element={<ScreeningWorkspace />} />
                    <Route path="/screenings/:id/analyze" element={<AnalysisProgress />} />
                    <Route path="/screenings/:id/results" element={<Results />} />
                    <Route path="/screenings/:id/report" element={<Report />} />
                    <Route path="/screenings" element={<div className="p-4 bg-white rounded-lg shadow-sm">All Screenings</div>} />
                    <Route path="/reports" element={<div className="p-4 bg-white rounded-lg shadow-sm">All Reports</div>} />
                </Route>
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}`,
    'src/pages/Login.tsx': `import { useNavigate } from 'react-router-dom';
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
}`,
    'src/pages/Dashboard.tsx': `import { useNavigate } from 'react-router-dom';
import { Users, Activity, FileText, CheckCircle } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Child Screening Dashboard</h2>
                    <p className="text-sm text-slate-500">Monitor screening sessions and review AI-assisted findings.</p>
                </div>
                <button onClick={() => navigate('/children/new')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">+ New Screening</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[ 
                    { label: 'Total Children', val: '—', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
                    { label: 'Active Screenings', val: '—', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
                    { label: 'Pending Reviews', val: '—', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100' },
                    { label: 'Completed Reports', val: '—', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-slate-600">{stat.label}</span>
                            <div className={\`w-8 h-8 rounded-full flex items-center justify-center \${stat.bg}\`}>
                                <stat.icon className={\`w-4 h-4 \${stat.color}\`} />
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
                <div className="p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Activity className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-800 mb-1">No screening sessions yet</h4>
                    <p className="text-sm text-slate-500 mb-6">Start a screening session to begin gathering data.</p>
                    <button onClick={() => navigate('/children')} className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors">View Children</button>
                </div>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto shadow-sm">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                    <h4 className="font-semibold text-blue-900 mb-1">SCREENING WORKFLOW</h4>
                    <p className="text-xs text-blue-600 max-w-xs">End-to-end multimodal screening process</p>
                </div>
                <div className="hidden sm:block h-8 w-px bg-blue-200 mx-4"></div>
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-600 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                    <span className="bg-white px-2 py-1 rounded shadow-sm">Drawing</span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-white px-2 py-1 rounded shadow-sm">Facial Obs.</span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-white px-2 py-1 rounded shadow-sm">Context</span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded shadow-sm">Multimodal Analysis</span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded shadow-sm border border-blue-100">Report</span>
                </div>
            </div>
            <p className="text-xs text-center text-slate-400 pb-4">AI-assisted screening support only. This system does not provide a clinical diagnosis. Results should be interpreted by a qualified professional.</p>
        </div>
    );
}`
};

Object.entries(files).forEach(([filepath, content]) => {
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, content);
});
console.log('UI Generator step 1 complete.');
