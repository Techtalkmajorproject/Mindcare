import {
    ArrowLeft,
    ArrowRight,
    Camera,
    ClipboardCheck,
    FileText,
    Image,
    Layers3,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

// Mock child data

const steps = [
    {
        number: "01",
        title: "Drawing",
        description: "Capture the child's drawing.",
        icon: Image,
    },
    {
        number: "02",
        title: "Facial Observation",
        description: "Record facial-expression observations.",
        icon: Camera,
    },
    {
        number: "03",
        title: "Context",
        description: "Provide required screening context.",
        icon: ClipboardCheck,
    },
    {
        number: "04",
        title: "Analysis",
        description: "Process the available modalities.",
        icon: Layers3,
    },
    {
        number: "05",
        title: "Report",
        description: "Review the screening findings.",
        icon: FileText,
    },
];

export default function NewScreening() {
    const { childId } = useParams();

    const child = childId ? { id: childId, screeningId: childId, age: 6 } : null;

    if (!child) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <h2 className="font-semibold text-slate-900">
                    Screening profile not found
                </h2>

                <Link
                    to="/children"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
                >
                    <ArrowLeft size={16} />
                    Back to Children
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl space-y-8">
            {/* Back */}
            <Link
                to={`/children/${child.id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
                <ArrowLeft size={16} />
                Back to Profile
            </Link>

            {/* Header */}
            <section>
                <p className="text-sm font-medium text-slate-400">
                    {child.screeningId}
                </p>

                <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                    New Screening Session
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Complete the screening workflow to collect the child's
                    drawing, facial observation and contextual information for
                    multimodal analysis.
                </p>
            </section>

            {/* Workflow */}
            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {steps.map((step) => {
                    const Icon = step.icon;

                    return (
                        <div
                            key={step.number}
                            className="rounded-2xl border border-slate-200 bg-white p-5"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold tracking-wider text-slate-400">
                                    {step.number}
                                </span>

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                    <Icon size={17} />
                                </div>
                            </div>

                            <h3 className="mt-5 font-semibold text-slate-900">
                                {step.title}
                            </h3>

                            <p className="mt-2 text-sm leading-5 text-slate-500">
                                {step.description}
                            </p>
                        </div>
                    );
                })}
            </section>

            {/* Session Card */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="p-8">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Screening session
                        </p>

                        <h3 className="mt-2 text-xl font-semibold text-slate-900">
                            Ready to begin
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            The first stage will provide a drawing workspace where
                            the child's drawing can be captured. The camera
                            observation will be handled alongside the drawing
                            session.
                        </p>
                    </div>

                    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-800">
                            Screening profile
                        </p>

                        <div className="mt-3 flex flex-wrap gap-6 text-sm">
                            <div>
                                <span className="text-slate-400">ID</span>
                                <p className="mt-1 font-mono font-medium text-slate-800">
                                    {child.screeningId}
                                </p>
                            </div>

                            <div>
                                <span className="text-slate-400">Age</span>
                                <p className="mt-1 font-medium text-slate-800">
                                    {child.age} years
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end border-t border-slate-200 bg-slate-50/60 px-8 py-4">
                    <Link
                        to={`/screenings/new/drawing?childId=${child.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                        Begin Screening
                        <ArrowRight size={17} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
