import { create } from 'zustand';
import { ChallengeSlice, createChallengeSlice } from './slices/challengeSlice';
import { EvaluationSlice, createEvaluationSlice } from './slices/evaluationSlice';

export type AppStore = ChallengeSlice & EvaluationSlice;

export const useStore = create<AppStore>()((...a) => ({
    ...createChallengeSlice(...a),
    ...createEvaluationSlice(...a),
}));
