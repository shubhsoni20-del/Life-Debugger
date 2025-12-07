import React, { useRef, useState } from "react";
import { ImageFile } from "../types";

interface ImageUploaderProps {
  onImageSelected: (file: ImageFile) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Content = result.split(",")[1];
      onImageSelected({
        base64: base64Content,
        mimeType: file.type,
        previewUrl: result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
        accept="image/*"
      />
      
      <div
        className={`relative group cursor-pointer transition-all duration-300 border-2 border-dashed rounded-3xl p-16 text-center overflow-hidden
        ${dragActive ? 'border-debug-orange bg-debug-orange/5 scale-[1.01]' : 'border-slate-800 hover:border-debug-blue hover:bg-slate-900 bg-slate-950'}
        ${isLoading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerSelect}
      >
        <div className="flex flex-col items-center justify-center space-y-6 relative z-10">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center bg-slate-900 border border-slate-800 group-hover:border-debug-blue/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-500`}>
            <i className={`fa-solid fa-upload text-4xl text-slate-500 group-hover:text-debug-blue transition-colors duration-300 ${dragActive ? 'text-debug-orange animate-bounce' : ''}`}></i>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white group-hover:text-debug-blue transition-colors">INITIATE UPLOAD</h3>
            <p className="text-slate-500 text-sm font-mono tracking-wide">
              DRAG DATA HERE OR CLICK TO BROWSE
            </p>
          </div>

          <div className="flex gap-3 mt-6">
             {['JPG', 'PNG', 'WEBP'].map(ext => (
               <span key={ext} className="bg-slate-900 border border-slate-800 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider group-hover:border-debug-blue/30 group-hover:text-debug-blue/70 transition-colors">
                 {ext}
               </span>
             ))}
          </div>
        </div>

        {/* Decorative Tech Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-debug-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-debug-orange to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
      </div>
    </div>
  );
};

export default ImageUploader;
