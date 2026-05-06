'use client';
import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  currentImage?: string;
  label?: string;
  className?: string;
}

export default function ImageUpload({ onImageSelect, currentImage, label, className = "" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageSelect(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(undefined);
    onImageSelect('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">
          {label}
        </label>
      )}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative group cursor-pointer"
      >
        <div className={`
          w-full min-h-[160px] rounded-3xl border-2 border-dashed transition-all duration-300
          flex flex-col items-center justify-center p-6 text-center
          ${preview 
            ? 'border-transparent bg-zinc-50 dark:bg-gray-500/50' 
            : 'border-zinc-100 dark:border-gray-500 hover:border-blue-500 bg-zinc-50 dark:bg-gray-500/30'}
        `}>
          {preview ? (
            <div className="relative w-full h-full min-h-[200px] animate-scale-in">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-full min-h-[200px] object-cover rounded-2xl shadow-xl" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                 <p className="text-white text-[10px] font-black uppercase tracking-widest bg-zinc-900/50 px-4 py-2 rounded-full backdrop-blur-sm">Change Image</p>
              </div>
              <button 
                onClick={clearImage}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg z-10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="w-12 h-12 bg-white dark:bg-gray-500 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 flex items-center justify-center mx-auto text-zinc-400 group-hover:scale-110 group-hover:text-blue-500 transition-all">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-zinc-900 dark:text-white text-xs font-black uppercase tracking-tight">Upload Asset Photo</p>
                <p className="text-zinc-400 text-[9px] font-bold uppercase tracking-widest mt-1">Drag and drop or click to browse</p>
              </div>
            </div>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
}
