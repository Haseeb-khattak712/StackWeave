const PREFIX = "stackweave_";

export const saveToStorage = (key, value) => {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
};

export const loadFromStorage = (key) => {
  const data = localStorage.getItem(PREFIX + key);
  return data ? JSON.parse(data) : null;
};

export const removeFromStorage = (key) => {
  localStorage.removeItem(PREFIX + key);
};