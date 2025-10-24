import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { blobUrl, filename, fileSize, expirationHours, oneTimeDownload } = await request.json();
    console.log(expirationHours)
    
    if (!blobUrl || !filename || !expirationHours) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const fileId = nanoid(10);
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + Number(expirationHours));
    
    const { data, error } = await supabase
      .from('files') 
      .insert({
        id: fileId,
        blob_url: blobUrl,
        filename: filename,
        file_size: fileSize || 0,
        expires_at: expiresAt.toISOString(),
        one_time_download: oneTimeDownload || false
      })
      .select(); 

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to create file record', details: error.message },
        { status: 500 }
      );
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    return NextResponse.json({
      success: true,
      shareLink: `${baseUrl}/download/${fileId}`,
      fileId,
      expiresAt: expiresAt.toISOString(),
      oneTimeDownload: oneTimeDownload || false
    });
    
  } catch (error) {
    console.error('Error creating file record:', error);
    return NextResponse.json(
      { error: 'Failed to create file record' },
      { status: 500 }
    );
  }
}