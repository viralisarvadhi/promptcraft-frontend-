import { StateCreator } from 'zustand';
import { Challenge, challengeService } from '@/services';
import { ChallengeFilters } from '@/services/challenge/challengeService';

export interface ChallengeSlice {
    challenges: Challenge[];
    selectedChallenge: Challenge | null;
    isLoadingChallenges: boolean;
    setChallenges: (challenges: Challenge[]) => void;
    setSelectedChallenge: (challenge: Challenge | null) => void;
    setIsLoadingChallenges: (isLoading: boolean) => void;
    fetchChallenges: (filters?: ChallengeFilters) => Promise<void>;
    clearChallenges: () => void;
}

export const createChallengeSlice: StateCreator<ChallengeSlice> = (set) => ({
    challenges: [],
    selectedChallenge: null,
    isLoadingChallenges: false,

    setChallenges: (challenges) => set({ challenges }),

    setSelectedChallenge: (challenge) => set({ selectedChallenge: challenge }),

    setIsLoadingChallenges: (isLoading) => set({ isLoadingChallenges: isLoading }),

    fetchChallenges: async (filters?: ChallengeFilters) => {
        set({ isLoadingChallenges: true });
        try {
            const response = await challengeService.getAll(filters);
            set({ challenges: response.data, isLoadingChallenges: false });
        } catch (error) {
            console.error('Failed to fetch challenges:', error);
            set({ isLoadingChallenges: false });
        }
    },

    clearChallenges: () =>
        set({
            challenges: [],
            selectedChallenge: null,
            isLoadingChallenges: false,
        }),
});
