import { Navigate } from 'react-router-dom';
import { useCaseStore } from '../store';
import Layout from './Layout';

export default function ProtectedRoute({ children }) {
  const userName = useCaseStore((state) => state.userName);

  if (!userName) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}
