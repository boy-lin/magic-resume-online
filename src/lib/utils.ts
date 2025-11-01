import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a kebab-case string to camelCase
 * @param str - The string to convert (e.g., "left-right")
 * @returns The camelCase string (e.g., "leftRight")
 * @example
 * toCamelCase("left-right") // "leftRight"
 * toCamelCase("classic-template") // "classicTemplate"
 * toCamelCase("modern") // "modern"
 */
export function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

export const formatDate = (date: Date | undefined) => {
  if (!date) return "";
  return date.toLocaleDateString(["zh-CN", "en-US"], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
