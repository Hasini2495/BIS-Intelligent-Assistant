import { Home, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="text-center">
        <SearchX className="mx-auto h-12 w-12 text-slate-400" />

        <p className="mt-5 text-sm font-semibold text-slate-500">404</p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Page not found
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}