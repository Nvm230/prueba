import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface PaginationParams {
    page: number;
    size: number;
    total?: number;
}

export function usePagination(defaultSize: number = 10) {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);

    const [pagination, setPagination] = useState<PaginationParams>({
        page: parseInt(searchParams.get('page') || '1'),
        size: parseInt(searchParams.get('size') || String(defaultSize)),
    });

    // Update URL when pagination changes
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        params.set('page', String(pagination.page));
        params.set('size', String(pagination.size));
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }, [pagination.page, pagination.size]);

    const setPage = (page: number) => {
        setPagination((prev) => ({ ...prev, page }));
    };

    const setSize = (size: number) => {
        setPagination((prev) => ({ ...prev, size, page: 1 })); // Reset to page 1 when size changes
    };

    const setTotal = (total: number) => {
        setPagination((prev) => ({ ...prev, total }));
    };

    const totalPages = pagination.total
        ? Math.ceil(pagination.total / pagination.size)
        : 0;

    const hasNext = pagination.page < totalPages;
    const hasPrev = pagination.page > 1;

    const nextPage = () => {
        if (hasNext) setPage(pagination.page + 1);
    };

    const prevPage = () => {
        if (hasPrev) setPage(pagination.page - 1);
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setPage(page);
        }
    };

    return {
        page: pagination.page,
        size: pagination.size,
        total: pagination.total,
        totalPages,
        hasNext,
        hasPrev,
        setPage,
        setSize,
        setTotal,
        nextPage,
        prevPage,
        goToPage,
    };
}
