import { useNavigate } from 'react-router';
import { Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="text-6xl font-bold text-[var(--text-neutral-450)] mb-4">404</div>
      <div className="text-[var(--text-primary)] text-xl font-semibold mb-2">Page Not Found</div>
      <p className="text-[var(--text-neutral-450)] text-sm mb-6">The page you're looking for doesn't exist or you don't have access.</p>
      <button onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 text-[var(--background)] rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
        <Home className="w-4 h-4" /> Go to Dashboard
      </button>
    </div>
  );
}
