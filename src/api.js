const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const saveOutput = async (data, token) => {
  const res = await fetch(`${API_BASE}/api/save-output`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || json.details || `Save failed (${res.status})`);
  return json;
};

export const fetchMyPortfolios = async (token) => {
  const res = await fetch(`${API_BASE}/api/portfolios`, {  // ← CHANGED from /api/outputs
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `Fetch failed (${res.status})`);
  return json;
};

// You can delete this if you don't use it, or keep it
export const getOutputs = async (token) => {
  const res = await fetch(`${API_BASE}/api/outputs`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `Fetch failed (${res.status})`);
  return json;
};