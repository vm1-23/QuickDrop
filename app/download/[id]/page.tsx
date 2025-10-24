import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import DownloadBox from './DownloadBox';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const resolvedParams = await params;

  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();


  if (error || !data) {
    console.error('File not found:', error);
    notFound();
  }

  const file = data;
  const now = new Date();
  const expiresAt = new Date(file.expires_at);
  console.log(file.one_time_download);

//expiry check
  if (now > expiresAt) {

    try {
      const { del } = await import('@vercel/blob');
      await del(file.blob_url);
      await supabase.from('files').delete().eq('id', resolvedParams.id);
    } catch (err) {
      console.error('Failed to delete expired file:', err);
    }

    return (
      <section className="flex bg-transparent flex-col items-center justify-center min-h-screen p-4">
        <div className="w-[90%] sm:w-[70%] md:w-[50%] bg-white/90 backdrop-blur-md border border-slate-200/50 shadow-2xl p-8 rounded-lg text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-2xl font-bold mb-4 text-red-600">Link Expired</h1>
          <p className="text-slate-600">This download link has expired.</p>
          <p className="text-sm text-slate-500 mt-2">
            Expired on: {expiresAt.toLocaleString()}
          </p>
        </div>
      </section>
    );
  }


  return (
    <DownloadBox
      fileId={file.id}
      filename={file.filename}
      blobUrl={file.blob_url}
      expiresAt={file.expires_at}
      fileSize={file.file_size}
      oneTimeDownload={file.one_time_download}
    />
  );
}