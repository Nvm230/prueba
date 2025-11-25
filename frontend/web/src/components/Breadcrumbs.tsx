import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbsProps {
    items?: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    const location = useLocation();

    // Auto-generate breadcrumbs from path if not provided
    const breadcrumbs = items || generateBreadcrumbs(location.pathname);

    if (breadcrumbs.length <= 1) {
        return null;
    }

    return (
        <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                        <li key={index} className="inline-flex items-center">
                            {index > 0 && (
                                <svg
                                    className="w-6 h-6 text-gray-400 dark:text-gray-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                            {isLast ? (
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    to={item.path || '/'}
                                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Inicio', path: '/' }];

    let currentPath = '';
    paths.forEach((path, index) => {
        currentPath += `/${path}`;
        const label = path.charAt(0).toUpperCase() + path.slice(1);
        breadcrumbs.push({
            label: label.replace(/-/g, ' '),
            path: index === paths.length - 1 ? undefined : currentPath,
        });
    });

    return breadcrumbs;
}
