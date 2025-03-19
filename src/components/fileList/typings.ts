export interface UploadFileInChunksParams {
  id: string;
  file: File;
  total_chunks: number;
  chunk_size_kb: number;
}

export interface UploadChunkResponse {
  chunk_index: number;
  uploaded_path?: string;
  id: string;
}
