export { default as authService } from './auth/authService';
export { default as challengeService } from './challenge/challengeService';
export { default as evaluationService } from './evaluation/evaluationService';
export { default as leaderboardService } from './leaderboard/leaderboardService';
export { default as userService } from './user/userService';

export type { User, RegisterInput, LoginInput, AuthResponse } from './auth/authService';
export type { Challenge, ChallengeStats, ChallengeFilters } from './challenge/challengeService';
export type {
    EvaluationResult,
    Attempt,
    EvaluateInput,
    EvaluateResponse,
} from './evaluation/evaluationService';
export type {
    LeaderboardEntry,
    ChallengeLeaderboardEntry,
    UserRank,
} from './leaderboard/leaderboardService';
