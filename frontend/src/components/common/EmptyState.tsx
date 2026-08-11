import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Icon size={24} strokeWidth={1.7} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
                {title}
            </h3>

            <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                {description}
            </p>

            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
