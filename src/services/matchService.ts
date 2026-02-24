const API_URL = "/api/matches";

export const swipeRight = async (targetId: string, token: string) => {
  const response = await fetch(`${API_URL}/swipe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ targetId }),
  });
  return response.json();
};

export const getMatches = async (token: string) => {
  const response = await fetch(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const getPendingMatches = async (token: string) => {
  const response = await fetch(`${API_URL}/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};
