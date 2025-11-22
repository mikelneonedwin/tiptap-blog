"use client";

import { Card, CardContent } from "@/components/ui/card";
import clsx from "clsx";
import { Upload } from "lucide-react";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageDropzoneProps {
  onFileAccepted: (file: File) => void;
  aspectRatio?: number; // width / height
  imageSrc?: string;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onFileAccepted,
  imageSrc,
  aspectRatio = 1, // default to square
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <Card
      {...getRootProps()}
      className={clsx(
        getRootProps().className,
        "border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer transition-colors duration-150 w-full",
        isDragActive ? "border-blue-500 bg-blue-50" : "bg-white",
        imageSrc && "py-0! border-0!",
      )}
      style={{
        ...getRootProps().style,
        aspectRatio: aspectRatio.toString(),
      }}
    >
      <input {...getInputProps()} />
      <CardContent
        className={clsx(
          "flex flex-col items-center justify-center gap-2 text-center size-full",
          imageSrc && "px-0!",
        )}
      >
        {imageSrc ? (
          <div className="size-full relative overflow-hidden">
            <Image
              src={imageSrc}
              alt="Cover preview"
              fill
              className="size-full object-cover rounded-xl"
            />
          </div>
        ) : (
          <>
            <Upload className="size-8 text-gray-400" />
            <p className="text-gray-500">
              {isDragActive
                ? "Drop the image here..."
                : "Drag and drop an image here, or click to upload"}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
