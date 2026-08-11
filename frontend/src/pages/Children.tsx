import {
    CalendarDays,
    ChevronRight,
    Plus,
    Search,
    Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

import EmptyState from "../components/common/EmptyState";
import { getChildren } from "../services/child.service";
import type { Child } from "../types/child";

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

function formatSex(sex: Child["sex"]) {
    switch (sex) {
        case "male":
            return "Male";
        case "female":
            return "Female";
        case "other":
            return "Other";
        default:
            return "Prefer not to say";
    }
}

export default function Children() {
    const [children] = useState<Child[]>(() => getChildren());
    const [search, setSearch] = useState("");

    const filteredChildren = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) {
            return children;
        }

        return children.filter((child) =>
            child.screeningId.toLowerCase().includes(value),
        );
    }, [children, search]);

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Children
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage screening profiles and review previous sessions.
                    </p>
                </div>

                <Link
                    to="/children/new"
                    className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                    <Plus size={17} />
                    Add Child
                </Link>
            </div>

            {/* Search */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="relative max-w-md">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by screening ID"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <Users size={19} />
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Screening Profiles
                            </h3>

                            <p className="mt-0.5 text-xs text-slate-500">
                                {children.length} profile
                                {children.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>
                </div>

                {filteredChildren.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title={
                            children.length === 0
                                ? "No children added yet"
                                : "No matching profiles"
                        }
                        description={
                            children.length === 0
                                ? "Create a screening profile to begin a new child assessment."
                                : "Try searching with a different screening ID."
                        }
                        action={
                            children.length === 0 ? (
                                <Link
                                    to="/children/new"
                                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                                >
                                    <Plus size={16} />
                                    Add Child
                                </Link>
                            ) : undefined
                        }
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px]">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/70">
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Screening ID
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Age
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Sex
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Created
                                    </th>

                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredChildren.map((child) => (
                                    <tr
                                        key={child.id}
                                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-medium text-slate-900">
                                                {child.screeningId}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {child.age}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {formatSex(child.sex)}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <CalendarDays size={15} className="text-slate-400" />
                                                {formatDate(child.createdAt)}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/children/${child.id}`}
                                                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                            >
                                                View
                                                <ChevronRight size={15} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
