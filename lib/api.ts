interface BaseResponse {
    statusCode: number,
    message: string,
}

export interface ApiResponse<T> extends BaseResponse {
    data: T,
    error?: never
}

export interface ApiError extends BaseResponse {
    error: string,
    data?: never
}

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api-proxy';
const getBaseUrl = () => {
    if (typeof window !== 'undefined') return '';
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000'; // Server Local
};
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    let fullUrl = '';
    const baseUrl = getBaseUrl();
    if (endpoint.startsWith('http')) {
        fullUrl = endpoint;
    } else {
        const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const finalPath = path.startsWith(API_PREFIX) ? path : `${API_PREFIX}${path}`;

        fullUrl = `${baseUrl}${finalPath}`;
    }
    const option: RequestInit = {
        ...options,
        credentials: 'include', // Include cookies for cross-origin requests
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };
    const response = await fetch(fullUrl, option);
    const data = await response.json();
    if (!response.ok) {
        throw Error((data as ApiError).error);
    }
    return data as ApiResponse<T>;
}

export const api = {
    get: <T>(url: string, options?: RequestInit) => request<T>(url, { ...options, method: 'GET' }),
    post: <T>(url: string, data: unknown, options?: RequestInit) => request<T>(url, { ...options, method: 'POST', body: JSON.stringify(data) }),
    patch: <T>(url: string, data: unknown, options?: RequestInit) => request<T>(url, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
    delete: <T>(url: string, options?: RequestInit) => request<T>(url, { ...options, method: 'DELETE' }),
}