import type { NextApiRequest, NextApiResponse } from 'next';
import searchUsers from '@/services/userSearchService';
import type { ErrorResponse, SearchResponse } from '@/ts/Types';

function getBearerToken(req: NextApiRequest): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }

  const token = header.slice('Bearer '.length).trim();
  return token || null;
}

function getSearchQuery(req: NextApiRequest): string | null {
  if (Array.isArray(req.query.q)) {
    return null;
  }

  const q = req.query.q?.trim();
  if (!q || q.length > 100) {
    return null;
  }

  return q;
}

async function searchController(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse | ErrorResponse>,
): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const q = getSearchQuery(req);
  if (!q) {
    res.status(400).json({ error: 'Missing or invalid q query parameter' });
    return;
  }

  try {
    const users = await searchUsers({ q, accessToken: token });
    res.status(200).json({ users });
  } catch (error) {
    res.status(502).json({ error: 'Search query failed' });
  }
}

export default searchController;
