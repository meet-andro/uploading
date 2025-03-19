import FileUploader from "@/components/FileUploader";
import { TypographyH2 } from "@/components/ui/h2";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="w-full h-dvh flex flex-col overflow-hidden p-6 gap-y-4">
      <div className="space-y-4">
        <TypographyH2>Upload a file</TypographyH2>
        <FileUploader />
      </div>
      {children}
    </div>
  );
};

export default layout;
