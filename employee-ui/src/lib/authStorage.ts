const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

const clearAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userInfo");
};

export { saveTokens, getAccessToken, clearAuth };
