import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getUser, isLoggedIn } from './lib/auth';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Explore from './pages/Explore';
import OfferingDetail from './pages/OfferingDetail';

import HostDashboard from './pages/host/HostDashboard';
import HostOfferings from './pages/host/HostOfferings';
import OfferingForm from './pages/host/OfferingForm';
import HostBookings from './pages/host/HostBookings';

import TravellerDashboard from './pages/traveller/TravellerDashboard';

function RequireAuth({ children, role }) {
  const user = getUser();
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/offering/:id" element={<OfferingDetail />} />

        {/* Host routes */}
        <Route path="/host/dashboard" element={<RequireAuth role="host"><HostDashboard /></RequireAuth>} />
        <Route path="/host/offerings" element={<RequireAuth role="host"><HostOfferings /></RequireAuth>} />
        <Route path="/host/offerings/new" element={<RequireAuth role="host"><OfferingForm /></RequireAuth>} />
        <Route path="/host/offerings/:id/edit" element={<RequireAuth role="host"><OfferingForm /></RequireAuth>} />
        <Route path="/host/bookings" element={<RequireAuth role="host"><HostBookings /></RequireAuth>} />

        {/* Traveller routes */}
        <Route path="/traveller/dashboard" element={<RequireAuth role="traveller"><TravellerDashboard /></RequireAuth>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
