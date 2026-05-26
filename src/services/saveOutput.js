export const saveOutput = async (data) => {
  const res = await fetch("http://localhost:5000/api/save-output", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
};

export const getOutputs = async () => {
  const res = await fetch("http://localhost:5000/api/outputs");
  return await res.json();
};