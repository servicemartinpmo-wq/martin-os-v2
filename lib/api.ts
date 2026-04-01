import { supabase } from './supabase';

export async function apiFetch(url: string, options: RequestInit = {}) {
  if (!supabase) {
    console.warn('apiFetch: Supabase not configured. Skipping auth token.');
  }
  const session = supabase ? (await supabase.auth.getSession()).data.session : null;
  const token = session?.access_token;
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) {
        console.error(`Request failed for ${url}, status: ${res.status}, response:`, text);
        throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`JSON parse error for ${url}, got response:`, text);
    throw err;
  }
}

export async function fetchWithLogging(url: string, options?: RequestInit) {
  return apiFetch(url, options);
}

export async function fetchUserRole(userId: string) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data.role;
  } catch (err) {
    console.error('Error fetching user role:', err);
    return null; // fallback
  }
}

export async function safeFetch(table: string, options: any = {}) {
  if (!supabase) return [];
  try {
    const { data, error } = await (supabase as any)
      .from(table)
      .select(options.select || '*')
      .eq(options.eqColumn || '', options.eqValue || '')
      .order(options.orderColumn || 'created_at', { ascending: false })
      .limit(options.limit || 10);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error(`Error fetching ${table}:`, err);
    return [];
  }
}
