const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function escapeIlikePattern(value) {
  return value.replace(/[\\%*_]/g, (match) => `\\${match}`);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (!q) {
    return res.status(400).json({ error: 'Missing q query parameter' });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Search service is not configured' });
  }

  const params = new URLSearchParams({
    select: '*',
    name: `ilike.*${escapeIlikePattern(q)}*`,
  });

  const response = await fetch(`${SUPABASE_URL}/rest/v1/users?${params.toString()}`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  if (!response.ok) {
    return res.status(502).json({ error: 'Search query failed' });
  }

  const users = await response.json();
  return res.status(200).json({ users });
}
