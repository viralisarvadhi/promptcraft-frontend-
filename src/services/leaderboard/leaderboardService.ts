import ApiService, { ApiResponse } from '../configs/ApiService';

export interface LeaderboardEntry {
    id: string;
    username: string;
    bestScore: number;
    totalAttempts: number;
    averageScore: number;
    rank: number;
}

export interface ChallengeLeaderboardEntry {
    id: string;
    username: string;
    totalScore: number;
    grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
    createdAt: string;
    rank: number;
}

export interface UserRank {
    rank: number;
    total: number;
}

class LeaderboardService {
    async getGlobal(): Promise<ApiResponse<LeaderboardEntry[]>> {
        return ApiService.get<LeaderboardEntry[]>('/leaderboard');
    }

    async getMyRank(): Promise<ApiResponse<UserRank>> {
        return ApiService.get<UserRank>('/leaderboard/my-rank');
    }

    async getChallengeLeaderboard(challengeId: string): Promise<ApiResponse<ChallengeLeaderboardEntry[]>> {
        return ApiService.get<ChallengeLeaderboardEntry[]>(`/leaderboard/challenge/${challengeId}`);
    }
}

export default new LeaderboardService();
