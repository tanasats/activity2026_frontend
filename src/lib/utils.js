import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  
  // Get base API URL from env or default
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  const baseUrl = apiUrl.replace('/api', '');
  
  return `${baseUrl}/${path}`;
}
