export interface Playlist {
  id: number;
  name: string;
  description: string;
  userId: number;
}

export interface PlaylistResponse {
  playlists: Playlist[];
}
