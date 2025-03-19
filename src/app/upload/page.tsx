import { getAllFiles } from "@/actions/upload/getAllUploadedFiles";
import FileList from "@/components/fileList";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const page = async () => {
  const uploadedFiles = await getAllFiles();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="h-full pr-4">
        <FileList uploadedFiles={uploadedFiles.files || []} />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};

export default page;
