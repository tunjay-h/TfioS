export const ROUTE_SEGMENTS = {
  track: 'stars',
  movie: 'movies',
  quote: 'words',
  about: 'about',
} as const;

export type Route =
  | { type: 'home' }
  | { type: 'track'; id: string }
  | { type: 'movie'; id: string }
  | { type: 'quote'; id: string }
  | { type: 'about' };

function normalizePath(pathname: string) {
  return pathname.replace(/\/+/g, '/').replace(/\/?$/, '') || '/';
}

export function parseRouteFromLocation(): Route {
  if (typeof window === 'undefined') {
    return { type: 'home' };
  }
  const path = normalizePath(window.location.pathname);
  if (path === '/') {
    return { type: 'home' };
  }
  if (path === '/about') {
    return { type: 'about' };
  }
  const segments = path.split('/').filter(Boolean);
  const [segment, id] = segments;
  if (segment === ROUTE_SEGMENTS.track && id) {
    return { type: 'track', id };
  }
  if (segment === ROUTE_SEGMENTS.movie && id) {
    return { type: 'movie', id };
  }
  if (segment === ROUTE_SEGMENTS.quote && id) {
    return { type: 'quote', id };
  }
  return { type: 'home' };
}

export function buildPath(route: Route) {
  switch (route.type) {
    case 'home':
      return '/';
    case 'track':
      return `/${ROUTE_SEGMENTS.track}/${route.id}`;
    case 'movie':
      return `/${ROUTE_SEGMENTS.movie}/${route.id}`;
    case 'quote':
      return `/${ROUTE_SEGMENTS.quote}/${route.id}`;
    case 'about':
      return '/about';
    default:
      return '/';
  }
}

export function navigateToRoute(route: Route) {
  if (typeof window === 'undefined' || !window.history?.pushState) {
    return;
  }
  const path = buildPath(route);
  if (normalizePath(window.location.pathname) === normalizePath(path)) {
    return;
  }
  window.history.pushState({}, '', path);
}

export function buildShareUrl(route: Route) {
  if (typeof window === 'undefined') {
    return '';
  }
  const url = new URL(window.location.href);
  url.pathname = buildPath(route);
  url.search = '';
  url.hash = '';
  return url.toString();
}
