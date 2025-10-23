//copy pasted from vercel blob docs with modified allowedContentTypes and maximumSizeInBytes

import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
 
  try {
    console.log('Token found:', !!process.env.BLOB_READ_WRITE_TOKEN);

    const jsonResponse = await handleUpload({
      body,
      request,
      
      onBeforeGenerateToken: async (
        pathname,
        /* clientPayload */
      ) => {
        // Generate a client token for the browser to upload the file
        // Make sure to authenticate and authorize users before generating the token.
        // Otherwise, you're allowing anonymous uploads.
 
        return {
          allowedContentTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf', 'text/*', 'application/*'],
          addRandomSuffix: true,
          maximumSizeInBytes: 2000 * 1024 * 1024,
          // callbackUrl: 'https://example.com/api/avatar/upload',
          // optional, `callbackUrl` is automatically computed when hosted on Vercel
          tokenPayload: JSON.stringify({
            // optional, sent to your server on upload completion
            // you could pass a user id from auth, or a value from clientPayload
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Called by Vercel API on client upload completion
        // Use tools like ngrok if you want this to work locally
 
        console.log('blob upload completed', blob, tokenPayload);
 
        try {
          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });
        } catch (error) {
          throw new Error('Could not update user');
        }
      },
    });
 
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    );
  }
}

