import { uploadChunk } from "@/actions/upload/upload";
import { UploadFileInChunksParams } from "@/components/fileList/typings";
import { useFileStore } from "@/store/uploaded-asstes";
import { Dispatch, RefObject, SetStateAction, useCallback } from "react";
import moment from "moment";

export const useUploadFileInChunks = ({
  setIsPending,
  setProgress,
  uploadSpeed,
  estimatedUploadTime,
}: {
  setIsPending: Dispatch<SetStateAction<boolean>>;
  setProgress: (progress: number) => void;
  uploadSpeed: RefObject<string | null>;
  estimatedUploadTime: RefObject<string | null>;
}) => {
  const fileUploaded = useFileStore((state) => state.fileUploaded);
  const update = useFileStore((state) => state.update);
  const getChunk = useFileStore((state) => state.getChunk);

  const uploadFileInChunks = useCallback(
    async ({
      id,
      file,
      total_chunks,
      chunk_size_kb,
    }: UploadFileInChunksParams): Promise<void> => {
      for (let i = 1; i <= total_chunks; i++) {
        try {
          const startTime = performance.now();

          const buffer = await getChunk({ id, chunk_index: i });

          const uploadRes = await uploadChunk({
            current_chunk_index: i,
            id,
            buffer,
            total_chunks,
            name: file.name,
          });

          const endTime = performance.now();
          const durationSeconds = (endTime - startTime) / 1000;

          const speedMBps = chunk_size_kb / 1024 / 1024 / durationSeconds;
          uploadSpeed.current = speedMBps.toFixed(2);

          const remainingChunks = total_chunks - i;
          const estimatedTimeRemainingSeconds =
            remainingChunks * durationSeconds;

          const formattedTime = moment
            .duration(estimatedTimeRemainingSeconds, "seconds")
            .seconds();

          estimatedUploadTime.current = `${formattedTime}s`;

          update({ id, last_uploaded_chunk_time: Date.now() });

          setProgress(Math.floor((i * 100) / total_chunks));

          if (i === total_chunks && uploadRes.uploaded_path) {
            fileUploaded({
              id: uploadRes.id,
              uploaded_path: uploadRes.uploaded_path,
            });
            setIsPending(false);
          }
        } catch (error) {
          console.error(`Error uploading chunk ${i}/${total_chunks}:`, error);
          throw new Error(`Chunk upload failed at chunk ${i}: ${error}`);
        }
      }
    },
    [getChunk, update, fileUploaded, setProgress, uploadSpeed]
  );

  return uploadFileInChunks;
};
