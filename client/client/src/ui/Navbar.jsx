import { useAuth } from '../auth/AuthContext';
import MoodBadge from '../features/mood/MoodBadge';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="navbar-brand">🎭 DramaDo</div>
        <div className="navbar-user">
          <MoodBadge user={user} />
          <span>👤 {user.name}</span>
          <button onClick={logout} className="btn btn-secondary btn-small">Logout</button>
        </div>
      </div>
    </nav>
  );
}