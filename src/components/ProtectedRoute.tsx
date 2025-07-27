import { useApp } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { state } = useApp();

  if (!state.isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (roles && state.user && !roles.includes(state.user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;