export const generatePortfolio = async (profile, projects, token) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch("http://localhost:5000/api/generate", {
    method: "POST",
    headers,
    body: JSON.stringify({
      profile,
      projects,
    }),
  });

  if (!response.ok) {
    throw new Error("AI request failed");
  }

  return await response.json();
};