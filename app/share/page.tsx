"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Link2, FileIcon } from "lucide-react";
import Image from "next/image";

export default function SharePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [shareLink, setShareLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expirationHours, setExpirationHours] = useState<number>(24);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [oneTimeDownload, setOneTimeDownload] = useState<boolean>(false);

  const blobUrl = searchParams.get("blobUrl");
  const filename = searchParams.get("filename");
  const fileSize = searchParams.get("fileSize");

  useEffect(() => {
    if (!blobUrl || !filename) {
      router.push("/");
    }
  }, [blobUrl, filename, router]);

  const handleGenerateLink = async () => {
    if (!blobUrl || !filename) return;

    setLoading(true);
    
    try {
      const response = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blobUrl,
          filename,
          fileSize: fileSize || 0,
          expirationHours,
          oneTimeDownload,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate share link");
      }

      const data = await response.json();
      setShareLink(data.shareLink);
      setExpiresAt(data.expiresAt);
    } catch (error) {
      console.error("Error generating link:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const formatFileSize = (size: string | null) => {
    if (!size) return "Unknown";
    const bytes = Number(size);
    const mb = bytes / 1024 / 1024;
    if (mb < 1) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  if (!blobUrl || !filename) {
    return null;
  }

  return (
    <section className="flex bg-transparent flex-col items-center justify-center min-h-screen">
      <div className="upload-box w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] bg-white/50 backdrop-blur-sm border border-slate-200 p-6 pt-8 rounded-lg flex flex-col items-center justify-center mb-20">
        <Image src="/cloudupload.svg" alt="Share" width={60} height={60} />
        
        <h1 className={`py-3 text-3xl md:text-4xl font-bold mb-3 text-center ${shareLink? 'text-green-600' : 'text-red-400'}`}>
          {shareLink ? "LINK GENERATED" : "GENERATE SHARE LINK"}
        </h1>
        

        <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FileIcon className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate mb-1">
                {filename}
              </p>
              <p className="text-xs text-slate-500">
                Size: {formatFileSize(fileSize)}
              </p>
            </div>
          </div>
        </div>

        {!shareLink ? (
          <div className="w-full space-y-5">
            <div>
              <Label 
                htmlFor="expiration" 
                className="text-base font-medium text-slate-700 flex items-center gap-2 mb-3"
              >
                Link Expiration Time: 
              </Label>
              <select
                id="expiration"
                value={expirationHours}
                onChange={(e) => setExpirationHours(Number(e.target.value))}
                className="w-full p-3 border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
              >
                <option value={1}>1 Hour</option>
                <option value={12}>12 Hours</option>
                <option value={48}>1 Day</option>
                <option value={168}>1 Week</option>
              </select>
            </div>

            <div className="bg-slate-50/40 border border-slate-200 rounded-lg p-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={oneTimeDownload}
                  onChange={(e) => setOneTimeDownload(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-red-400 cursor-pointer"
                />
                <div className="flex-1">
                  <span className="text-base font-medium text-slate-700">
                    One-time download
                  </span>

                </div>
              </label>
            </div>

            <Button
              onClick={handleGenerateLink}
              disabled={loading}
              className="w-full bg-red-400 hover:bg-red-500 text-white font-medium py-6 text-base"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating Link...
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 mr-2" />
                  Generate Share Link
                </>
              )}
            </Button>

            <button
              onClick={() => router.push("/")}
              className="w-full text-slate-600 hover:text-slate-800 text-sm font-medium py-2"
            >
              ← Back to Upload
            </button>
          </div>
        ) : (
          <div className="w-full space-y-5">
            <div>
              <Label 
                htmlFor="shareLink" 
                className="text-base font-medium text-slate-700 mb-2 flex items-center gap-2"
              >
                <Link2 className="w-4 h-4" />
                Link
              </Label>
              <p className="text-sm text-green-700 mb-2">
                Expires: {new Date(expiresAt).toLocaleString()}
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="shareLink"
                  value={shareLink}
                  readOnly
                  className="flex-1 font-mono text-sm p-3 border-slate-300"
                />
                <Button
                  onClick={copyToClipboard}
                  className={`${
                    copied 
                      ? "bg-green-500 hover:bg-green-600" 
                      : "bg-slate-700 hover:bg-slate-800"
                  } text-white px-6`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Share this link with anyone to let them download your file
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={() => router.push("/")}
                className="w-full bg-red-400 hover:bg-red-500 text-white font-medium py-5"
              >
                Upload Another File
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}