"use server";

import { createWriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";

interface UploadChunkPayload {
  current_chunk_index: number;
  id: string;
  buffer: ArrayBuffer;
  total_chunks: number;
  name: string;
}

function writeChunk(filePath: string, buffer: ArrayBuffer) {
  return new Promise<void>((resolve, reject) => {
    const stream = createWriteStream(filePath, { flags: "a" });
    stream.write(Buffer.from(buffer));
    stream.end();

    stream.on("finish", () => resolve());
    stream.on("error", (err) => reject(err));
  });
}

export async function uploadChunk(payload: UploadChunkPayload) {
  try {
    const UPLOAD_DIR = join(process.cwd(), "src", "assets");

    if (!payload.id)
      return {
        status: false,
        chunk_index: payload.current_chunk_index,
        id: payload.id,
      };

    if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR);

    const type = payload.name.split(".").at(-1);

    const filePath = join(UPLOAD_DIR, `${payload.name}-${payload.id}.${type}`);

    await writeChunk(filePath, payload.buffer);

    return {
      status: true,
      uploaded_path: filePath,
      chunk_index: payload.current_chunk_index,
      id: payload.id,
    };
  } catch (error) {
    console.log(error, "Error");

    return {
      status: false,
      chunk_index: payload.current_chunk_index,
      id: payload.id,
    };
  }
}
