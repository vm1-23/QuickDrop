"use client";

import { useRef,useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {upload} from "@vercel/blob/client"
import { PutBlobResult } from "@vercel/blob";


export default function Home() {
  const [progress,setProgress] = useState(0);
  const [uploading,setUploading] = useState(false); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [blobUrl,setBlobUrl] = useState<PutBlobResult | null>(null);
  const [selectedFileName,setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = () =>{
    if(fileInputRef.current?.files?.[0]){
      setSelectedFileName(fileInputRef.current?.files?.[0].name);
    }
    else{
      setSelectedFileName(null);
    }
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("here")
    setProgress(0);
    if(!fileInputRef.current?.files?.[0]){
      throw new Error("Select a file to upload");
    }

    const file = fileInputRef.current?.files?.[0];
    setUploading(true);
    
    try{
      console.log("Uploading file:", file?.name); 
      const blob = await upload(`${file?.name}`,file,{
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: (progressEvent)=>{
          setProgress(progressEvent.percentage);


     }})
      setBlobUrl(blob);
      console.log("File uploaded successfully. Blob URL:", blob.url);
    }catch(error){
      console.log(error);
    }finally{
      setUploading(false);
    }
  }

  
  return (
    <>
      <section className="flex bg-slate-100 flex-col items-center justify-center">
        <div className="hero p-7 flex flex-col items-center justify-center mx-auto">
          <Image src="/cloudupload.svg" alt="Cloud" width={60} height={60}/>
          <h1 className="py-3 text-4xl font-bold text-slate-700 text-center">Simple and Efficient File Sharing</h1>
        </div>

        <div className="upload-box w-[90%] sm:w-[70%] bg-white border border-slate-200 p-4 pt-5 rounded-lg flex flex-col items-center justify-center mb-20">
          <h2 className="text-2xl font-semibold text-slate-700 mb-5">Upload Your Files</h2>

          <div className="w-[100%] flex space-between justify-between">
            <form onSubmit={handleFormSubmit} className="flex flex-col cursor-pointer items-center justify-around py-8 m-8 w-[80%] md:w-[40%] h-64 border-2 border-dashed border-slate-500 rounded-lg">
              <input ref={fileInputRef} type="file" required onChange={handleFileChange} className="hidden w-full h-full"></input>
              <label onClick={()=>fileInputRef.current?.click()} className="text-lg font-medium cursor-pointer">{selectedFileName || "Choose a File to Upload"}</label>
              <p className="text-lg font-medium text-slate-400">Or Drag and Drop</p>
              <Button type="submit" className="bg-red-400">Select File</Button>
            </form>
            <div className="hidden md:block">HI</div>
          </div>
        </div>
        
      </section>
    </>
  );
}

// 'use client';
 
// import { type PutBlobResult } from '@vercel/blob';
// import { upload } from '@vercel/blob/client';
// import { useState, useRef } from 'react';
//    import { put } from "@vercel/blob";
// export default function AvatarUploadPage() {

//   const inputFileRef = useRef<HTMLInputElement>(null);
//   const [blob, setBlob] = useState<PutBlobResult | null>(null);
//   return (
//     <>
//       <h1>Upload Your Avatar</h1>
 
//       <form
//         onSubmit={async (event) => {
//           event.preventDefault();
 
//           if (!inputFileRef.current?.files) {
//             throw new Error('No file selected');
//           }

//           const file = inputFileRef.current.files[0];
 
//           const newBlob = await upload(file.name, file, {
//             access: 'public',
//             handleUploadUrl: '/api/upload',
//           });
 
//           setBlob(newBlob);
//         }}
//       >
//         <input name="file" ref={inputFileRef} type="file" required />
//         <button type="submit">Upload</button>
//       </form>
//       {blob && (
//         <div>
//           Blob url: <a href={blob.url}>{blob.url}</a>
//         </div>
//       )}
//     </>
//   );
// }