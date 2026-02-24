const API_URL = "/api/chat";

export const getMessages = async (matchId: string, token: string) => {
  const response = await fetch(`${API_URL}/${matchId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};
