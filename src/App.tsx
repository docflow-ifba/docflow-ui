import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './contexts/AuthContext';
import { UserRole } from './enums/user-role.enum';
import ChatPage from './pages/dashboard/chat/ChatPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import DashboardLayout from './pages/dashboard/layout';
import NoticesPage from './pages/dashboard/notices/NoticesPage';
import OrganizationsPage from './pages/dashboard/organizations/OrganizationsPage';
import SettingsPage from './pages/dashboard/settings/SettingsPage';
import LoginPage from './pages/login/LoginPage';

function App() {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PrivateRoute />}>
        <Route path="/app" element={<DashboardLayout isAdmin={isAdmin} />}>
          {isAdmin ? (
            <>
              <Route index element={<DashboardPage />} />
              <Route path="editais" element={<NoticesPage />} />
              <Route path="organizacoes" element={<OrganizationsPage />} />
              <Route path="configuracoes" element={<SettingsPage />} />
            </>
          ) : (
            <Route index element={<Navigate to="chat" replace />} />
          )}
          <Route path="chat" element={<ChatPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
