import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ScientistDashboard from '@/components/dashboard/ScientistDashboard';
import UserDashboard from '@/components/dashboard/UserDashboard';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect to login
  }

  if (user.role === 'scientist') {
    return <ScientistDashboard />;
  }

  if (user.role === 'user') {
    return <UserDashboard />;
  }

  return null;
};

export default Index;
