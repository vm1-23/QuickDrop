"use client";

import { useRef } from "react";
import Image from "next/image";
import Form from "next/form";
import { Button } from "@/components/ui/button";


export default function Home() {

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = async (formData: FormData) => {

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
            <Form onClick={()=>{fileInputRef.current?.click()
              console.log(fileInputRef)
            }} action={handleFormSubmit} className="flex flex-col cursor-pointer items-center justify-around py-8 m-8 w-[80%] md:w-[40%] h-64 border-2 border-dashed border-slate-500 rounded-lg">
              <input ref={fileInputRef} type="file" className="hidden w-full h-full"></input>
              <label className="text-lg font-medium cursor-pointer">Choose a file to upload</label>
              <p className="text-lg font-medium text-slate-400">Or Drag and Drop</p>
              <Button  className="bg-red-400">Select File</Button>
            </Form>
            <div className="hidden md:block">HI</div>
          </div>
        </div>
        
      </section>
    </>
  );
}
