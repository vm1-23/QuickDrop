
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
    <section className="flex flex-col items-center justify-center py-0 min-h-screen bg-transparent text-white">
      <div className="upload-box w-[90%] sm:w-[70%] bg-white/10 border border-white/20 backdrop-blur-md p-4 pt-12 rounded-2xl shadow-[0_0_20px_rgba(255,0,0,0.2)] flex flex-col items-center justify-center mb-20 transition-all">
        <Image
          src="/cloudupload.svg"
          alt="Cloud"
          width={60}
          height={60}
          className="opacity-80"
        />
        <h1 className="py-3 text-4xl font-bold text-red-400 text-center tracking-wide drop-shadow-[0_0_8px_rgba(255,0,0,0.4)]">
          DROP IT LIKE IT'S HOT
        </h1>

        <div className="w-full flex flex-col justify-around items-center">
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
            className="flex flex-col items-center justify-around py-8 m-8 w-[80%] h-64 border-2 border-dashed border-white/30 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer"
          >
            <input
              ref={fileInputRef}
              type="file"
              required
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              className="flex flex-col items-center justify-center w-full h-full select-none"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-lg font-medium text-white/90">
                {selectedFileName || "Choose or Drop a File to Upload"}
              </span>
              <p className="text-lg font-medium text-white/50">
                Or drag and drop it here
              </p>
            </div>

            <Button
              type="submit"
              className="bg-red-500/80 hover:bg-red-600/90 mt-4 text-white font-semibold transition-all shadow-[0_0_12px_rgba(255,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload File"}
            </Button>
          </form>

          <div className="flex flex-col items-center justify-center m-8">
            {uploading && (
              <div className="text-center">
                <h1 className="text-lg font-medium mb-2 text-red-300">
                  Uploading file...
                </h1>
                <div className="w-64 bg-white/10 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-red-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-white/70">
                  {progress.toFixed(0)}%
                </p>
              </div>
            )}
            {blobUrl && !uploading && (
              <div className="text-center">
                <h1 className="text-lg font-medium text-green-400 mb-2">
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
