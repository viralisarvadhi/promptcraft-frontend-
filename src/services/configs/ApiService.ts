import axiosInstance from './BaseService';
import { AxiosResponse } from 'axios';

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    error?: string;
}

class ApiService {
    async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.get(url, { params });
        return response.data;
    }

    async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.post(url, data);
        return response.data;
    }

    async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.put(url, data);
        return response.data;
    }

    async delete<T>(url: string): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.delete(url);
        return response.data;
    }
}

export default new ApiService();
