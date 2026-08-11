import { NavLink } from 'react-router-dom';
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
                                `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isActive 
                                        ? 'bg-blue-50 text-blue-700' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`
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
}