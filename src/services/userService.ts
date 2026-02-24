const API_URL = "/api/users";

export const updateProfile = async (profileData: any, token: string) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  return response.json();
};

export const getDiscoverUsers = async (token: string) => {
  const response = await fetch(`${API_URL}/discover`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const getRecommendedMatches = async (token: string) => {
  const response = await fetch(`${API_URL}/matches/recommended`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};
