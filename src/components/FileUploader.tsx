"use client";

// import { useUnloadWarning } from "@/hooks/useUnloadWarning";
import { useFileStore } from "@/store/uploaded-asstes";
import { useCallback } from "react";
import { Accept, useDropzone } from "react-dropzone";

type FileUploaderProps = {
  accept?: Accept;
  maxFiles?: number;
  maxSize?: number;
};

const FileUploader: React.FC<FileUploaderProps> = ({
  accept = {
    "image/*": [],
    "video/*": [],
    "application/pdf": [],
  },
  maxFiles = 5,
  maxSize = 1 * 1024 * 1024 * 1024,
}) => {
  const { add } = useFileStore((state) => state);
  // useUnloadWarning(true);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    add(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept,
      maxFiles,
      maxSize,
    });

  return (
    <div
      {...getRootProps()}
      className="h-[300px] flex justify-center items-center border-2 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer hover:border-blue-500 transition-all"
    >
      <input {...getInputProps()} />

      {fileRejections.length > 0 ? (
        <div className="mt-2 text-red-500 text-sm">
          Some files were rejected. Please check size/type.
        </div>
      ) : isDragActive ? (
        <p>Drop your files here...</p>
      ) : (
        <p>Drag & drop files here, or click to select</p>
      )}
    </div>
  );
};

export default FileUploader;
