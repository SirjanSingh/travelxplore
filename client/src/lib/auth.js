export function getToken() {
  return localStorage.getItem('tx_token');
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('tx_user'));
  } catch {
    return null;
  }
}

export function setAuth(token, user) {
  localStorage.setItem('tx_token', token);
  localStorage.setItem('tx_user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('tx_token');
  localStorage.removeItem('tx_user');
}

export function isLoggedIn() {
  return !!getToken();
}
