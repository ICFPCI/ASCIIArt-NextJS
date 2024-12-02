import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { ImageIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileObject {
  file: File;
  preview: string;
}

interface ImageDragDropProps {
  onFileUpload?: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export default function DragAndDrop({ 
  onFileUpload, 
  maxFiles = 5, 
  maxSizeMB = 5 
}: ImageDragDropProps){
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [files, setFiles] = useState<FileObject[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropContainerRef = useRef<HTMLDivElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (dropContainerRef.current && !dropContainerRef.current.contains(e.relatedTarget as Node)) {
      setDragActive(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );

    processFiles(droppedFiles);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files 
      ? Array.from(e.target.files).filter(
          file => file.type.startsWith('image/')
        )
      : [];

    processFiles(selectedFiles);
  };

  const processFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(
      file => file.size <= maxSizeMB * 1024 * 1024
    );

    const filesToAdd = validFiles.slice(0, maxFiles - files.length);

    const newFileObjects: FileObject[] = filesToAdd.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    const updatedFiles = [...files, ...newFileObjects];
    setFiles(updatedFiles);

    if (onFileUpload) {
      onFileUpload(updatedFiles.map(f => f.file));
    }
  };

  const removeFile = (fileToRemove: File) => {
    const updatedFiles = files.filter(
      (fileObj) => fileObj.file !== fileToRemove
    );
    setFiles(updatedFiles);

    URL.revokeObjectURL(
      files.find(f => f.file === fileToRemove)?.preview || ''
    );

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    if (onFileUpload) {
      onFileUpload(updatedFiles.map(f => f.file));
    }
  };

  return (
    <div
      ref={dropContainerRef}
      className={`
        w-full max-w-2xl border-dashed border-2 rounded-lg
        transition-colors duration-200
        ${dragActive 
          ? 'border-gray-300 bg-gray-100' 
          : 'border-gray-200 border-gray-300/80 dark:border-gray-800/80'
        }
      `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <div>
        <div className="w-full py-32 flex flex-col items-center gap-2 z-40">
          <ImageIcon className="text-6xl z-40" />
          <span className="text-sm text-gray-500 dark:text-gray-400 z-40">
            Drag and Drop your image
          </span>
        </div>
        <div className="p-4 border-t grid gap-2 z-40">
          <Button onClick={() => inputRef.current?.click()}>
            Upload Image
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap w-auto justify-center px-4 gap-4">
        {files.map((fileObj, index) => (
          <div key={index} className="relative">
          <Image
            src={fileObj.preview}
            alt={`Preview of image number ${index}`}
            width={200}
            height={200}
            className="aspect-square w-[200px] h-[200px] object-cover border border-zinc-200 w-auto rounded-lg overflow-hidden dark:border-zinc-800 mb-4"
          />
          <Button  onClick={() => removeFile(fileObj.file)} className="absolute top-1 right-1 h-6 w-6 p-1">
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Remove image</span>
          </Button>
        </div>
        ))}
      </div>
    </div>
  );
};