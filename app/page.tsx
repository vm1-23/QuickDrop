
"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { upload } from "@vercel/blob/client";
import { PutBlobResult } from "@vercel/blob";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [blobUrl, setBlobUrl] = useState<PutBlobResult | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = () => {
    if (fileInputRef.current?.files?.[0]) {
      setSelectedFileName(fileInputRef.current?.files?.[0].name);
    } else {
      setSelectedFileName(null);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Starting upload");
    setProgress(0);

    if (!fileInputRef.current?.files?.[0]) {
      alert("Select a file to upload");
      return;
    }

    const file = fileInputRef.current?.files?.[0];
    setUploading(true);

    try {
      console.log("Uploading file:", file.name, file.type);

      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: (progressEvent) => {
          setProgress(progressEvent.percentage);
          console.log("Progress:", progressEvent.percentage);
        },
      });

      setBlobUrl(newBlob);
      console.log("File uploaded successfully. Blob URL:", newBlob.url);
      const params = new URLSearchParams({
        blobUrl: newBlob.url,
        filename: file.name,
        fileSize: file.size.toString(),
      });
      router.push(`/share?${params.toString()}`);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed: " + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <section className="flex bg-transparent flex-col items-center justify-center py-0">
        <div className="upload-box w-[90%] sm:w-[70%] bg-white/30 border border-slate-500 p-4 pt-12 rounded-lg flex flex-col items-center justify-center mb-20">
          <Image src="/cloudupload.svg" alt="Cloud" width={60} height={60} />
          <h1 className="py-3 text-4xl font-bold text-red-400 text-center">
            SIMPLE AND EFFICIENT FILE SHARING
          </h1>
          <div className="w-[100%] flex flex-col space-between justify-around items-center">
            <form
              onSubmit={handleFormSubmit}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  if (fileInputRef.current) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInputRef.current.files = dataTransfer.files;
                  }
                  setSelectedFileName(file.name);
                }
              }}
              className="flex flex-col items-center justify-around py-8 m-8 w-[80%] h-64 border-2 border-dashed border-slate-500 rounded-lg hover:bg-white/40 transition"
            >
              <input
                ref={fileInputRef}
                type="file"
                required
                onChange={handleFileChange}
                className="hidden"
              />


              <div
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer select-none"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-lg font-medium">
                  {selectedFileName || "Choose or Drop a File to Upload"}
                </span>
                <p className="text-lg font-medium text-slate-400">
                  Or drag and drop it here
                </p>
              </div>
              <Button
                type="submit"
                className="bg-red-400 mt-4"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload File"}
              </Button>
            </form>

            <div className="flex flex-col items-center justify-center m-8">
              {uploading && (
                <div className="text-center">
                  <h1 className="text-lg font-medium mb-2">
                    Uploading file...
                  </h1>
                  <div className="w-64 bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-red-400 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {progress.toFixed(0)}%
                  </p>
                </div>
              )}
              {blobUrl && !uploading && (
                <div className="text-center">
                  <h1 className="text-lg font-medium text-green-600 mb-2">
                    Upload Successful!
                  </h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
