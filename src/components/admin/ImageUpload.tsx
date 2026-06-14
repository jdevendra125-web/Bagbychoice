'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'

interface Props {
  images: string[]
  onChange: (images: string[]) => void
  adminKey: string
}

export default function ImageUpload({ images, onChange, adminKey }: Props) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    const uploaded: string[] = []

    for (const file of acceptedFiles) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'x-admin-key': adminKey },
          body: formData,
        })
        if (res.ok) {
          const data = await res.json()
          uploaded.push(data.path)
        }
      } catch (err) {
        console.error('Upload error', err)
      }
    }

    onChange([...images, ...uploaded])
    setUploading(false)
  }, [images, onChange, adminKey])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024,
  })

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragActive ? 'border-brand-500 bg-brand-50' : 'border-brand-200 hover:border-brand-400 hover:bg-brand-50/50'
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            <p className="text-sm text-brand-600 font-medium">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-brand-400" />
            <p className="text-sm font-medium text-brand-700">
              {isDragActive ? 'Drop images here' : 'Click or drag to upload photos'}
            </p>
            <p className="text-xs text-gray-400">JPG, PNG, WebP up to 5MB each</p>
          </div>
        )}
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, i) => {
            const url = img.startsWith('http')
              ? img
              : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${img}`
            return (
              <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-brand-100 bg-cream-100">
                <Image src={url} alt="" fill className="object-cover" sizes="120px" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-brand-600 text-white text-xs px-1.5 py-0.5 rounded-full">Main</span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
