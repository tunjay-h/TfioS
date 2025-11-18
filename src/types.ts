export type Track = {
  id: string;
  title: string;
  artist: string;
  year: number;
  embedUrl: string | null;
  openUrl: string;
};

export type PlaylistMeta = {
  title: string;
  description: string;
  bgTrack: {
    title: string;
    artist: string;
    note: string;
    src: string;
    volume: number;
  };
};

export type Playlist = {
  meta: PlaylistMeta;
  tracks: Track[];
};

export type Movie = {
  id: string;
  slug: string;
  title: string;
  year: number;
  poster: string;
  plot: string;
  imdbUrl: string;
  trailerEmbedUrl: string;
};

export type Quote = {
  id: string;
  text: string;
  author: string;
};
