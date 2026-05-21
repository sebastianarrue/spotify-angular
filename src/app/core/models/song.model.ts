export interface Song {
  _id: string;
  title: string;
  album: string;
  author: string;
  imageUrl: string;
}

export interface SongResponse {
  message: string;
  songs: Song[];
  totalItems: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
