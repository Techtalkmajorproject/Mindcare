import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

import Dashboard from "../pages/Dashboard";
import Children from "../pages/Children";
import CreateChild from "../pages/CreateChild";
import ChildProfile from "../pages/ChildProfile";
import NewScreening from "../pages/NewScreening";

function Placeholder({ title }: { title: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="text-xl font-semibold text-slate-900">
                {title}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
                This page will be built in the next step.
            </p>
        </div>
    );
}

function Login() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <h1 className="text-xl font-semibold text-slate-900">
                    Login
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Login page will be implemented later.
                </p>
            </div>
        </div>
    );
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route path="/children" element={<Children />} />

                    <Route
                        path="/children/new"
                        element={<CreateChild />}
                    />

                    <Route
                        path="/children/:id"
                        element={<ChildProfile />}
                    />

                    <Route
                        path="/children/:childId/screening/new"
                        element={<NewScreening />}
                    />

                    <Route
                        path="/screenings"
                        element={<Placeholder title="Screenings" />}
                    />

                    <Route
                        path="/reports"
                        element={<Placeholder title="Reports" />}
                    />
                </Route>

                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}
