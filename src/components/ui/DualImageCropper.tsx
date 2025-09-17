import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";

interface CropData {
  x: number;
  y: number;
  zoom: number;
  aspect: number;
  croppedAreaPixels?: { width: number; height: number; x: number; y: number };
}

interface DualImageCropperProps {
  imageUrl: string;
  onChange: (data: { landscape: CropData; portrait: CropData }) => void;
  initialLandscape?: CropData;
  initialPortrait?: CropData;
  className?: string;
}

const LANDSCAPE_ASPECT = 16 / 9;
const PORTRAIT_ASPECT = 9 / 16;

export const DualImageCropper: React.FC<DualImageCropperProps> = ({
  imageUrl,
  onChange,
  initialLandscape,
  initialPortrait,
  className = "",
}) => {
  // Landscape state
  const [landscape, setLandscape] = useState<CropData>({
    x: initialLandscape?.x ?? 0,
    y: initialLandscape?.y ?? 0,
    zoom: initialLandscape?.zoom ?? 1,
    aspect: LANDSCAPE_ASPECT,
    croppedAreaPixels: initialLandscape?.croppedAreaPixels,
  });

  // Portrait state
  const [portrait, setPortrait] = useState<CropData>({
    x: initialPortrait?.x ?? 0,
    y: initialPortrait?.y ?? 0,
    zoom: initialPortrait?.zoom ?? 1,
    aspect: PORTRAIT_ASPECT,
    croppedAreaPixels: initialPortrait?.croppedAreaPixels,
  });

  // Handlers for landscape
  const onLandscapeCropChange = useCallback((crop: { x: number; y: number }) => {
    setLandscape((prev) => ({ ...prev, ...crop }));
  }, []);
  const onLandscapeZoomChange = useCallback((zoom: number) => {
    setLandscape((prev) => ({ ...prev, zoom }));
  }, []);
  const onLandscapeCropComplete = useCallback(
    (_: any, croppedAreaPixels: any) => {
      setLandscape((prev) => ({ ...prev, croppedAreaPixels }));
      onChange({
        landscape: { ...landscape, croppedAreaPixels },
        portrait,
      });
    },
    [landscape, portrait, onChange]
  );

  // Handlers for portrait
  const onPortraitCropChange = useCallback((crop: { x: number; y: number }) => {
    setPortrait((prev) => ({ ...prev, ...crop }));
  }, []);
  const onPortraitZoomChange = useCallback((zoom: number) => {
    setPortrait((prev) => ({ ...prev, zoom }));
  }, []);
  const onPortraitCropComplete = useCallback(
    (_: any, croppedAreaPixels: any) => {
      setPortrait((prev) => ({ ...prev, croppedAreaPixels }));
      onChange({
        landscape,
        portrait: { ...portrait, croppedAreaPixels },
      });
    },
    [landscape, portrait, onChange]
  );

  return (
    <div className={`flex flex-col md:flex-row gap-6 ${className}`}>
      {/* Landscape Cropper */}
      <div className="flex-1">
        <div className="mb-2 font-semibold text-sm">Landscape Preview</div>
        <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden border">
          <Cropper
            image={imageUrl}
            crop={{ x: landscape.x, y: landscape.y }}
            zoom={landscape.zoom}
            aspect={LANDSCAPE_ASPECT}
            onCropChange={onLandscapeCropChange}
            onZoomChange={onLandscapeZoomChange}
            onCropComplete={onLandscapeCropComplete}
            showGrid={true}
          />
        </div>
      </div>
      {/* Portrait Cropper */}
      <div className="flex-1">
        <div className="mb-2 font-semibold text-sm">Portrait Preview</div>
        <div className="relative w-full aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden border">
          <Cropper
            image={imageUrl}
            crop={{ x: portrait.x, y: portrait.y }}
            zoom={portrait.zoom}
            aspect={PORTRAIT_ASPECT}
            onCropChange={onPortraitCropChange}
            onZoomChange={onPortraitZoomChange}
            onCropComplete={onPortraitCropComplete}
            showGrid={true}
          />
        </div>
      </div>
    </div>
  );
};