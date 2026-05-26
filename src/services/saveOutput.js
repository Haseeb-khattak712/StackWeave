export const saveOutput = async (data, token) => {
  const res = await fetch("http://localhost:5000/api/save-output", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return await res.json();
};

export const fetchMyPortfolios = async (token) => {
  const res = await fetch("http://localhost:5000/api/outputs", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  
  return await res.json();
};

export const getOutputs = async () => {
  const res = await fetch("http://localhost:5000/api/outputs");
  return await res.json();
};