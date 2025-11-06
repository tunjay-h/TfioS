export type Track = {
  id: string;
  title: string;
  artist: string;
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
