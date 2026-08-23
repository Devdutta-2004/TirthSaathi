export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://gyfhkmdzfpknlefwvxes.supabase.co';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseKey) {
    return res.status(500).json({ error: 'Server configuration: Supabase key missing in environment' });
  }

  const { table, action, data } = req.body || {};
  const tableName = table || req.query.table;

  if (!tableName) {
    return res.status(400).json({ error: 'Missing table parameter' });
  }

  try {
    if (req.method === 'GET' || action === 'fetch') {
      const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/${tableName}?select=*`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      const result = await response.json();
      return res.status(response.status).json(result);
    }

    if (req.method === 'POST') {
      const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/${tableName}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        return res.status(200).json({ success: true });
      } else {
        const errorText = await response.text();
        return res.status(response.status).json({ error: errorText });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[API Database Proxy Error]:', err);
    return res.status(500).json({ error: err.message });
  }
}
