export const generatePortfolio = async (profile, projects) => {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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