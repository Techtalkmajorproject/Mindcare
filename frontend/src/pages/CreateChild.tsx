import { ArrowLeft, ShieldCheck, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createChild } from "../services/child.service";
import type { ChildSex } from "../types/child";

export default function CreateChild() {
    const navigate = useNavigate();

    const [age, setAge] = useState("");
    const [sex, setSex] = useState<ChildSex | "">("");
    const [error, setError] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const numericAge = Number(age);

        if (!age) {
            setError("Please enter the child's age.");
            return;
        }

        if (!Number.isInteger(numericAge) || numericAge < 1 || numericAge > 18) {
            setError("Please enter a valid age between 1 and 18.");
            return;
        }

        if (!sex) {
            setError("Please select the child's sex.");
            return;
        }

        const child = createChild({
            age: numericAge,
            sex,
        });

        navigate(`/children/${child.id}`);
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {/* Back */}
            <Link
                to="/children"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
                <ArrowLeft size={16} />
                Back to Children
            </Link>

            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Create Screening Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Create a profile before starting the child's screening
                    session.
                </p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
                <div className="border-b border-slate-200 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <UserRound size={19} />
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Child Information
                            </h3>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Only information required for the screening workflow
                                is collected.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 p-6">
                    {/* Age */}
                    <div>
                        <label
                            htmlFor="age"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Age
                        </label>

                        <input
                            id="age"
                            type="number"
                            min="1"
                            max="18"
                            value={age}
                            onChange={(event) => setAge(event.target.value)}
                            placeholder="Enter age"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        />

                        <p className="mt-2 text-xs text-slate-400">
                            Enter the child's age in completed years.
                        </p>
                    </div>

                    {/* Sex */}
                    <div>
                        <label
                            htmlFor="sex"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Sex
                        </label>

                        <select
                            id="sex"
                            value={sex}
                            onChange={(event) =>
                                setSex(event.target.value as ChildSex | "")
                            }
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">
                                Prefer not to say
                            </option>
                        </select>
                    </div>

                    {/* Privacy notice */}
                    <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <ShieldCheck
                            size={19}
                            className="mt-0.5 shrink-0 text-slate-500"
                        />

                        <div>
                            <p className="text-sm font-medium text-slate-800">
                                Screening information
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                The profile is used to associate screening sessions
                                and analysis results with the correct child. Avoid
                                entering unnecessary personal information.
                            </p>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div
                            role="alert"
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                            {error}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/60 px-6 py-4">
                    <Link
                        to="/children"
                        className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                        Create Profile
                    </button>
                </div>
            </form>
        </div>
    );
}
