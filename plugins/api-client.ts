import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { initApiClient, apiClient, axiosInstance } from 'pinia-api-client';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';

// Example: Assume STORAGE_KEYS is defined elsewhere
const STORAGE_KEYS = {
    TOKENS: 'auth_tokens' // Replace with your actual key
};

// Example: Assume these functions are defined in a helper file (e.g., ~/utils/auth.ts)
// You MUST implement these functions based on your authentication logic
const isPublicEndpoint = (url?: string): boolean => {
    if (!url) return false;
    const publicEndpoints = [
        '/api/user/registration/',
        '/api/user/login/',
        '/api/user/token/refresh/',
        '/api/user/token/verify/',
        '/api/user/logout/',
        // Add other public paths like password reset if needed
        // '/api/user/password/reset/',
        // '/api/user/password/reset/confirm/',
    ];
    // Check if the URL *ends* with one of the public endpoints to avoid matching partial paths
    return publicEndpoints.some(endpoint => url.endsWith(endpoint));
};

const getAccessToken = async (): Promise<string | null> => {
    const tokens = Cookies.get(STORAGE_KEYS.TOKENS);
    if (tokens) {
        try {
            return JSON.parse(tokens).access || null;
        } catch (e) {
            console.error("Failed to parse tokens cookie", e);
            return null;
        }
    }
    return null;
};

const getRefreshToken = async (): Promise<string | null> => {
     const tokens = Cookies.get(STORAGE_KEYS.TOKENS);
    if (tokens) {
        try {
            return JSON.parse(tokens).refresh || null;
        } catch (e) {
            console.error("Failed to parse tokens cookie", e);
            return null;
        }
    }
    return null;
};

// Example: Define handleLogout, likely involving clearing cookies/state and redirecting
const handleLogout = async (): Promise<void> => {
    console.log("Initiating logout process...");
    // 1. Attempt to invalidate token on the backend
    try {
        // Ensure axiosInstance is available. If called during plugin setup before
        // instance is ready, this might fail, but that's unlikely for logout.
        if (axiosInstance) {
             console.log("Calling backend logout endpoint...");
            // We might not have a valid token here, but dj-rest-auth's logout
            // should ideally handle this gracefully (e.g., ignore if not authenticated).
            // No need to await or handle response explicitly, just fire and forget.
            axiosInstance.post('/api/user/logout/').catch(err => {
                // Log error but don't block logout process
                console.warn("Backend logout call failed (might be expected if already unauthenticated):", err?.response?.status || err?.message);
            });
        }
    } catch (e) {
         console.error("Error during backend logout API call attempt:", e);
    }

    // 2. Clear local token storage
    console.log("Removing local tokens...");
    Cookies.remove(STORAGE_KEYS.TOKENS);

    // 3. Redirect to login page
    console.log("Redirecting to login...");
    window.location.href = '/login'; // Or use Nuxt navigation (e.g., navigateTo('/login'))
};

// --- Token Refresh State & Queue ---
let isRefreshing = false;
let requestQueue: Array<{ resolve: (token: string) => void; reject: (err: Error) => void }> = [];

// Type for custom headers, including the retry flag
interface CustomHeaders extends Record<string, any> {
    _retry?: boolean;
    Authorization?: string;
}

const processQueue = (error: Error | null, token: string | null = null) => {
    requestQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    requestQueue = [];
};

