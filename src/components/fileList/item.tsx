import { useUploadFileInChunks } from "@/hooks/useUploadFileInChunks";
import { cn, formatBytes, getTotatlChunks } from "@/lib/utils";
import { FileItem, FileState, useFileStore } from "@/store/uploaded-asstes";
import moment from "moment";
import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { TypographyH4 } from "../ui/h4";
import { ProgressWithValue } from "../ui/progress";
import Preview from "./preview";

interface ItemProps {
  fileItem: FileItem;
}

const Item = ({ fileItem }: ItemProps) => {
  const [progress, setProgress] = useState<number>(0);

  const uploadSpeed = useRef<string | null>(null);
  const estimatedUploadTime = useRef<string | null>(null);

  const update = useFileStore((state) => state.update);

  const [isPending, setIsPending] = useState(false);
  const [, startTransition] = useTransition();

  const uploadFileInChunks = useUploadFileInChunks({
    setIsPending,
    setProgress,
    uploadSpeed,
    estimatedUploadTime,
  });

  const fileSource = useMemo(
    () => URL.createObjectURL(fileItem.file),
    [fileItem.file]
  );
  const fileType = useMemo(
    () => fileItem.file.type.split("/").at(-1),
    [fileItem.file.type]
  );

  useEffect(() => {
    if (fileItem.state !== FileState.stale) return;

    setIsPending(true);

    startTransition(async () => {
      const chunks = getTotatlChunks(fileItem.file.size);

      update({ id: fileItem.id, ...chunks });

      await uploadFileInChunks({
        id: fileItem.id,
        file: fileItem.file,
        chunk_size_kb: chunks.chunk_size_kb,
        total_chunks: chunks.totat_chunks,
      });
    });
  }, [fileItem.state]);

  return (
    <div
      className={cn(
        "p-4 flex gap-x-4 border border-gray-400 rounded-xl shadow-lg bg-[#F0F0F0] relative",
        isPending ? "animate-pulse" : ""
      )}
    >
      <div className="p-1.5 border border-gray-400 rounded-md shadow-md flex justify-center items-center">
        {fileType ? (
          <Preview name={fileItem.file.name} src={fileSource} type={fileType} />
        ) : (
          "File type undefinded"
        )}
      </div>
      <div className="flex-1 flex flex-col gap-y-2">
        <div className="space-y-1">
          <TypographyH4 className="text-[#4A90E2]">
            {fileItem.file.name}
          </TypographyH4>
          <p className="text-xs text-gray-600 font-medium">
            {formatBytes(fileItem.file.size)}
          </p>
        </div>
        {fileItem.state === FileState.uploaded ? (
          <p className="py-1 text-xs text-gray-600 font-medium">
            {moment(fileItem.last_uploaded_chunk_time).fromNow()}
          </p>
        ) : (
          <div className="h-full w-full flex items-end gap-x-2 justify-between">
            <ProgressWithValue
              key={fileItem.file.size}
              value={progress}
              position="follow"
              className="w-full max-w-[980px]"
            />
            <span className="text-xs whitespace-nowrap font-medium text-[#A0A0A0]">
              {uploadSpeed.current
                ? `${uploadSpeed.current} MB/s`
                : "calculating..."}
            </span>
            <span className="absolute top-1 right-1 text-xs whitespace-nowrap font-medium text-[#A0A0A0]">
              Estimated Time: {estimatedUploadTime.current}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Item);
