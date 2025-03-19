import { DEFAULT_CHUNK_SIZE } from "@/constant/default";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export enum FileState {
  stale = "stale",
  uploading = "uploading",
  uploaded = "uploaded",
}

export interface FileItem {
  state: FileState;
  file: File;
  id: string;
  chunk_size_kb?: number;
  total_chunks?: number;
  last_uploaded_chunk_time?: number | null;
}

interface States {
  files: FileItem[];
}

interface Actions {
  add: (newFiles: File[]) => void;
  update: (updateFileData: UpdateFileData) => void;
  getChunk: (chunkData: ChunkData) => Promise<ArrayBuffer>;
  fileUploaded: (fileUploadedData: FileUploadedData) => void;
}

interface UpdateFileData {
  id: string;
  total_chunks?: number;
  chunk_size_kb?: number;
  lastModified?: File["lastModified"];
  last_uploaded_chunk_time?: FileItem["last_uploaded_chunk_time"];
}

export interface ChunkData {
  id: string;
  chunk_index: number;
}

interface FileUploadedData {
  id: string;
  uploaded_path: string;
}

export const useFileStore = create<States & Actions>((set, get) => ({
  files: [],
  add: (files: File[]) => {
    const data: FileItem[] = files.map((file) => {
      const id = uuidv4();
      return {
        id,
        file,
        state: FileState.stale,
      };
    });
    set((state) => ({ files: [...data, ...state.files] }));
  },

  update: (updateFileData: UpdateFileData) => {
    const updatedStates = get().files.map((fileItem) => {
      if (fileItem.id === updateFileData.id) {
        return {
          ...fileItem,
          id: updateFileData.id || fileItem.id,
          total_chunks: updateFileData.total_chunks || fileItem.total_chunks,
          chunk_size_kb: updateFileData.chunk_size_kb || fileItem.chunk_size_kb,
          last_uploaded_chunk_time:
            updateFileData.last_uploaded_chunk_time || null,
          state: FileState.uploading,
        };
      }

      return fileItem;
    });
    set({ files: updatedStates });
  },

  getChunk: async (chunkData: ChunkData) => {
    const fileItem = get().files.find(
      (fileItem) => fileItem.id === chunkData.id
    );

    if (!fileItem) {
      throw new Error("File not found");
    }

    const chunkSizeBytes = fileItem.chunk_size_kb || DEFAULT_CHUNK_SIZE;

    const start = (chunkData.chunk_index - 1) * chunkSizeBytes;
    const end = Math.min(start + chunkSizeBytes, fileItem.file.size);

    const fileBuffer = await fileItem.file.arrayBuffer();
    const slicedFileBuffer = fileBuffer.slice(start, end);

    return slicedFileBuffer;
  },

  fileUploaded: (fileUploadedData: FileUploadedData) => {
    const updatedStates = get().files.map((fileItem) => {
      if (fileItem.id === fileUploadedData.id) {
        return {
          ...fileItem,
          state: FileState.uploaded,
        };
      }
      return fileItem;
    });
    set({ files: updatedStates });
  },
}));