// --- Nuxt Plugin Definition ---
export default defineNuxtPlugin(async (nuxtApp) => {
    const config = useRuntimeConfig();

    // --- Define Interceptor Functions ---

    const requestInterceptor = async (reqConfig: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        console.log('Request Interceptor:', reqConfig.url);
        if (isPublicEndpoint(reqConfig.url)) {
            console.log('Public endpoint, skipping auth header');
            return reqConfig;
        }

        const accessToken = await getAccessToken();
        console.log('Access Token Found:', !!accessToken);

        if (accessToken && reqConfig.headers) {
            reqConfig.headers.Authorization = `Bearer ${accessToken}`;
            console.log('Authorization header added');
        } else if (!accessToken && !isPublicEndpoint(reqConfig.url)) {
             console.log('No access token found for protected route:', reqConfig.url);
             // Optional: Handle missing token case immediately (e.g., redirect)
             // await handleLogout(); // Uncomment if needed
             // throw new axios.Cancel('No access token available'); // Or cancel request
        }
        return reqConfig;
    };

    const requestErrorInterceptor = (error: any) => {
        console.error('Request Interceptor Error:', error);
        return Promise.reject(error);
    };

    const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
        // You can process successful responses here if needed
        console.log('Response Interceptor Success:', response.config.url, response.status);
        return response;
    };

    const responseErrorInterceptor = async (error: AxiosError): Promise<AxiosResponse> => {
        console.error('Response Interceptor Error:', error.config?.url, error.response?.status);
        const originalRequest = error.config as InternalAxiosRequestConfig & { headers: CustomHeaders };

        // Conditions to ignore refresh logic
        if (
            error.response?.status !== 401 || // Only handle 401
            !originalRequest || // Must have original request config
            originalRequest.headers?._retry || // Avoid retry loops
            isPublicEndpoint(originalRequest.url) // Don't refresh for public endpoints
        ) {
            console.log('Skipping token refresh logic for:', originalRequest?.url, 'Status:', error.response?.status);
            return Promise.reject(error); // Reject for non-401, missing config, retried, or public endpoints
        }

        // Avoid duplicate refresh attempts while one is in progress
        if (isRefreshing) {
            console.log('Token refresh already in progress, queuing request:', originalRequest.url);
            // Add request to queue
            return new Promise<AxiosResponse>((resolve, reject) => {
                requestQueue.push({
                    resolve: (token: string) => {
                        console.log('Processing queued request with new token:', originalRequest.url);
                        if (originalRequest.headers) {
                             originalRequest.headers.Authorization = `Bearer ${token}`;
                             originalRequest.headers._retry = true; // Mark as retried
                        }
                        // Use axiosInstance.request instead of apiClient.request
                        resolve(axiosInstance!.request(originalRequest));
                    },
                    reject: (err: Error) => {
                         console.error('Rejecting queued request:', originalRequest.url, err);
                         reject(err)
                    },
                });
            });
        }

        // Start token refresh
        console.log('Initiating token refresh for:', originalRequest.url);
        isRefreshing = true;
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
            console.warn("No refresh token found. Logging out.");
            await handleLogout(); // Logout if no refresh token
            isRefreshing = false; // Reset flag
            // Reject queued requests because logout is happening
            processQueue(new Error("Logout due to missing refresh token"), null);
            return Promise.reject(error); // Reject the original request's promise
        }

        try {
            console.log('Attempting to refresh token...');
            // Use the imported apiClient or axiosInstance for the refresh call
            const response = await axiosInstance!.post<{ access: string; refresh?: string }>('/api/user/token/refresh/', {
                refresh: refreshToken,
            });

            const newAccessToken = response.data.access;
            const newRefreshToken = response.data.refresh; // Check if a new refresh token is returned

            if (!newAccessToken) {
                throw new Error('Failed to refresh token: No access token returned.');
            }
            console.log('Token refresh successful.');

            // Determine the refresh token to save (new one if provided, otherwise keep old one)
            const refreshTokenToSave = newRefreshToken || refreshToken;

            // Save tokens to cookies
            Cookies.set(
                STORAGE_KEYS.TOKENS,
                JSON.stringify({
                    access: newAccessToken,
                    refresh: refreshTokenToSave, // Save the potentially new refresh token
                }),
                { expires: 7, path: '/', sameSite: 'Lax', secure: config.public.env !== 'development' }
            );
            console.log('New tokens saved to cookies.', newRefreshToken ? '(New refresh token received)' : '(Existing refresh token kept)');

            // Update header for the original request and retry
            if (originalRequest.headers) {
                 originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                 originalRequest.headers._retry = true; // Mark as retried
            }

            // Process queued requests with the new token
            console.log('Processing request queue with new token.');
            processQueue(null, newAccessToken);

             // Retry the original request using the globally available apiClient
             console.log('Retrying original request:', originalRequest.url);
            // Use axiosInstance.request instead of apiClient.request
            return axiosInstance!.request(originalRequest); // Return the promise from the retry

        } catch (refreshError: unknown) { // Use unknown for safety
             console.error("Token refresh failed:", refreshError);
             let errorToReject: Error;
             if (refreshError instanceof Error) {
                 errorToReject = refreshError;
             } else {
                 errorToReject = new Error(`Token refresh failed: ${JSON.stringify(refreshError)}`);
             }
             // Assume refresh error means the refresh token is invalid or session expired
             processQueue(errorToReject, null); // Reject queued requests
             await handleLogout(); // Logout on refresh failure
             return Promise.reject(errorToReject); // Reject the original request's promise with the refresh error
        } finally {
            console.log('Resetting refresh flag.');
            isRefreshing = false; // Reset refreshing flag regardless of outcome
        }
    };

    // --- Initialize API Client ---
    console.log("Initializing API Client Plugin with interceptors...");
    initApiClient({
        baseURL: config.public.apiUrl as string || "http://localhost:3000/api",
        // Pass interceptors directly
        requestInterceptors: requestInterceptor,
        requestInterceptorErrors: requestErrorInterceptor,
        responseInterceptors: responseInterceptor,
        responseInterceptorErrors: responseErrorInterceptor,
        // Add other Axios config if needed (e.g., timeout)
        // timeout: 10000,
    });
    console.log("API Client Plugin Initialized.");

    // Optionally provide the apiClient to the Nuxt app context
    // return {
    //   provide: {
    //     api: apiClient
    //   }
    // }
});
