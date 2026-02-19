import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { evaluationService, EvaluateInput } from '@/services';
import { useAppStore } from '@/store/hooks';

export function useEvaluation() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setEvaluationResult, setAttemptId, setIsEvaluating } = useAppStore();

    const submitPrompt = async (data: EvaluateInput) => {
        setIsSubmitting(true);
        setIsEvaluating(true);

        try {
            const response = await evaluationService.evaluate(data);

            if (response.success && response.data) {
                const { attemptId, result } = response.data;
                setEvaluationResult(result);
                setAttemptId(attemptId);
                toast.success('Prompt evaluated successfully!');
                navigate(`/result/${attemptId}`);
            } else {
                toast.error(response.message || 'Evaluation failed');
            }
        } catch (error: any) {
            const message =
                error.response?.data?.message || 'Failed to evaluate prompt. Please try again.';
            toast.error(message);
            throw error;
        } finally {
            setIsSubmitting(false);
            setIsEvaluating(false);
        }
    };

    return {
        isSubmitting,
        submitPrompt,
    };
}
