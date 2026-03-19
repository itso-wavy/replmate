const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: options.prefer || 'return=representation',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const db = {
  getAll: () => sbFetch('tasks?order=start_date.asc'),
  upsert: tasks =>
    sbFetch('tasks', {
      method: 'POST',
      body: JSON.stringify(tasks),
      prefer: 'resolution=merge-duplicates,return=minimal',
    }),
  update: (id, data) =>
    sbFetch(`tasks?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      prefer: 'return=minimal',
    }),
  delete: id =>
    sbFetch(`tasks?id=eq.${id}`, {
      method: 'DELETE',
      prefer: 'return=minimal',
    }),
};
