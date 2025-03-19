// import { persist, createJSONStorage } from "zustand/middleware";
// import { fileToBase64 } from "@/lib/utils";

// interface LocalFile {
//   file: string;
//   size: number;
// }

// interface States {
//   files: LocalFile[];
// }

// export const useFileStore = create(
//   persist<States & Actions>(
//     (set) => ({
//       files: [],
//       add: async (newFiles: File[]) => {
//         const localFiles: LocalFile[] = await Promise.all(
//           newFiles.map(async (file) => {
//             const base64File = await fileToBase64(file);
//             return {
//               file: base64File,
//               size: file.size,
//             };
//           })
//         );

//         set((state) => ({ files: [...state.files, ...newFiles] }));
//       },
//     }),
//     {
//       name: "file-store",
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// );
