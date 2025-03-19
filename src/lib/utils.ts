import { DEFAULT_CHUNK_SIZE } from "@/constant/default";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GetTotatlChunksResponse } from "./typings";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";

  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);

  return `${parseFloat(size.toFixed(2))} ${sizes[i]}`;
}

export function extractOriginalFilename(filename: string): string {
  const match = filename.match(/^(.*?)(-\w{8}(-\w{4}){3}-\w{12})\.\w+$/);

  if (!match || match.length < 2) {
    return filename;
  }

  return match[1];
}

export const getTotatlChunks = (fileSize: number): GetTotatlChunksResponse => {
  const size = +(process.env.CHUNK_SIZE || DEFAULT_CHUNK_SIZE);

  const totat_chunks = Math.ceil(fileSize / size);

  return {
    totat_chunks,
    chunk_size_kb: size,
  };
};
