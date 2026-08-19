import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, FileText, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const { user, logout } = useAuth();
    const navItems = [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/children', label: 'Children', icon: Users },
        { to: '/screenings', label: 'Screenings', icon: Activity },
        { to: '/reports', label: 'Reports', icon: FileText }
    ];

    const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'U';

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 h-full overflow-y-auto flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out shadow-xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 flex-shrink-0">
                    <span className="text-lg font-bold text-slate-800">Mindcare AI</span>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 bg-slate-50 hover:bg-slate-100 rounded-md">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 py-4 px-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
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

                <div className="p-4 border-t border-slate-200 flex-shrink-0">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-blue-700">{initials}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-700 truncate">{user?.name || user?.email || 'User'}</p>
                            <p className="text-xs text-slate-500 capitalize truncate">{user?.role || 'Guest'}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}