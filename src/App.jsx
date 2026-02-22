import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { JobsList } from './pages/JobsList';
import { HackathonsList } from './pages/HackathonsList';
import { ReferralsList } from './pages/ReferralsList';
import { CreateJob } from './pages/CreateJob';
import { CreateHackathon } from './pages/CreateHackathon';
import { Analytics } from './pages/Analytics';
import { TalentPool } from './pages/TalentPool';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="jobs/internships" element={<JobsList />} />
        <Route path="jobs/full-time" element={<JobsList />} />
        <Route path="jobs/create" element={<CreateJob />} />
        <Route path="hackathons" element={<HackathonsList />} />
        <Route path="hackathons/create" element={<CreateHackathon />} />
        <Route path="referrals" element={<ReferralsList />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="talent-pool" element={<TalentPool />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </AppProvider>
  );
}
