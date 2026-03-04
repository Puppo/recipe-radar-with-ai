import { Navigate, useSearchParams } from 'react-router-dom';

export function SearchRedirect() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  const to = filter ? `/?filter=${encodeURIComponent(filter)}` : '/';
  return <Navigate to={to} replace />;
}
