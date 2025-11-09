import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a string to camelCase
 * Handles kebab-case, snake_case, and space-separated strings
 * @param str - The string to convert (e.g., "left-right", "left_right", "left right")
 * @returns The camelCase string (e.g., "leftRight")
 * @example
 * toCamelCase("left-right") // "leftRight"
 * toCamelCase("classic-template") // "classicTemplate"
 * toCamelCase("left_right") // "leftRight"
 * toCamelCase("left right") // "leftRight"
 * toCamelCase("modern") // "modern"
 */
export function toCamelCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/[-_\s]+([a-z])/gi, (_, letter) => letter.toUpperCase())
    .replace(/^[A-Z]/, (letter) => letter.toLowerCase());
}

export const formatDate = (date: Date | undefined) => {
  if (!date) return "";
  return date.toLocaleDateString(["zh-CN", "en-US"], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export function pickObjectsFromList(list) {
  const objects: Record<string, any> = {};
  if (!list) return objects;
  list.forEach((item) => {
    const camelCaseId = toCamelCase(item.id);
    objects[camelCaseId] = item;
  });
  return objects;
}
