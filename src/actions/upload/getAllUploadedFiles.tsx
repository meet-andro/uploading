"use server";

import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { fileTypeFromFile } from "file-type";

export async function getAllFiles() {
  try {
    const UPLOAD_DIR = join(process.cwd(), "src", "assets");

    if (!existsSync(UPLOAD_DIR))
      return { status: false, error: "Directory not found" };

    const uploadedFiles = readdirSync(UPLOAD_DIR);

    const allFile = await Promise.all(
      uploadedFiles.map(async (fileName) => {
        const filePath = UPLOAD_DIR.concat(`/${fileName}`);

        const type = await fileTypeFromFile(filePath);
        const fileStats = await statSync(filePath);

        return {
          uploaded_path: UPLOAD_DIR.concat(`/${fileName}`),
          type: type?.ext,
          size: fileStats.size,
          created_at: new Date(fileStats.birthtimeMs),
        };
      })
    );

    const sortedAllFile = allFile.sort((a, b) =>
      a.created_at > b.created_at ? -1 : 1
    );

    return {
      status: true,
      files: sortedAllFile,
    };
  } catch (error) {
    console.log(error);
    return { status: false };
  }
}
