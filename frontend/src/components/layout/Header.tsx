import { Bell, Search, Menu } from 'lucide-react';
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

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
    const location = useLocation();
    const { title, desc } = getPageInfo(location.pathname);

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30">
            <div className="flex items-center space-x-4">
                <button onClick={toggleSidebar} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 hover:bg-slate-200 rounded-lg">
                    <Menu className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
                    <p className="text-sm text-slate-500 hidden sm:block">{desc}</p>
                </div>
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
}