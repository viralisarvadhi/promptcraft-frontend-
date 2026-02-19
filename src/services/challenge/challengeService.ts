import ApiService, { ApiResponse } from '../configs/ApiService';

export interface Challenge {
    id: string;
    title: string;
    category: string;
    difficulty: string;
    instruction: string;
    tips: string[];
    examplePrompt: string;
    tags: string[];
    estimatedMinutes: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ChallengeStats {
    totalAttempts: number;
    averageScore: number;
    bestScore: number;
    gradeDistribution: {
        S: number;
        A: number;
        B: number;
        C: number;
        D: number;
        F: number;
    };
}

export interface ChallengeFilters {
    page?: number;
    limit?: number;
    category?: string;
    difficulty?: string;
}

class ChallengeService {
    async getAll(filters?: ChallengeFilters): Promise<ApiResponse<Challenge[]>> {
        return ApiService.get<Challenge[]>('/challenges', filters);
    }

    async getById(id: string): Promise<ApiResponse<Challenge>> {
        return ApiService.get<Challenge>(`/challenges/${id}`);
    }

    async getStats(id: string): Promise<ApiResponse<ChallengeStats>> {
        return ApiService.get<ChallengeStats>(`/challenges/${id}/stats`);
    }

    async create(data: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Challenge>> {
        return ApiService.post<Challenge>('/challenges', data);
    }

    async update(id: string, data: Partial<Challenge>): Promise<ApiResponse<Challenge>> {
        return ApiService.put<Challenge>(`/challenges/${id}`, data);
    }

    async delete(id: string): Promise<ApiResponse<void>> {
        return ApiService.delete<void>(`/challenges/${id}`);
    }
}

export default new ChallengeService();
