import { jwtDecode } from 'jwt-decode';
import { getItem, removeItem } from '../local_storage';

const TOKEN_KEY = 'token';

export const getToken = async (): Promise<string | null> => {
  const accessToken = await getItem(TOKEN_KEY);
  return accessToken;
};

export const removeToken = (): void => {
  removeItem(TOKEN_KEY);
};

interface JwtPayload {
  exp?: number;
  [key: string]: any;
}

export const isTokenValid = async (): Promise<boolean> => {
  const token = await getToken();
  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return !!decoded.exp && decoded.exp > currentTime;
  } catch (error) {
    console.error('JWT Decode Error:', error);
    return false;
  }
};

export const autoLogout = async (logoutCallback: () => void): Promise<void> => {
  const token = await getToken();
  if (!token) {
    return;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) {
      removeToken();
      logoutCallback();
      return;
    }
    const expiresIn = decoded.exp * 1000 - Date.now();

    if (expiresIn > 0) {
      setTimeout(() => {
        removeToken();
        logoutCallback();
      }, expiresIn);
    } else {
      removeToken();
      logoutCallback();
    }
  } catch (error) {
    console.error(error);
    removeToken();
    logoutCallback();
  }
};