import { Bell, Search } from "lucide-react";

interface HeaderProps {
    title: string;
    description?: string;
}

export default function Header({
    title,
    description,
}: HeaderProps) {
    return (
        <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
            <div>
                <h1 className="text-xl font-semibold text-slate-900">
                    {title}
                </h1>

                {description && (
                    <p className="mt-1 text-sm text-slate-500">
                        {description}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                    aria-label="Search"
                >
                    <Search size={18} />
                </button>

                <button
                    type="button"
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                    aria-label="Notifications"
                >
                    <Bell size={18} />

                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-slate-900" />
                </button>

                <div className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    P
                </div>
            </div>
        </header>
    );
}
