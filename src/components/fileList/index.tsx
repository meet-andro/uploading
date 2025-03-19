"use client";

import { useFileStore } from "@/store/uploaded-asstes";
import React from "react";
import Item from "./item";
import Preview from "./preview";
import { extractOriginalFilename, formatBytes } from "@/lib/utils";
import { TypographyH4 } from "../ui/h4";
import moment from "moment";

interface UploadedFiles {
  uploaded_path: string;
  type: string | undefined;
  size: number;
  created_at: Date;
}

interface FileListProps {
  uploadedFiles: UploadedFiles[] | [];
}

const FileList = ({ uploadedFiles }: FileListProps) => {
  const { files } = useFileStore();

  return (
    <div className="h-full flex flex-col gap-y-4 group">
      {files.length
        ? files.map((fileItem) => {
            return <Item key={fileItem.id} fileItem={fileItem} />;
          })
        : null}

      {uploadedFiles.map((uploadedFileItem, index) => {
        const relativePath = uploadedFileItem.uploaded_path
          .split("uploads/")
          .at(-1);

        const src = `/uploads/${relativePath}`;

        return relativePath && src && uploadedFileItem.type ? (
          <div
            key={index}
            className="p-4 flex gap-x-4 border border-gray-400 rounded-xl shadow-lg bg-[#F0F0F0]"
          >
            <div className="p-1.5 border border-gray-400 rounded-md shadow-md flex justify-center items-center">
              <Preview
                name={extractOriginalFilename(relativePath)}
                src={src}
                type={uploadedFileItem.type}
              />
            </div>
            <div className="space-y-1">
              <TypographyH4 className="text-[#4A90E2]">
                {extractOriginalFilename(relativePath)}
              </TypographyH4>
              <p className="text-xs text-gray-600 font-medium">
                {formatBytes(uploadedFileItem.size)}
              </p>
              {uploadedFileItem.created_at ? (
                <p className="py-1 text-xs text-gray-600 font-medium">
                  {moment(uploadedFileItem.created_at).fromNow()}
                </p>
              ) : null}
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
};

export default FileList;
