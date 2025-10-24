'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Clock, FileIcon} from 'lucide-react';
import Image from 'next/image';

interface DownloadClientProps {
  fileId: string;
  filename: string;
  blobUrl: string;
  expiresAt: string;
  fileSize?: number;
  oneTimeDownload?: boolean;
}

export default function DownloadBox({ 
  fileId,
  filename, 
  blobUrl, 
  expiresAt,
  fileSize,
  oneTimeDownload
}: DownloadClientProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

const handleDownload = async () => {
  setDownloading(true);

  try {
    const downloadUrl = `${blobUrl}?download=1&name=${encodeURIComponent(filename)}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    await fetch(`${window.location.origin}/api/files/download/${fileId}`, {
      method: 'POST',
    });

    setDownloadComplete(true);

    if (oneTimeDownload) {
      setTimeout(() => window.location.reload(), 2000);
    }
  } catch (error) {
    console.error('Download error:', error);
    alert('Failed to download file');
  } finally {
    setDownloading(false);
  }
};


  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / 1024 / 1024;
    if (mb < 1) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${mb.toFixed(2)} MB`;
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''}`;
    }
    
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min`;
    }
    
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

return (
  <>
    <section className="flex flex-col items-center justify-center py-0 min-h-screen bg-transparent text-white">
      <div className="upload-box w-[90%] sm:w-[70%] bg-white/10 backdrop-blur-md border border-white/20 p-6 pt-12 rounded-2xl flex flex-col items-center justify-center mb-20 shadow-[0_0_25px_rgba(255,0,0,0.2)] transition-all">
        <Image
          src="/cloudupload.svg"
          alt="Cloud"
          width={60}
          height={60}
          className="opacity-90"
        />
        <h1 className="py-3 text-4xl font-bold text-red-400 text-center drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]">
          DOWNLOAD YOUR FILE
        </h1>

        <div className="w-full flex flex-col justify-around items-center py-8">
          <div className="flex flex-col items-center justify-center bg-white/5 border border-white/20 rounded-lg w-[80%] py-8 px-4 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <FileIcon className="w-10 h-10 text-red-400 mb-3" />
            <span className="text-lg font-semibold text-white/90">
              {filename}
            </span>
            <p className="text-sm text-white/60 mt-1">
              {formatFileSize(fileSize)}
            </p>
            <div className="flex items-center gap-2 mt-2 text-white/60 text-sm">
              <Clock className="w-4 h-4 text-red-400" />
              <span>Expires in: {getTimeRemaining()}</span>
            </div>

            {oneTimeDownload && !downloadComplete && (
              <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3 mt-4 w-full flex items-start gap-2 backdrop-blur-sm">
                <div>
                  <p className="text-red-300 font-semibold text-sm">
                    One-time Download!
                  </p>
                  <p className="text-red-200 text-xs mt-1">
                    This link will be deleted after download.
                  </p>
                </div>
              </div>
            )}

            {downloadComplete && oneTimeDownload && (
              <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3 mt-4 w-full backdrop-blur-sm">
                <p className="text-green-300 font-semibold text-sm text-center">
                  ✓ Download Complete! Link deleted.
                </p>
                <p className="text-green-200 text-xs text-center mt-1">
                  Redirecting...
                </p>
              </div>
            )}

            <Button
              onClick={handleDownload}
              disabled={downloading || (downloadComplete && oneTimeDownload)}
              className="bg-red-500/90 hover:bg-red-600 mt-5 px-8 py-6 text-white font-semibold shadow-[0_0_12px_rgba(255,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] transition-all"
            >
              {downloading ? (
                <>
                  <Download className="w-4 h-4 mr-2 animate-bounce" />
                  Downloading...
                </>
              ) : downloadComplete && oneTimeDownload ? (
                "✓ Downloaded"
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  </>
)}
