/**
 * Resolves an asset path with the correct Vite base URL.
 * Helps images load correctly on both local development and GitHub Pages.
 */
export const getAssetUrl = (path: string | undefined): string => {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }
  
  // Clean up duplicate leading slashes and format path
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : base + '/';
  
  return cleanBase + cleanPath;
};
