import ApiService, { ApiResponse } from '../configs/ApiService';

export interface User {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    totalAttempts: number;
    bestScore: number;
    averageScore: number;
    createdAt: string;
    updatedAt: string;
}

export interface RegisterInput {
    username: string;
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

class AuthService {
    async register(data: RegisterInput): Promise<ApiResponse<AuthResponse>> {
        return ApiService.post<AuthResponse>('/auth/register', data);
    }

    async login(data: LoginInput): Promise<ApiResponse<AuthResponse>> {
        return ApiService.post<AuthResponse>('/auth/login', data);
    }

    async logout(): Promise<ApiResponse<null>> {
        return ApiService.post<null>('/auth/logout');
    }

    async getMe(): Promise<ApiResponse<User>> {
        return ApiService.get<User>('/auth/me');
    }

    async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
        return ApiService.post('/auth/refresh', { refreshToken });
    }
}

export default new AuthService();
