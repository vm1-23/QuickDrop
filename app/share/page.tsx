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
  <section className="flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
    <div className="upload-box w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] bg-white/10 backdrop-blur-md border border-white/20 p-6 pt-8 rounded-2xl flex flex-col items-center justify-center mb-20 shadow-[0_0_25px_rgba(255,0,0,0.2)] transition-all">
      <Image src="/cloudupload.svg" alt="Share" width={60} height={60} className="opacity-90" />

      <h1
        className={`py-3 text-3xl md:text-4xl font-bold mb-3 text-center tracking-wide drop-shadow-[0_0_8px_rgba(255,0,0,0.4)] ${
          shareLink ? "text-green-400" : "text-red-400"
        }`}
      >
        {shareLink ? "LINK GENERATED" : "GENERATE SHARE LINK"}
      </h1>

      <div className="w-full bg-white/5 border border-white/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
            <FileIcon className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white/90 truncate mb-1">
              {filename}
            </p>
            <p className="text-xs text-white/60">
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
              className="text-base font-medium text-white/90 flex items-center gap-2 mb-3"
            >
              Link Expiration Time:
            </Label>
            <select
              id="expiration"
              value={expirationHours}
              onChange={(e) => setExpirationHours(Number(e.target.value))}
              className="w-full p-3 border border-white/20 bg-white/10 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent backdrop-blur-sm"
            >
              <option className="text-black" value={1}>1 Hour</option>
              <option className="text-black" value={12}>12 Hours</option>
              <option className="text-black" value={48}>1 Day</option>
              <option className="text-black" value={168}>1 Week</option>
            </select>
          </div>

          <div className="bg-white/5 border border-white/20 rounded-lg p-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={oneTimeDownload}
                onChange={(e) => setOneTimeDownload(e.target.checked)}
                className="mt-1 w-4 h-4 accent-red-500 cursor-pointer"
              />
              <div className="flex-1">
                <span className="text-base font-medium text-white/90">
                  One-time download
                </span>
              </div>
            </label>
          </div>

          <Button
            onClick={handleGenerateLink}
            disabled={loading}
            className="w-full bg-red-500/90 hover:bg-red-600 text-white font-semibold py-6 text-base shadow-[0_0_12px_rgba(255,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] transition-all"
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
            className="w-full text-white/70 hover:text-white text-sm font-medium py-2"
          >
            ← Back to Upload
          </button>
        </div>
      ) : (
        <div className="w-full space-y-5">

          <div>
            <Label
              htmlFor="shareLink"
              className="text-base font-medium text-white/90 mb-2 flex items-center gap-2"
            >
              <Link2 className="w-4 h-4 text-red-400" />
              Link
            </Label>
            <p className="text-sm text-green-400 mb-2">
              Expires: {new Date(expiresAt).toLocaleString()}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="shareLink"
                value={shareLink}
                readOnly
                className="flex-1 font-mono text-sm p-3 border border-white/20 bg-white/10 text-white backdrop-blur-sm"
              />
              <Button
                onClick={copyToClipboard}
                className={`${
                  copied
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-white/10 hover:bg-white/20"
                } text-white px-6 border border-white/20`}
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
            <p className="text-xs text-white/60 mt-2">
              Share this link with anyone to let them download your file.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-red-500/90 hover:bg-red-600 text-white font-semibold py-5 shadow-[0_0_12px_rgba(255,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]"
            >
              Upload Another File
            </Button>
          </div>
        </div>
      )}
    </div>
  </section>
);
