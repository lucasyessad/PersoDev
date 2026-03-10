'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 10 }: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList) => {
    const remaining = maxImages - images.length;
    if (remaining <= 0) return;

    const newUrls: string[] = [];
    const filesToProcess = Array.from(files).slice(0, remaining);

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      newUrls.push(url);
    });

    onChange([...images, ...newUrls]);
  }, [images, maxImages, onChange]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleRemove(index: number) {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  }

  function handleReorder(fromIndex: number, toIndex: number) {
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    onChange(newImages);
    setDragIndex(null);
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Images ({images.length}/{maxImages})
      </label>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <p className="mt-2 text-sm text-gray-600">
          Glissez-déposez des images ou cliquez pour sélectionner
        </p>
        <p className="mt-1 text-xs text-gray-400">JPEG, PNG, WebP (max {maxImages} images)</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {/* Image grid with reordering */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('ring-2', 'ring-blue-500');
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('ring-2', 'ring-blue-500');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('ring-2', 'ring-blue-500');
                if (dragIndex !== null && dragIndex !== index) {
                  handleReorder(dragIndex, index);
                }
              }}
              className="group relative aspect-square cursor-move overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="h-full w-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                  className="rounded-full bg-red-600 p-1.5 text-white hover:bg-red-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Position badge */}
              <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white">
                {index + 1}
              </span>

              {index === 0 && (
                <span className="absolute bottom-2 left-2 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  Principale
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length > 1 && (
        <p className="text-xs text-gray-400">
          Glissez les images pour les réorganiser. La première sera l&apos;image principale.
        </p>
      )}
    </div>
  );
}
