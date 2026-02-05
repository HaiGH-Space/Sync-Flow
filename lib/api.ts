export interface ApiResponse<T> {
    code: number,
    message: string,
    data: T,
}

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const option: RequestInit = {
        ...options,
        credentials: 'include', // Include cookies for cross-origin requests
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, option);
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}, statusText: ${await response.json()}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse<T> = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Network error: ${error}`);
    }
}

export const api = {
    get: <T>(url: string, options?: RequestInit) => request<T>(url, { ...options, method: 'GET' }),
    post: <T>(url: string, data: unknown, options?: RequestInit) => request<T>(url, { ...options, method: 'POST', body: JSON.stringify(data) }),
    patch: <T>(url: string, data: unknown, options?: RequestInit) => request<T>(url, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
    delete: <T>(url: string, options?: RequestInit) => request<T>(url, { ...options, method: 'DELETE' }),
}