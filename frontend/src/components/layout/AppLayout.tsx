import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function getPageInfo(pathname: string) {
    if (pathname.startsWith("/children")) {
        return {
            title: "Children",
            description: "Manage child screening profiles and sessions.",
        };
    }

    if (pathname.startsWith("/screenings")) {
        return {
            title: "Screening",
            description: "Conduct and review a multimodal screening session.",
        };
    }

    if (pathname.startsWith("/reports")) {
        return {
            title: "Reports",
            description: "Review and manage screening reports.",
        };
    }

    return {
        title: "Dashboard",
        description: "Overview of child screening activity.",
    };
}

export default function AppLayout() {
    const location = useLocation();
    const page = getPageInfo(location.pathname);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <Header
                    title={page.title}
                    description={page.description}
                />

                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
