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

export class ApiRequestError extends Error implements ApiError {
    statusCode: number;
    error: string;

    constructor(data: ApiError) {
        super(data.message);
        this.name = 'ApiRequestError';
        this.statusCode = data.statusCode;
        this.error = data.error;
    }
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
    const responseText = await response.text();
let responseData;
    try {
        responseData = responseText ? JSON.parse(responseText) : {};
    } catch {
        responseData = null;
    }
    if (!response.ok) {
        const errorDetail: ApiError = {
            statusCode: response.status,
            message: responseData?.message || "Request failed",
            error: responseData?.error || responseText || response.statusText || "Internal Server Error",
        };
        throw new ApiRequestError(errorDetail);
    }
    return responseData as ApiResponse<T>;
}

export const api = {
    get: <T>(url: string, options?: RequestInit) => request<T>(url, { ...options, method: 'GET' }),
    post: <T>(url: string, data: unknown, options?: RequestInit) => request<T>(url, { ...options, method: 'POST', body: JSON.stringify(data) }),
    patch: <T>(url: string, data: unknown, options?: RequestInit) => request<T>(url, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
    delete: <T>(url: string, options?: RequestInit) => request<T>(url, { ...options, method: 'DELETE' }),
}