// Token storage key
const TOKEN_KEY = 'auth_token';

// Get the authentication token from localStorage
export const getAuthToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

// Set the authentication token in localStorage
export const setAuthToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

// Remove the authentication token from localStorage
export const removeAuthToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

// Parse JWT token to get user data
export const parseToken = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing token:', error);
        return null;
    }
};

// Get current user data from token
export const getCurrentUser = () => {
    const token = getAuthToken();
    if (!token) return null;

    return parseToken(token);
}; 