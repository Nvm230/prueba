import { format, formatDistanceToNow } from 'date-fns';

const toValidDate = (value: string | Date | undefined | null) => {
  if (!value) return null;
  const date = typeof value === 'string' ? new Date(value) : value;
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDateTime = (value: string | Date | undefined | null) => {
  const date = toValidDate(value);
  if (!date) return 'Fecha no disponible';
  return format(date, 'PPpp');
};

export const timeAgo = (value: string | Date | undefined | null) => {
  const date = toValidDate(value);
  if (!date) return 'Hace unos instantes';
  return formatDistanceToNow(date, { addSuffix: true });
};
