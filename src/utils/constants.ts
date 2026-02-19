export const GRADES = {
    S: { label: 'S', color: 'text-purple-600', bgColor: 'bg-purple-100', min: 9.0 },
    A: { label: 'A', color: 'text-green-600', bgColor: 'bg-green-100', min: 8.0 },
    B: { label: 'B', color: 'text-blue-600', bgColor: 'bg-blue-100', min: 6.5 },
    C: { label: 'C', color: 'text-yellow-600', bgColor: 'bg-yellow-100', min: 5.0 },
    D: { label: 'D', color: 'text-orange-600', bgColor: 'bg-orange-100', min: 3.0 },
    F: { label: 'F', color: 'text-red-600', bgColor: 'bg-red-100', min: 0.0 },
} as const;

export const CATEGORIES = [
    'UI/UX Design',
    'Backend',
    'AI Prompting',
    'Database',
    'DevOps',
    'Data Science',
] as const;

export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const DIFFICULTY_COLORS = {
    Beginner: { text: 'text-green-600', bg: 'bg-green-100' },
    Intermediate: { text: 'text-yellow-600', bg: 'bg-yellow-100' },
    Advanced: { text: 'text-red-600', bg: 'bg-red-100' },
} as const;

export const CATEGORY_COLORS = {
    'UI/UX Design': { text: 'text-pink-600', bg: 'bg-pink-100' },
    Backend: { text: 'text-blue-600', bg: 'bg-blue-100' },
    'AI Prompting': { text: 'text-purple-600', bg: 'bg-purple-100' },
    Database: { text: 'text-green-600', bg: 'bg-green-100' },
    DevOps: { text: 'text-orange-600', bg: 'bg-orange-100' },
    'Data Science': { text: 'text-indigo-600', bg: 'bg-indigo-100' },
} as const;

export const RUBRIC_DIMENSIONS = [
    { key: 'clarity', label: 'Clarity', description: 'Free of vague terms, unambiguous' },
    {
        key: 'specificity',
        label: 'Specificity',
        description: 'Concrete technical details',
    },
    { key: 'context', label: 'Context', description: 'Background, persona, use-case' },
    {
        key: 'structure',
        label: 'Structure',
        description: 'Numbered steps, sections, formatting',
    },
    {
        key: 'completeness',
        label: 'Completeness',
        description: 'Covers all challenge hint areas',
    },
] as const;

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    CHALLENGE: '/challenge/:id',
    RESULT: '/result/:attemptId',
    HISTORY: '/history',
    PROFILE: '/profile',
    ADMIN: '/admin',
    LEADERBOARD: '/leaderboard',
} as const;

export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'promptcraft_access_token',
    REFRESH_TOKEN: 'promptcraft_refresh_token',
    USER: 'promptcraft_user',
} as const;
