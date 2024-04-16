import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// allows coders to create dynamic classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
