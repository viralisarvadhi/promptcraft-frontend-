import ApiService, { ApiResponse } from '../configs/ApiService';

export interface EvaluationResult {
    totalScore: number;
    grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
    clarityScore: number;
    specificityScore: number;
    contextScore: number;
    structureScore: number;
    completenessScore: number;
    suggestions: string[];
    strengths: string[];
    evaluatorType: 'ai' | 'heuristic';
    wordCount: number;
}

export interface Attempt {
    id: string;
    userId: string;
    challengeId: string;
    promptText: string;
    totalScore: number;
    grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
    clarityScore: number;
    specificityScore: number;
    contextScore: number;
    structureScore: number;
    completenessScore: number;
    suggestions: string[];
    strengths: string[];
    evaluatorType: 'ai' | 'heuristic';
    wordCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface EvaluateInput {
    challengeId: string;
    promptText: string;
}

export interface EvaluateResponse {
    attemptId: string;
    result: EvaluationResult;
}

class EvaluationService {
    async evaluate(data: EvaluateInput): Promise<ApiResponse<EvaluateResponse>> {
        return ApiService.post<EvaluateResponse>('/evaluate', data);
    }

    async getMyAttempts(page: number = 1, limit: number = 10): Promise<ApiResponse<Attempt[]>> {
        return ApiService.get<Attempt[]>('/evaluate/my-attempts', { page, limit });
    }

    async getAttemptById(id: string): Promise<ApiResponse<Attempt>> {
        return ApiService.get<Attempt>(`/evaluate/my-attempts/${id}`);
    }
}

export default new EvaluationService();
