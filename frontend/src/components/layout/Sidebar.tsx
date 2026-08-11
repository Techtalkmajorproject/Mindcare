import {
    BarChart3,
    FileText,
    LayoutDashboard,
    LogOut,
    Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Children",
        path: "/children",
        icon: Users,
    },
    {
        name: "Screenings",
        path: "/screenings",
        icon: BarChart3,
    },
    {
        name: "Reports",
        path: "/reports",
        icon: FileText,
    },
];

export default function Sidebar() {
    return (
        <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
            <div className="flex h-20 items-center border-b border-slate-200 px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                        MC
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            Multimodal
                        </p>
                        <p className="text-xs text-slate-500">
                            Child Screening
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-6">
                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Workspace
                </p>

                {navigation.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                [
                                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                                    isActive
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                                ].join(" ")
                            }
                        >
                            <Icon size={18} strokeWidth={1.8} />
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="border-t border-slate-200 p-4">
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                        P
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                            Psychologist
                        </p>
                        <p className="truncate text-xs text-slate-500">
                            Screening account
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                    <LogOut size={18} strokeWidth={1.8} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
