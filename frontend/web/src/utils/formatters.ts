import { format, formatDistanceToNow } from 'date-fns';

export const formatDateTime = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return format(date, 'PPpp');
};

export const timeAgo = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return formatDistanceToNow(date, { addSuffix: true });
};
