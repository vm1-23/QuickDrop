import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { del } from '@vercel/blob';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const resolvedParams = await params;

    const { data: file, error: fetchError } = await supabase
      .from('files')
      .select('*')
      .eq('id', resolvedParams.id)
      .single();



    if (fetchError || !file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    if (file.one_time_download) {
      try {        
        await supabase
          .from('files')
          .delete()
          .eq('id', resolvedParams.id);


        await del(file.blob_url);
        
        console.log(`Deleted one-time download: ${file.filename}`);

        return NextResponse.json({ 
          success: true,
          message: 'One-time download completed and deleted',
          oneTimeDownload: true
        });
      } catch (error) {
        console.error('Failed to delete one-time file:', error);
        return NextResponse.json(
          { error: 'Failed to delete file after download' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Download tracked',
      oneTimeDownload: false
    });

  } catch (error) {
    console.error('Error tracking download:', error);
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    );
  }
}