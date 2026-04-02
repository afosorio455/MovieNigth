export type Movie = {
  id: string;
  title: string;
  year: string | null;
  created_by_user_id: string;
  created_at: number;
  synced: 0 | 1;
};

export type User = {
  id: string;
  name: string;
  avatar_color: string;
  created_at: number;
};

export type Vote = {
  id: string;
  movie_id: string;
  user_id: string;
  vote_type: 'like' | 'dislike';
  created_at: number;
  synced: 0 | 1;
};

export type SyncMetadata = {
  id: string;
  last_sync_timestamp: number;
};

// Movie con conteos de votos agregados (resultado de JOIN con votes)
export type MovieWithVotes = Movie & {
  likes: number;
  dislikes: number;
  userVote: 'like' | 'dislike' | null;
};
