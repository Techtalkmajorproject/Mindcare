import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Children from '../pages/Children';
import CreateChild from '../pages/CreateChild';
import ChildProfile from '../pages/ChildProfile';
import ScreeningWorkspace from '../pages/ScreeningWorkspace';
import AnalysisProgress from '../pages/AnalysisProgress';
import Results from '../pages/Results';
import Report from '../pages/Report';
import NewScreening from '../pages/NewScreening';

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/children" element={<Children />} />
                    <Route path="/children/new" element={<CreateChild />} />
                    <Route path="/children/:id" element={<ChildProfile />} />
                    <Route path="/children/:childId/screening/new" element={<NewScreening />} />
                    <Route path="/screenings/:id/workspace" element={<ScreeningWorkspace />} />
                    <Route path="/screenings/:id/analyze" element={<AnalysisProgress />} />
                    <Route path="/screenings/:id/results" element={<Results />} />
                    <Route path="/screenings/:id/report" element={<Report />} />
                    <Route path="/screenings" element={<div className="p-4 bg-white rounded-lg shadow-sm">All Screenings</div>} />
                    <Route path="/reports" element={<div className="p-4 bg-white rounded-lg shadow-sm">All Reports</div>} />
                </Route>
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}