const API_URL = ''; // Proxy will handle this in dev, in prod it might be same domain

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // --- AUTH ---
  login: async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    localStorage.setItem('token', data.token);
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },

  // --- PUBLIC ---
  getPublicGuest: async (slug: string) => {
    const res = await fetch(`${API_URL}/api/public/guest/${slug}`);
    if (!res.ok) return null;
    return res.json();
  },

  getPublicSettings: async () => {
    const res = await fetch(`${API_URL}/api/public/settings`);
    if (!res.ok) return null;
    return res.json();
  },

  // --- ADMIN ---
  getGuests: async () => {
    const res = await fetch(`${API_URL}/api/admin/guests`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch guests');
    return res.json();
  },

  addGuest: async (guest: { name: string, title: string, phone: string, slug: string }) => {
    const res = await fetch(`${API_URL}/api/admin/guests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(guest)
    });
    if (!res.ok) throw new Error('Failed to add guest');
    return res.json();
  },

  deleteGuest: async (id: number | string) => {
    const res = await fetch(`${API_URL}/api/admin/guests/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete guest');
    return res.json();
  },

  toggleWaSent: async (id: number | string, waSent: boolean) => {
    const res = await fetch(`${API_URL}/api/admin/guests/${id}/toggle-wa`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ waSent })
    });
    if (!res.ok) throw new Error('Failed to toggle WA status');
    return res.json();
  },

  getSettings: async () => {
    const res = await fetch(`${API_URL}/api/admin/settings`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  updateSettings: async (settings: any) => {
    const res = await fetch(`${API_URL}/api/admin/settings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  }
};
