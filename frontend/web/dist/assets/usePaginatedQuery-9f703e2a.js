import { u as useQuery } from "./useQuery-9e6818c0.js";
const usePaginatedQuery = ({ queryKey, queryFn, enabled = true }) => {
  return useQuery({
    queryKey,
    queryFn: ({ signal }) => queryFn(signal),
    keepPreviousData: true,
    staleTime: 3e4,
    enabled
  });
};
export {
  usePaginatedQuery as u
};
