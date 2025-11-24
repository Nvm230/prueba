import { useQuery } from '@tanstack/react-query';

interface Options<T> {
  queryKey: unknown[];
  queryFn: (signal: AbortSignal) => Promise<T>;
  enabled?: boolean;
}

export const usePaginatedQuery = <T,>({ queryKey, queryFn, enabled = true }: Options<T>) => {
  return useQuery({
    queryKey,
    queryFn: ({ signal }) => queryFn(signal as AbortSignal),
    keepPreviousData: true,
    staleTime: 30_000,
    enabled
  });
};
