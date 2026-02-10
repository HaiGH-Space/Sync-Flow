import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFirstLetters(str: string): string {
  return str
    .trim()
    .split(/\s+/)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}
