import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-indigo-600">404</h1>
                <h2 className="mt-4 text-3xl font-semibold text-gray-900">Page Not Found</h2>
                <p className="mt-2 text-gray-600">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to={ROUTES.HOME}
                    className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
