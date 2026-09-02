export type ErrorResponse = {
  error: string;
};

export type SearchUser = {
  id: string;
  name: string | null;
  avatar_url: string | null;
};

export type SearchResponse = {
  users: SearchUser[];
};

export type SearchUsersInput = {
  q: string;
  accessToken: string;
};
