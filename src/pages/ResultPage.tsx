import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { evaluationService, Attempt } from '@/services';
import Header from '@/components/Header';
import { ROUTES, RUBRIC_DIMENSIONS } from '@/utils/constants';
import { getGradeInfo, formatDate } from '@/utils/commonFunctions/masterCommonFunctions';
import toast from 'react-hot-toast';

export default function ResultPage() {
    const { attemptId } = useParams<{ attemptId: string }>();
    const navigate = useNavigate();
    const [attempt, setAttempt] = useState<Attempt | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!attemptId) {
            navigate(ROUTES.HOME);
            return;
        }
        loadAttempt(attemptId);
    }, [attemptId]);

    const loadAttempt = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await evaluationService.getAttemptById(id);
            if (response.success && response.data) {
                setAttempt(response.data);
            } else {
                toast.error('Attempt not found');
                navigate(ROUTES.HOME);
            }
        } catch (error) {
            toast.error('Failed to load results');
            navigate(ROUTES.HOME);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!attempt) {
        return null;
    }

    const gradeInfo = getGradeInfo(attempt.totalScore);
    const dimensions = [
        { key: 'clarity', score: attempt.clarityScore },
        { key: 'specificity', score: attempt.specificityScore },
        { key: 'context', score: attempt.contextScore },
        { key: 'structure', score: attempt.structureScore },
        { key: 'completeness', score: attempt.completenessScore },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header showBackButton backTo={ROUTES.HOME} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Score Card */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Evaluation Results
                    </h2>
                    <div className="flex items-center justify-center gap-8 mb-4">
                        <div>
                            <div className="text-6xl font-bold text-indigo-600">
                                {attempt.totalScore.toFixed(1)}
                            </div>
                            <div className="text-gray-600 mt-2">Total Score</div>
                        </div>
                        <div>
                            <div
                                className={`text-6xl font-bold px-6 py-3 rounded-lg ${gradeInfo.bgColor} ${gradeInfo.color}`}
                            >
                                {gradeInfo.label}
                            </div>
                            <div className="text-gray-600 mt-2">Grade</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                        <span>{attempt.wordCount} words</span>
                        <span>•</span>
                        <span>Evaluated by {attempt.evaluatorType === 'ai' ? 'AI' : 'Heuristic'}</span>
                        <span>•</span>
                        <span>{formatDate(attempt.createdAt)}</span>
                    </div>
                </div>

                {/* Dimension Scores */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Dimension Scores</h3>
                    <div className="space-y-4">
                        {dimensions.map((dim) => {
                            const rubricDim = RUBRIC_DIMENSIONS.find((r) => r.key === dim.key);
                            const percentage = (dim.score / 2) * 100;
                            return (
                                <div key={dim.key}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <span className="font-semibold text-gray-900">
                                                {rubricDim?.label}
                                            </span>
                                            <span className="text-sm text-gray-500 ml-2">
                                                {rubricDim?.description}
                                            </span>
                                        </div>
                                        <span className="font-bold text-indigo-600">
                                            {dim.score.toFixed(1)}/2.0
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-indigo-600 h-2 rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Strengths */}
                {attempt.strengths.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Strengths</h3>
                        <ul className="space-y-2">
                            {attempt.strengths.map((strength, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-green-600 mr-2">✓</span>
                                    <span className="text-gray-700">{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Suggestions */}
                {attempt.suggestions.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Suggestions for Improvement
                        </h3>
                        <ul className="space-y-2">
                            {attempt.suggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-yellow-600 mr-2">→</span>
                                    <span className="text-gray-700">{suggestion}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Your Prompt */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Your Prompt</h3>
                    <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800 whitespace-pre-wrap">
                        {attempt.promptText}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Link
                        to={`/challenge/${attempt.challengeId}`}
                        className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold text-center hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </Link>
                    <Link
                        to={ROUTES.HOME}
                        className="flex-1 py-3 px-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold text-center hover:bg-indigo-50 transition-colors"
                    >
                        Try Another Challenge
                    </Link>
                    <Link
                        to={ROUTES.HISTORY}
                        className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors"
                    >
                        View All Attempts
                    </Link>
                </div>
            </div>
        </div>
    );
}
