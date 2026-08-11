import {
    ArrowRight,
    Brain,
    FileCheck2,
    Users,
    ClipboardList,
} from "lucide-react";

const stats = [
    {
        title: "Total Children",
        value: "—",
        description: "No data available",
        icon: Users,
    },
    {
        title: "Active Screenings",
        value: "—",
        description: "No data available",
        icon: ClipboardList,
    },
    {
        title: "Pending Reviews",
        value: "—",
        description: "No data available",
        icon: Brain,
    },
    {
        title: "Completed Reports",
        value: "—",
        description: "No data available",
        icon: FileCheck2,
    },
];

const workflow = [
    {
        number: "01",
        title: "Drawing",
        description:
            "Analyze the child's drawing for observable visual and emotional patterns.",
    },
    {
        number: "02",
        title: "Facial Observation",
        description:
            "Capture a short facial-expression observation.",
    },
    {
        number: "03",
        title: "Context",
        description:
            "Add the contextual information required by the screening workflow.",
    },
    {
        number: "04",
        title: "Multimodal Analysis",
        description:
            "Combine available modality outputs into screening indicators.",
    },
    {
        number: "05",
        title: "Report",
        description:
            "Review the findings and prepare the psychologist report.",
    },
];

export default function Dashboard() {
    return (
        <div className="mx-auto max-w-7xl space-y-8">
            {/* Welcome */}
            <section>
                <div className="rounded-2xl bg-slate-900 p-8 text-white">
                    <div className="max-w-2xl">
                        <p className="mb-2 text-sm font-medium text-slate-300">
                            Screening workspace
                        </p>

                        <h2 className="text-3xl font-semibold tracking-tight">
                            Multimodal Child Screening
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                            Conduct structured screening sessions using drawing,
                            facial observation and contextual information to support
                            professional review.
                        </p>

                        <button
                            type="button"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                        >
                            Start New Screening
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="rounded-2xl border border-slate-200 bg-white p-5"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">
                                        {stat.title}
                                    </p>

                                    <p className="mt-3 text-3xl font-semibold text-slate-900">
                                        {stat.value}
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                    <Icon size={19} />
                                </div>
                            </div>

                            <p className="mt-3 text-xs text-slate-400">
                                {stat.description}
                            </p>
                        </div>
                    );
                })}
            </section>

            {/* Recent Screenings */}
            <section className="rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            Recent Screenings
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Your latest screening sessions will appear here.
                        </p>
                    </div>
                </div>

                <div className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                        <ClipboardList size={24} />
                    </div>

                    <h4 className="mt-4 text-sm font-semibold text-slate-900">
                        No screening sessions yet
                    </h4>

                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                        Start a screening session to begin collecting
                        multimodal observations.
                    </p>

                    <button
                        type="button"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                        Start Screening
                        <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            {/* Workflow */}
            <section>
                <div className="mb-4">
                    <h3 className="font-semibold text-slate-900">
                        Screening Workflow
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        The screening process combines multiple sources of
                        information before generating a report.
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-5">
                    {workflow.map((step, index) => (
                        <div
                            key={step.number}
                            className="relative rounded-2xl border border-slate-200 bg-white p-5"
                        >
                            <span className="text-xs font-semibold tracking-wider text-slate-400">
                                {step.number}
                            </span>

                            <h4 className="mt-3 font-semibold text-slate-900">
                                {step.title}
                            </h4>

                            <p className="mt-2 text-sm leading-5 text-slate-500">
                                {step.description}
                            </p>

                            {index < workflow.length - 1 && (
                                <ArrowRight
                                    size={16}
                                    className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-slate-300 lg:block"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Disclaimer */}
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4">
                <p className="text-xs leading-5 text-slate-500">
                    This system is designed as AI-assisted screening support.
                    It does not provide a clinical diagnosis. Results should be
                    interpreted by a qualified professional.
                </p>
            </div>
        </div>
    );
}
