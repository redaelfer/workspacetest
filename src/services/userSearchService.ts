import type { SearchUser, SearchUsersInput } from '@/ts/Types';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SAFE_USER_FIELDS = 'id,name,avatar_url';
const SEARCH_LIMIT = '20';

function escapeIlikePattern(value: string): string {
  return value.replace(/[\\%*_]/g, (match) => `\\${match}`);
}

async function searchUsers({ q, accessToken }: SearchUsersInput): Promise<SearchUser[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Search service is not configured');
  }

  const params = new URLSearchParams({
    select: SAFE_USER_FIELDS,
    name: `ilike.*${escapeIlikePattern(q)}*`,
    limit: SEARCH_LIMIT,
  });

  const response = await fetch(`${SUPABASE_URL}/rest/v1/users?${params.toString()}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Search query failed');
  }

  return response.json() as Promise<SearchUser[]>;
}

export default searchUsers;
