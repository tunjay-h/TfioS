export function getTrackIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const { searchParams } = new URL(window.location.href);
  return searchParams.get('t');
}

export function updateTrackIdInUrl(trackId: string | null) {
  if (typeof window === 'undefined' || !window.history?.pushState) return;
  const url = new URL(window.location.href);
  if (trackId) {
    url.searchParams.set('t', trackId);
  } else {
    url.searchParams.delete('t');
  }
  window.history.pushState({}, '', url);
}
