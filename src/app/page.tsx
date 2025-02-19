"use client"

import { Button } from "@/components/ui/button";
import DragAndDrop from "./dragdrop/DragAndDrop";
import { useState } from "react";
import { ASCIIArt, BWFilter } from "./images/Images";

export default function Component() {
  const [showStartButton, setShowStartButton] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (files: File[]) => {
    setShowStartButton(files.length !== 0);
    setFiles(files);
  };

  const onClickStart = async () => {
    try {
      const Files = await Promise.all(
        files.map((file) => ASCIIArt(file))  
      );
      
      Files.forEach((File) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(File);
        link.download = File.name;
        link.click();
      });
    } catch (error) {
      console.log("Error when applying the filter", error);
    }
  };

  function Start() {
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
        maxFiles={10}
        maxSizeMB={20}
      />

      <Start />
    </div>
  )
}