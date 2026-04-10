/** @spec docs/specs/P0.B-4-ui-kit.md */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** 合并 className：clsx 解析条件类 → tailwind-merge 去重 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
