/**
 * Converts a relative or absolute URL to an absolute URL
 * @param url - The URL to convert (can be relative or absolute)
 * @returns Absolute URL or undefined if input is undefined
 */
export const getAbsoluteUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;

    // If already absolute, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    // If relative, prepend base URL from environment or default
    // In production this would come from environment variables
    const baseUrl = 'http://localhost:8080'; // TODO: Get from env
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Validates if a URL is valid
 * @param url - The URL to validate
 * @returns true if valid, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};
