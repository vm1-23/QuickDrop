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

    // ✅ Always resolves to root domain
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
      <section className="flex bg-transparent flex-col items-center justify-center py-0">
        <div className="upload-box w-[90%] sm:w-[70%] bg-white/30 backdrop-blur-md border border-slate-500 p-4 pt-12 rounded-lg flex flex-col items-center justify-center mb-20">
          
          <Image src="/cloudupload.svg" alt="Cloud" width={60} height={60} />
          <h1 className="py-3 text-4xl font-bold text-red-400 text-center">
            DOWNLOAD YOUR FILE
          </h1>

          <div className="w-[100%] flex flex-col space-between justify-around items-center py-8">
            <div className="flex flex-col items-center justify-center border-slate-500 rounded-lg w-[80%] py-8 px-4">
              <FileIcon className="w-10 h-10 text-slate-600 mb-3" />
              <span className="text-lg font-medium">{filename}</span>
              <p className="text-sm text-slate-500 mt-1">{formatFileSize(fileSize)}</p>
              <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                <Clock className="w-4 h-4" />
                <span>Expires in: {getTimeRemaining()}</span>
              </div>


              {oneTimeDownload && !downloadComplete && (
                <div className="bg-orange-50 border border-orange-300 rounded-lg p-3 mt-4 w-full flex items-start gap-2">
                  <div>
                    <p className="text-orange-800 font-semibold text-sm">
                      One-time Download!
                    </p>
                    <p className="text-orange-700 text-xs mt-1">
                      This link will be deleted after download
                    </p>
                  </div>
                </div>
              )}


              {downloadComplete && oneTimeDownload && (
                <div className="bg-green-50 border border-green-300 rounded-lg p-3 mt-4 w-full">
                  <p className="text-green-800 font-semibold text-sm text-center">
                    ✓ Download Complete! Link deleted.
                  </p>
                  <p className="text-green-700 text-xs text-center mt-1">
                    Redirecting...
                  </p>
                </div>
              )}

              <Button
                onClick={handleDownload}
                disabled={downloading || (downloadComplete && oneTimeDownload)}
                className="bg-red-400 hover:bg-red-500 mt-5 px-8"
              >
                {downloading ? (
                  <>
                    <Download className="w-4 h-4 mr-2 animate-bounce" />
                    Downloading...
                  </>
                ) : downloadComplete && oneTimeDownload ? (
                  '✓ Downloaded'
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
  );
}