"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { getCroppedDataUrl } from "@/features/blog/client-utils";
import type { CroppedImageArea } from "@/features/blog/types";
import { Cropper } from "@origin-space/image-cropper";
import { useState } from "react";

interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  aspectRatio: number;
  onCropComplete: (croppedImage: string) => void;
}

export function ImageCropDialog({
  open,
  onOpenChange,
  imageSrc,
  aspectRatio,
  onCropComplete,
}: ImageCropDialogProps) {
  const [cropData, setCropData] = useState<CroppedImageArea | null>(null);
  const [zoom, setZoom] = useState(1);

  const handleCrop = () => {
    if (!cropData) return;
    const img = document.querySelector("img.cropper-image") as HTMLImageElement;
    if (!img) return;
    const croppedImage = getCroppedDataUrl(img, cropData);
    onCropComplete(croppedImage);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Profile Picture</DialogTitle>
          <DialogDescription>
            Adjust the image to fit within the square frame
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Cropper.Root
            image={imageSrc || "/placeholder.svg"}
            aspectRatio={aspectRatio} // square
            onCropChange={setCropData}
            zoom={zoom}
            minZoom={1}
            maxZoom={3}
            className="relative flex h-[300px] w-full cursor-move touch-none items-center justify-center overflow-hidden rounded-lg border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Cropper.Description className="sr-only" />
            <Cropper.Image
              className="pointer-events-none h-full w-full select-none object-cover cropper-image"
              crossOrigin="anonymous"
            />
            <Cropper.CropArea className="pointer-events-none absolute border-2 border-dashed border-background shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] rounded-lg" />
          </Cropper.Root>

          <div className="space-y-2">
            <label className="text-sm font-medium">Zoom</label>
            <Slider
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              min={1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!cropData} onClick={handleCrop}>
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
