import { IMAGETYPES, PDFTYPES, VIDEOTYPES } from "@/constant/fileExtention";
import Image from "next/image";
import { memo } from "react";

interface FillePreviewProps {
  name: string;
  src: string;
  type: string;
}

const Preview = ({ name, src, type }: FillePreviewProps) => {
  const isImage = IMAGETYPES.includes(type);

  if (isImage) {
    return (
      <Image
        width={100}
        height={100}
        src={src}
        alt={name}
        className="aspect-square rounded-md"
      />
    );
  }

  const isVideo = VIDEOTYPES.includes(type);

  if (isVideo) {
    return (
      <video
        src={src}
        className="w-[100px] h-auto min-h-[60px] max-h-[100px] rounded-md"
        autoPlay
        muted
      />
    );
  }

  const isPdf = PDFTYPES.includes(type);

  if (isPdf) {
    return (
      <iframe
        src={src}
        className="w-full max-w-[100px] h-auto max-h-[100px] min-h-[60px]"
      />
    );
  }
};

export default memo(Preview);
