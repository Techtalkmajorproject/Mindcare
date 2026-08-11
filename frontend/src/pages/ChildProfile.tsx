import {
    ArrowLeft,
    CalendarDays,
    ClipboardList,
    Play,
    UserRound,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { getChildById } from "../services/child.service";

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
}

function formatSex(sex: string) {
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

export default function ChildProfile() {
    const { id } = useParams();

    const child = id ? getChildById(id) : null;

    if (!child) {
        return (
            <div className="mx-auto max-w-3xl">
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                        <UserRound size={24} />
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-slate-900">
                        Screening profile not found
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        The requested child profile could not be found.
                    </p>

                    <Link
                        to="/children"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
                    >
                        <ArrowLeft size={16} />
                        Back to Children
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {/* Back */}
            <Link
                to="/children"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
                <ArrowLeft size={16} />
                Back to Children
            </Link>

            {/* Profile Header */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="bg-slate-900 px-8 py-8 text-white">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                                <UserRound size={28} />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Screening Profile
                                </p>

                                <h2 className="mt-1 font-mono text-2xl font-semibold">
                                    {child.screeningId}
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Created {formatDate(child.createdAt)}
                                </p>
                            </div>
                        </div>

                        <Link
                            to={`/children/${child.id}/screening/new`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                        >
                            <Play size={17} />
                            Start New Screening
                        </Link>
                    </div>
                </div>

                <div className="grid divide-y divide-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">
                    <div className="p-6">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                            Age
                        </p>

                        <p className="mt-2 text-lg font-semibold text-slate-900">
                            {child.age} years
                        </p>
                    </div>

                    <div className="p-6">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                            Sex
                        </p>

                        <p className="mt-2 text-lg font-semibold text-slate-900">
                            {formatSex(child.sex)}
                        </p>
                    </div>

                    <div className="p-6">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                            Screening Sessions
                        </p>

                        <p className="mt-2 text-lg font-semibold text-slate-900">
                            0
                        </p>
                    </div>
                </div>
            </section>

            {/* Screening History */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <ClipboardList size={19} />
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Screening History
                            </h3>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Previous screening sessions will appear here.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                        <CalendarDays size={23} />
                    </div>

                    <h4 className="mt-4 text-sm font-semibold text-slate-900">
                        No screening sessions
                    </h4>

                    <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                        Start a screening session to collect drawing,
                        facial-observation and contextual information.
                    </p>

                    <Link
                        to={`/children/${child.id}/screening/new`}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                        <Play size={16} />
                        Start Screening
                    </Link>
                </div>
            </section>
        </div>
    );
}
