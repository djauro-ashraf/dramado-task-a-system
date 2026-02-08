import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import authApi from '../auth/authApi';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  useEffect(() => {
    const run = async () => {
      const token = params.get('token');
      if (!token) {
        navigate('/login?error=missing_token', { replace: true });
        return;
      }

      localStorage.setItem('token', token);

      try {
        const me = await authApi.getCurrentUser();
        updateUser(me);
        navigate('/dashboard', { replace: true });
      } catch (e) {
        localStorage.removeItem('token');
        navigate('/login?error=oauth_failed', { replace: true });
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-center">
      <div className="card">
        <h2>🎭 Finishing your dramatic login…</h2>
        <p>Please wait. The curtains are opening.</p>
      </div>
    </div>
  );
}
