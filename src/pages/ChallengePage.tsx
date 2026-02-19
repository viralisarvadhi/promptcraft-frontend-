import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '@/store/hooks';
import { useEvaluation } from '@/hooks/useEvaluation';
import { challengeService } from '@/services';
import Header from '@/components/Header';
import {
    DIFFICULTY_COLORS,
    CATEGORY_COLORS,
    ROUTES,
} from '@/utils/constants';
import { countWords } from '@/utils/commonFunctions/masterCommonFunctions';
import toast from 'react-hot-toast';

export default function ChallengePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { selectedChallenge, setSelectedChallenge } = useAppStore();
    const { submitPrompt, isSubmitting } = useEvaluation();
    const [promptText, setPromptText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!id) {
            navigate(ROUTES.HOME);
            return;
        }

        if (!selectedChallenge || selectedChallenge.id !== id) {
            loadChallenge(id);
        }
    }, [id]);

    const loadChallenge = async (challengeId: string) => {
        setIsLoading(true);
        try {
            const response = await challengeService.getById(challengeId);
            if (response.success && response.data) {
                setSelectedChallenge(response.data);
            } else {
                toast.error('Challenge not found');
                navigate(ROUTES.HOME);
            }
        } catch (error) {
            toast.error('Failed to load challenge');
            navigate(ROUTES.HOME);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) return;

        if (promptText.trim().length < 10) {
            toast.error('Prompt must be at least 10 characters');
            return;
        }

        await submitPrompt({
            challengeId: id,
            promptText: promptText.trim(),
        });
    };

    const wordCount = countWords(promptText);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!selectedChallenge) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header showBackButton backTo={ROUTES.HOME} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Challenge Details */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {selectedChallenge.title}
                            </h2>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <span
                                    className={`px-3 py-1 rounded text-sm font-medium ${CATEGORY_COLORS[selectedChallenge.category as keyof typeof CATEGORY_COLORS].bg
                                        } ${CATEGORY_COLORS[selectedChallenge.category as keyof typeof CATEGORY_COLORS].text}`}
                                >
                                    {selectedChallenge.category}
                                </span>
                                <span
                                    className={`px-3 py-1 rounded text-sm font-medium ${DIFFICULTY_COLORS[selectedChallenge.difficulty as keyof typeof DIFFICULTY_COLORS].bg
                                        } ${DIFFICULTY_COLORS[selectedChallenge.difficulty as keyof typeof DIFFICULTY_COLORS].text}`}
                                >
                                    {selectedChallenge.difficulty}
                                </span>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                    Instruction
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {selectedChallenge.instruction}
                                </p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                    Tips
                                </h3>
                                <ul className="space-y-2">
                                    {selectedChallenge.tips.map((tip, index) => (
                                        <li key={index} className="text-sm text-gray-600 flex">
                                            <span className="mr-2">•</span>
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedChallenge.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="text-sm text-gray-500">
                                Estimated time: ~{selectedChallenge.estimatedMinutes} minutes
                            </div>
                        </div>
                    </div>

                    {/* Prompt Editor */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Write Your Prompt
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <textarea
                                        value={promptText}
                                        onChange={(e) => setPromptText(e.target.value)}
                                        placeholder="Write your prompt here... Be specific, clear, and structured."
                                        className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
                                        disabled={isSubmitting}
                                    />
                                    <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                                        <span>{wordCount} words</span>
                                        <span>
                                            {promptText.length} characters
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <h3 className="text-sm font-semibold text-blue-900 mb-2">
                                        Evaluation Criteria
                                    </h3>
                                    <ul className="space-y-1 text-sm text-blue-800">
                                        <li>• Clarity: Free of vague terms, unambiguous</li>
                                        <li>• Specificity: Concrete technical details</li>
                                        <li>• Context: Background, persona, use-case</li>
                                        <li>• Structure: Numbered steps, sections, formatting</li>
                                        <li>• Completeness: Covers all challenge hint areas</li>
                                    </ul>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || promptText.trim().length < 10}
                                    className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSubmitting ? 'Evaluating...' : 'Submit for Evaluation'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
