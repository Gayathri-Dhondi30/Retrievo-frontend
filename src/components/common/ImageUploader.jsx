import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ImageUploader = ({ onFileSelect, initialPreview = null, maxSizeBytes = 5 * 1024 * 1024 }) => {
  const [preview, setPreview] = useState(initialPreview);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const validateAndHandleFile = (file) => {
    setError(null);
    if (!file) return;

    // Validate MIME type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file format. Please upload JPEG, PNG, or WEBP images.');
      return;
    }

    // Validate size
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      return;
    }

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Simulate progress effect
    setUploadProgress(20);
    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 25;
      });
    }, 80);

    onFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndHandleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndHandleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setPreview(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
  };

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative aspect-16/9 rounded-2xl overflow-hidden border-2 border-brand-caramel/30 bg-brand-beige/50 group">
          <img src={preview} alt="Selected preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white/90 text-brand-dark text-xs font-bold shadow-md hover:bg-white transition-colors"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={removeFile}
              className="p-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-brand-beige/50">
              <div
                className="h-full bg-brand-caramel transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-brand-caramel bg-brand-caramel/10 scale-[1.01]'
              : 'border-brand-caramel/30 bg-brand-beige/30 hover:border-brand-caramel hover:bg-brand-beige/60'
          }`}
        >
          <UploadCloud className="w-10 h-10 text-brand-caramel mx-auto mb-3" />
          <p className="text-sm font-bold text-brand-dark">Drag and drop item photograph here</p>
          <p className="text-xs text-brand-muted mt-1">
            or <span className="text-brand-caramel underline font-semibold">browse computer files</span>
          </p>
          <p className="text-[11px] text-brand-muted/80 mt-3">Supports JPG, PNG, WEBP (Max 5MB)</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
