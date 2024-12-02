"use client"

import { Button } from "@/components/ui/button";
import DragAndDrop from "./dragdrop/DragAndDrop";
import { useState } from "react";

export default function Component() {
  const [showStartButton, setShowStartButton] = useState<boolean>(false);

  const handleFileUpload = (files: File[]) => {
    setShowStartButton(files.length != 0 ? true : false )
    console.log(files);
  };
  
  function onClickStart(){
    alert("soon")
  }

  function Start(){
    if (showStartButton) {
      return (<Button onClick={onClickStart}>Convert image</Button>)
    }
    return
  }
  return (
    <div className="flex flex-col min-h-screen items-center gap-4 p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">ASCII ART</h1>
        <p className="text-gray-500 dark:text-gray-400">File should be JPEG, PNG or WebP</p>
      </div>
      
      <DragAndDrop
        onFileUpload={handleFileUpload}
        maxFiles={1}
        maxSizeMB={20}
      />

      <Start/>
    </div>
  )
}