import { createGenericStore } from "pinia-api-client";
import type { Team, Fireman, IncidentCommander } from "~~/interface/user";
import { defineStore } from 'pinia';
import { apiClient } from 'pinia-api-client';
import Cookies from 'js-cookie';
import { ref } from 'vue';
import type { AxiosResponse } from 'axios';

export const useTeamStore = createGenericStore<Team>("teams", "/user/teams");
export const useFiremanStore = createGenericStore<Fireman>("firemen", "/user/firemen");
export const useIncidentCommanderStore = createGenericStore<IncidentCommander>("incident-commanders", "/user/incident-commanders");

// Define types for credentials and tokens based on API docs
interface Credentials {
  email: string;
  password: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

// Define a constant for the cookie key, matching the plugin
const STORAGE_KEYS = {
    TOKENS: 'auth_tokens'
};

export const useAuthStore = defineStore('auth', () => {
  const tokens = ref<AuthTokens | null>(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Attempt to load tokens from cookies on initialization
  const loadTokensFromCookies = () => {
    const storedTokens = Cookies.get(STORAGE_KEYS.TOKENS);
    if (storedTokens) {
      try {
        tokens.value = JSON.parse(storedTokens);
        isAuthenticated.value = true;
        console.log("AuthStore: Tokens loaded from cookies.");
      } catch (e) {
        console.error("AuthStore: Failed to parse tokens from cookies", e);
        Cookies.remove(STORAGE_KEYS.TOKENS); // Clear corrupted cookie
        tokens.value = null;
        isAuthenticated.value = false;
      }
    } else {
        tokens.value = null;
        isAuthenticated.value = false;
    }
  };

  loadTokensFromCookies(); // Load tokens when store is initialized

  const login = async (credentials: Credentials) => {
    loading.value = true;
    error.value = null;
    try {
      const response: AxiosResponse<AuthTokens> = await apiClient.post('/user/login/', credentials);
      const newTokens = response.data;

      if (!newTokens || !newTokens.access || !newTokens.refresh) {
        throw new Error("Login response did not include valid tokens.");
      }

      tokens.value = newTokens;
      isAuthenticated.value = true;

      // Save tokens to cookies (mirroring interceptor logic)
      Cookies.set(
        STORAGE_KEYS.TOKENS,
        JSON.stringify(newTokens),
        { expires: 7, path: '/', sameSite: 'Lax' /* secure: process.env.NODE_ENV !== 'development' */ } // Adjust secure based on env if needed
      );
      console.log("AuthStore: Login successful, tokens stored.");

    } catch (err: any) {
      console.error("AuthStore: Login failed", err);
      tokens.value = null;
      isAuthenticated.value = false;
      error.value = err.response?.data?.detail || err.message || 'Login failed';
      // Optional: Clear cookies on login failure?
      // Cookies.remove(STORAGE_KEYS.TOKENS);
      throw err; // Re-throw the error for the component to handle
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    console.log("AuthStore: Logging out...");
    tokens.value = null;
    isAuthenticated.value = false;
    Cookies.remove(STORAGE_KEYS.TOKENS);
    // Note: The actual backend logout call and redirect should be handled
    // by the handleLogout function in the api-client plugin when a request fails due to auth,
    // or potentially triggered explicitly from UI after calling this store action.
    // This store action primarily clears local state.
    console.log("AuthStore: Local state cleared.");
  };

  // You might add actions for registration, token refresh verification etc. here later

  return {
    tokens,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    loadTokensFromCookies // Expose if manual refresh is needed
  };
});
