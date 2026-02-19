import { StateCreator } from 'zustand';
import { EvaluationResult } from '@/services';

export interface EvaluationSlice {
    currentPrompt: string;
    evaluationResult: EvaluationResult | null;
    isEvaluating: boolean;
    attemptId: string | null;
    setCurrentPrompt: (prompt: string) => void;
    setEvaluationResult: (result: EvaluationResult | null) => void;
    setIsEvaluating: (isEvaluating: boolean) => void;
    setAttemptId: (id: string | null) => void;
    clearEvaluation: () => void;
}

export const createEvaluationSlice: StateCreator<EvaluationSlice> = (set) => ({
    currentPrompt: '',
    evaluationResult: null,
    isEvaluating: false,
    attemptId: null,

    setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),

    setEvaluationResult: (result) => set({ evaluationResult: result }),

    setIsEvaluating: (isEvaluating) => set({ isEvaluating }),

    setAttemptId: (id) => set({ attemptId: id }),

    clearEvaluation: () =>
        set({
            currentPrompt: '',
            evaluationResult: null,
            isEvaluating: false,
            attemptId: null,
        }),
});
