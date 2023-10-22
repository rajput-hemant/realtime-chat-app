import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges the given class names with the tailwind classes
 * @param inputs The class names to merge
 * @returns The merged class names
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Formats the given pusher key to have "__" instead of ":"
 * @param key The key to format
 * @returns The formatted key
 */
export function formatPusherKey(key: string) {
  return key.replace(/:/g, "__");
}
