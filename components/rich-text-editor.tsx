"use client"

import { useRef, useState, type ChangeEvent } from "react"
import { ImageIcon, Paperclip, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onUploadMedia: (file: File) => Promise<string | null>
  disabled?: boolean
  id?: string
}

const buildMediaMarkup = (url: string, file: File) => {
  if (file.type.startsWith("image/")) {
    return `<img src="${url}" alt="" />`
  }
  if (file.type.startsWith("video/")) {
    return `<video src="${url}" controls></video>`
  }
  return `<a href="${url}" target="_blank" rel="noreferrer">Скачать файл</a>`
}

export function RichTextEditor({ value, onChange, placeholder, onUploadMedia, disabled, id }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleSelectFile = () => {
    if (disabled || isUploading) return
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const uploadedUrl = await onUploadMedia(file)
      if (uploadedUrl) {
        const nextValue = value ? `${value}\n${buildMediaMarkup(uploadedUrl, file)}\n` : buildMediaMarkup(uploadedUrl, file)
        onChange(nextValue)
      }
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="space-y-3">
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-[240px]"
      />
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <Button type="button" variant="outline" size="sm" onClick={handleSelectFile} disabled={disabled || isUploading}>
          <ImageIcon className="h-4 w-4 mr-2" />
          {isUploading ? "Загрузка..." : "Добавить медиа"}
        </Button>
        <span className="flex items-center gap-1">
          <Video className="h-4 w-4" />
          <span>Видео</span>
        </span>
        <span className="flex items-center gap-1">
          <Paperclip className="h-4 w-4" />
          <span>Файлы</span>
        </span>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,application/pdf"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
    </div>
  )
}
