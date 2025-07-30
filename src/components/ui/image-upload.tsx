import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (imagePath: string) => void;
  onRemove?: () => void;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  className = '',
  accept = 'image/*',
  maxSize = 5
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Please select an image smaller than ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Create a unique filename
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const filePath = `src/assets/${fileName}`;

      // Convert file to base64 for saving
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        
        // Here we would normally save to the file system
        // For now, we'll create a blob URL as a temporary solution
        const blob = await fetch(result).then(r => r.blob());
        const blobUrl = URL.createObjectURL(blob);
        
        // Store the file reference for later use
        const fileData = {
          name: fileName,
          path: filePath,
          url: blobUrl,
          originalName: file.name,
          size: file.size,
          type: file.type
        };

        // Save file data to localStorage for persistence
        const savedFiles = JSON.parse(localStorage.getItem('uploaded-images') || '{}');
        savedFiles[fileName] = fileData;
        localStorage.setItem('uploaded-images', JSON.stringify(savedFiles));

        onChange(blobUrl);
        
        toast({
          title: "Image uploaded",
          description: "Image has been saved successfully",
        });
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    if (value && value.startsWith('blob:')) {
      URL.revokeObjectURL(value);
    }
    onRemove?.();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-32 object-cover rounded-lg border"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={openFileDialog}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4" />
              Replace
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={openFileDialog}
          className="w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            {isUploading ? 'Uploading...' : 'Click to upload image'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG, GIF up to {maxSize}MB
          </p>
        </div>
      )}
    </div>
  );
};