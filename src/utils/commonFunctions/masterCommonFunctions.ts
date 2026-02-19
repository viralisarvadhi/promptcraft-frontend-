import { GRADES } from '../constants';

export function formatDate(date: string | Date): string {
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(d);
}

export function formatDateShort(date: string | Date): string {
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(d);
}

export function getScoreColor(score: number): string {
    if (score >= 9.0) return 'text-purple-600';
    if (score >= 8.0) return 'text-green-600';
    if (score >= 6.5) return 'text-blue-600';
    if (score >= 5.0) return 'text-yellow-600';
    if (score >= 3.0) return 'text-orange-600';
    return 'text-red-600';
}

export function getScoreBgColor(score: number): string {
    if (score >= 9.0) return 'bg-purple-100';
    if (score >= 8.0) return 'bg-green-100';
    if (score >= 6.5) return 'bg-blue-100';
    if (score >= 5.0) return 'bg-yellow-100';
    if (score >= 3.0) return 'bg-orange-100';
    return 'bg-red-100';
}

export function getGradeLabel(grade: keyof typeof GRADES): string {
    return GRADES[grade].label;
}

export function getGradeColor(grade: keyof typeof GRADES): string {
    return GRADES[grade].color;
}

export function getGradeBgColor(grade: keyof typeof GRADES): string {
    return GRADES[grade].bgColor;
}

export function getGradeInfo(score: number): {
    label: string;
    color: string;
    bgColor: string;
} {
    if (score >= 9.0) return GRADES.S;
    if (score >= 8.0) return GRADES.A;
    if (score >= 6.5) return GRADES.B;
    if (score >= 5.0) return GRADES.C;
    if (score >= 3.0) return GRADES.D;
    return GRADES.F;
}

export function countWords(text: string): number {
    return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

export function formatScore(score: number): string {
    return score.toFixed(1);
}

export function getRelativeTime(date: string | Date): string {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDateShort(date);
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}
