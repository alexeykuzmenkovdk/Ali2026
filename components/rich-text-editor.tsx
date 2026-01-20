"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type ClipboardEvent } from "react"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Bold,
  Eye,
  Heading2,
  Heading3,
  ImageIcon,
  Indent,
  Italic,
  List,
  ListOrdered,
  Minus,
  Outdent,
  Plus,
  Smartphone,
  Underline,
  Video,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onUploadMedia: (file: File) => Promise<string | null>
  disabled?: boolean
  id?: string
}

const formatBlock = (tag: string) => {
  document.execCommand("formatBlock", false, tag)
}

const escapeHtml = (input: string) =>
  input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

const applyInlineFormatting = (input: string) => {
  let output = escapeHtml(input)
  output = output.replace(/`([^`]+)`/g, "<code>$1</code>")
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  output = output.replace(/__([^_]+)__/g, "<strong>$1</strong>")
  output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>")
  output = output.replace(/_([^_]+)_/g, "<em>$1</em>")
  output = output.replace(/~~([^~]+)~~/g, "<del>$1</del>")
  return output
}

const markdownToHtml = (input: string) => {
  const lines = input.replace(/\r\n/g, "\n").split("\n")
  const htmlParts: string[] = []
  let listType: "ul" | "ol" | null = null
  let paragraphLines: string[] = []

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return
    const paragraph = paragraphLines.map((line) => applyInlineFormatting(line)).join("<br />")
    htmlParts.push(`<p>${paragraph}</p>`)
    paragraphLines = []
  }

  const closeList = () => {
    if (!listType) return
    htmlParts.push(`</${listType}>`)
    listType = null
  }

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) {
      flushParagraph()
      closeList()
      return
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/)
    if (headingMatch) {
      flushParagraph()
      closeList()
      const level = headingMatch[1].length
      const content = applyInlineFormatting(headingMatch[2])
      htmlParts.push(`<h${level}>${content}</h${level}>`)
      return
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.+)$/)
    if (unorderedMatch) {
      flushParagraph()
      if (listType !== "ul") {
        closeList()
        listType = "ul"
        htmlParts.push("<ul>")
      }
      htmlParts.push(`<li>${applyInlineFormatting(unorderedMatch[1])}</li>`)
      return
    }

    const orderedMatch = trimmed.match(/^\d+[.)]\s+(.+)$/)
    if (orderedMatch) {
      flushParagraph()
      if (listType !== "ol") {
        closeList()
        listType = "ol"
        htmlParts.push("<ol>")
      }
      htmlParts.push(`<li>${applyInlineFormatting(orderedMatch[1])}</li>`)
      return
    }

    closeList()
    paragraphLines.push(line)
  })

  flushParagraph()
  closeList()

  return htmlParts.join("")
}

const getClipboardHtml = (event: ClipboardEvent<HTMLDivElement>) => {
  const html = event.clipboardData?.getData("text/html")?.trim()
  if (!html) return null
  const parsed = new DOMParser().parseFromString(html, "text/html")
  const bodyHtml = parsed.body?.innerHTML.trim()
  return bodyHtml || null
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  onUploadMedia,
  disabled,
  id,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)
  const draggedMediaRef = useRef<HTMLElement | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [selectedFontFamily, setSelectedFontFamily] = useState("inherit")
  const [selectedFontSize, setSelectedFontSize] = useState("inherit")
  const [selectedLineHeight, setSelectedLineHeight] = useState("normal")
  const [selectedMedia, setSelectedMedia] = useState<HTMLElement | null>(null)
  const [selectedMediaWidth, setSelectedMediaWidth] = useState(100)

  const fontFamilies = useMemo(
    () => [
      { label: "Сайт (по умолчанию)", value: "inherit" },
      { label: "Inter", value: "Inter, sans-serif" },
      { label: "Montserrat", value: "Montserrat, sans-serif" },
      { label: "Arial", value: "Arial, sans-serif" },
      { label: "Georgia", value: "Georgia, serif" },
      { label: "Times New Roman", value: "'Times New Roman', serif" },
    ],
    [],
  )

  const fontSizes = useMemo(
    () => [
      { label: "По умолчанию", value: "inherit" },
      { label: "12 px", value: "12px" },
      { label: "14 px", value: "14px" },
      { label: "16 px", value: "16px" },
      { label: "18 px", value: "18px" },
      { label: "20 px", value: "20px" },
      { label: "24 px", value: "24px" },
      { label: "28 px", value: "28px" },
      { label: "32 px", value: "32px" },
    ],
    [],
  )

  const lineHeights = useMemo(
    () => [
      { label: "По умолчанию", value: "normal" },
      { label: "1.2", value: "1.2" },
      { label: "1.4", value: "1.4" },
      { label: "1.6", value: "1.6" },
      { label: "1.8", value: "1.8" },
      { label: "2.0", value: "2" },
    ],
    [],
  )

  useEffect(() => {
    if (!editorRef.current) return
    const currentHtml = editorRef.current.innerHTML
    if (value !== currentHtml) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection()
      if (!selection || !editorRef.current || selection.rangeCount === 0) {
        setSelectedMedia(null)
        return
      }
      const node = selection.anchorNode
      const element = node instanceof Element ? node : node?.parentElement
      if (!element || !editorRef.current.contains(element)) {
        setSelectedMedia(null)
        return
      }
      const media = element.closest("img, video")
      setSelectedMedia(media instanceof HTMLElement ? media : null)
    }

    document.addEventListener("selectionchange", handleSelectionChange)
    return () => document.removeEventListener("selectionchange", handleSelectionChange)
  }, [])

  useEffect(() => {
    if (!selectedMedia || selectedMedia.tagName.toLowerCase() !== "img") {
      setSelectedMediaWidth(100)
      return
    }
    const storedWidth = selectedMedia.getAttribute("data-media-width")
    if (storedWidth) {
      const parsed = Number.parseFloat(storedWidth)
      if (!Number.isNaN(parsed)) {
        setSelectedMediaWidth(Math.min(100, Math.max(20, parsed)))
        return
      }
    }
    const widthValue = selectedMedia.style.width
    if (widthValue.endsWith("%")) {
      const parsed = Number.parseFloat(widthValue)
      if (!Number.isNaN(parsed)) {
        setSelectedMediaWidth(Math.min(100, Math.max(20, parsed)))
        return
      }
    }
    setSelectedMediaWidth(100)
  }, [selectedMedia])

  const handleInput = useCallback(() => {
    onChange(editorRef.current?.innerHTML ?? "")
  }, [onChange])

  const insertHtmlAfterSelection = useCallback(
    (html: string) => {
      const selection = window.getSelection()
      if (!selection || !editorRef.current) return
      if (selection.rangeCount === 0) {
        editorRef.current.innerHTML += html
        handleInput()
        return
      }
      const range = selection.getRangeAt(0)
      range.collapse(false)
      const htmlWithMarker = `${html}<span data-cursor-marker="true"></span>`
      const fragment = range.createContextualFragment(htmlWithMarker)
      range.insertNode(fragment)
      const marker = editorRef.current.querySelector('[data-cursor-marker="true"]')
      if (marker) {
        const newRange = document.createRange()
        newRange.setStartAfter(marker)
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)
        marker.remove()
      }
      editorRef.current.focus()
      handleInput()
    },
    [handleInput]
  )

  const handleCommand = useCallback((command: string, commandValue?: string) => {
    document.execCommand(command, false, commandValue)
    editorRef.current?.focus()
    handleInput()
  }, [handleInput])

  const wrapSelectionWithSpan = useCallback(
    (style: string) => {
      const selection = window.getSelection()
      if (!selection || !editorRef.current) return
      if (selection.rangeCount === 0) return
      const range = selection.getRangeAt(0)
      const span = document.createElement("span")
      span.setAttribute("style", style)
      if (range.collapsed) {
        span.appendChild(document.createTextNode("\u200b"))
        range.insertNode(span)
        const newRange = document.createRange()
        newRange.setStart(span.firstChild ?? span, 1)
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)
        editorRef.current.focus()
        handleInput()
        return
      }
      try {
        range.surroundContents(span)
      } catch {
        const fragment = range.extractContents()
        span.appendChild(fragment)
        range.insertNode(span)
      }
      const newRange = document.createRange()
      newRange.setStartAfter(span)
      newRange.collapse(true)
      selection.removeAllRanges()
      selection.addRange(newRange)
      editorRef.current.focus()
      handleInput()
    },
    [handleInput],
  )

  const applyLineHeight = useCallback(
    (value: string) => {
      const selection = window.getSelection()
      if (!selection || !editorRef.current) return
      const node = selection.anchorNode
      const element = node instanceof Element ? node : node?.parentElement
      const blockElement =
        element?.closest("p, div, h1, h2, h3, h4, h5, h6, li, blockquote") ?? editorRef.current
      blockElement.style.lineHeight = value
      editorRef.current.focus()
      handleInput()
    },
    [handleInput],
  )

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLDivElement>) => {
      const html = getClipboardHtml(event)
      if (html) {
        event.preventDefault()
        insertHtmlAfterSelection(html)
        return
      }

      const text = event.clipboardData?.getData("text/plain")
      if (!text) return
      event.preventDefault()
      const normalized = text.replace(/\r\n/g, "\n").trim()
      const markdownHtml = markdownToHtml(normalized)
      insertHtmlAfterSelection(markdownHtml)
    },
    [insertHtmlAfterSelection],
  )

  const applyResponsiveLayout = useCallback(() => {
    if (!editorRef.current) return
    const parser = new DOMParser()
    const doc = parser.parseFromString(editorRef.current.innerHTML, "text/html")
    const mediaNodes = doc.querySelectorAll("img, video")
    mediaNodes.forEach((node) => {
      const element = node as HTMLElement
      element.style.maxWidth = "100%"
      element.style.height = "auto"
      element.style.display = "block"
      element.style.margin = "16px 0"
      element.style.objectFit = "contain"
      if (element.tagName.toLowerCase() === "img" && !element.style.width) {
        element.style.width = "100%"
      }
      if (element.tagName.toLowerCase() === "video") {
        element.style.width = "100%"
      }
      element.setAttribute("draggable", "true")
      element.setAttribute("data-media", "true")
    })

    const textBlocks = doc.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote")
    textBlocks.forEach((node) => {
      const element = node as HTMLElement
      element.style.overflowWrap = "anywhere"
      element.style.wordBreak = "break-word"
    })

    const updatedHtml = doc.body.innerHTML
    editorRef.current.innerHTML = updatedHtml
    onChange(updatedHtml)
  }, [onChange])

  const applyMediaWidth = useCallback(
    (value: number) => {
      if (!selectedMedia || selectedMedia.tagName.toLowerCase() !== "img") return
      const nextValue = Math.min(100, Math.max(20, value))
      selectedMedia.style.width = `${nextValue}%`
      selectedMedia.style.height = "auto"
      selectedMedia.style.maxWidth = "100%"
      selectedMedia.setAttribute("data-media-width", `${nextValue}`)
      setSelectedMediaWidth(nextValue)
      handleInput()
    },
    [handleInput, selectedMedia],
  )

  const adjustMediaWidth = useCallback(
    (delta: number) => {
      if (!selectedMedia || selectedMedia.tagName.toLowerCase() !== "img") return
      applyMediaWidth(selectedMediaWidth + delta)
    },
    [applyMediaWidth, selectedMedia, selectedMediaWidth],
  )

  const handleMediaUpload = useCallback(
    async (file: File, type: "image" | "video") => {
      const url = await onUploadMedia(file)
      if (!url) return
      if (type === "image") {
        insertHtmlAfterSelection(
          `<img src="${url}" alt="Медиа" draggable="true" data-media="true" style="max-width: 100%; height: auto; display: block; margin: 16px 0; object-fit: contain;" />`,
        )
        return
      }
      insertHtmlAfterSelection(
        `<video src="${url}" controls draggable="true" data-media="true" style="max-width: 100%; width: 100%; height: auto; display: block; margin: 16px 0; object-fit: contain;"></video>`,
      )
    },
    [insertHtmlAfterSelection, onUploadMedia]
  )

  const handleImageChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
      await handleMediaUpload(file, "image")
      event.target.value = ""
    },
    [handleMediaUpload]
  )

  const handleVideoChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
      await handleMediaUpload(file, "video")
      event.target.value = ""
    },
    [handleMediaUpload]
  )

  const moveSelectedMedia = useCallback(
    (direction: "up" | "down") => {
      if (!selectedMedia) return
      const mediaElement = selectedMedia
      const blockElement =
        mediaElement.closest("p, div, h1, h2, h3, h4, h5, h6, li, blockquote") ?? mediaElement
      const parent = blockElement.parentElement
      if (!parent) return
      const sibling = direction === "up" ? blockElement.previousElementSibling : blockElement.nextElementSibling
      if (!sibling) return
      if (direction === "up") {
        parent.insertBefore(blockElement, sibling)
      } else {
        parent.insertBefore(blockElement, sibling.nextElementSibling)
      }
      editorRef.current?.focus()
      handleInput()
    },
    [handleInput, selectedMedia]
  )

  const handleDragStart = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null
    if (!target) return
    const media = target.closest("img, video")
    if (!media || !editorRef.current?.contains(media)) return
    draggedMediaRef.current = media as HTMLElement
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", "media")
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (!draggedMediaRef.current) return
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      const dragged = draggedMediaRef.current
      if (!dragged || !editorRef.current) return
      event.preventDefault()
      const target = event.target as HTMLElement | null
      if (!target || !editorRef.current.contains(target)) {
        editorRef.current.appendChild(dragged)
        handleInput()
        draggedMediaRef.current = null
        return
      }
      const dropTarget = target.closest("img, video, p, h1, h2, h3, h4, h5, h6, li, blockquote, div")
      if (!dropTarget || dropTarget === dragged) {
        editorRef.current.appendChild(dragged)
        handleInput()
        draggedMediaRef.current = null
        return
      }
      const rect = dropTarget.getBoundingClientRect()
      const insertBefore = event.clientY < rect.top + rect.height / 2
      if (insertBefore) {
        dropTarget.parentElement?.insertBefore(dragged, dropTarget)
      } else {
        dropTarget.parentElement?.insertBefore(dragged, dropTarget.nextSibling)
      }
      handleInput()
      draggedMediaRef.current = null
    },
    [handleInput]
  )

  const handleDragEnd = useCallback(() => {
    draggedMediaRef.current = null
  }, [])

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 rounded-md border bg-white p-2">
        <select
          value={selectedFontFamily}
          onChange={(event) => {
            const value = event.target.value
            setSelectedFontFamily(value)
            wrapSelectionWithSpan(`font-family: ${value};`)
          }}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          disabled={disabled}
        >
          {fontFamilies.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
        <select
          value={selectedFontSize}
          onChange={(event) => {
            const value = event.target.value
            setSelectedFontSize(value)
            wrapSelectionWithSpan(`font-size: ${value};`)
          }}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          disabled={disabled}
        >
          {fontSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
        <select
          value={selectedLineHeight}
          onChange={(event) => {
            const value = event.target.value
            setSelectedLineHeight(value)
            applyLineHeight(value)
          }}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          disabled={disabled}
        >
          {lineHeights.map((height) => (
            <option key={height.value} value={height.value}>
              {height.label}
            </option>
          ))}
        </select>
        <Button type="button" variant="outline" size="sm" onClick={() => handleCommand("bold")} disabled={disabled}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => handleCommand("italic")} disabled={disabled}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => handleCommand("underline")} disabled={disabled}>
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleCommand("justifyLeft")}
          disabled={disabled}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleCommand("justifyCenter")}
          disabled={disabled}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleCommand("justifyRight")}
          disabled={disabled}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => formatBlock("h2")} disabled={disabled}>
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => formatBlock("h3")} disabled={disabled}>
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => formatBlock("p")} disabled={disabled}>
          Текст
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => handleCommand("insertUnorderedList")} disabled={disabled}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => handleCommand("insertOrderedList")} disabled={disabled}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => handleCommand("indent")} disabled={disabled}>
          <Indent className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => handleCommand("outdent")} disabled={disabled}>
          <Outdent className="h-4 w-4" />
        </Button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
          disabled={disabled}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleVideoChange}
          disabled={disabled}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => imageInputRef.current?.click()} disabled={disabled}>
          <ImageIcon className="h-4 w-4 mr-1" />
          Фото
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => videoInputRef.current?.click()} disabled={disabled}>
          <Video className="h-4 w-4 mr-1" />
          Видео
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={applyResponsiveLayout} disabled={disabled}>
          <Smartphone className="h-4 w-4 mr-1" />
          Автоподгонка
        </Button>
        <div className="flex items-center gap-2 rounded-md border border-input bg-white px-2 py-1 text-sm">
          <span className="text-xs text-gray-500">Размер фото</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => adjustMediaWidth(-10)}
            disabled={disabled || !selectedMedia || selectedMedia.tagName.toLowerCase() !== "img"}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <input
            type="range"
            min={20}
            max={100}
            step={5}
            value={selectedMediaWidth}
            onChange={(event) => applyMediaWidth(Number(event.target.value))}
            className="w-24 accent-orange-500"
            disabled={disabled || !selectedMedia || selectedMedia.tagName.toLowerCase() !== "img"}
          />
          <span className="text-xs text-gray-500">{selectedMediaWidth}%</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => adjustMediaWidth(10)}
            disabled={disabled || !selectedMedia || selectedMedia.tagName.toLowerCase() !== "img"}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => moveSelectedMedia("up")}
          disabled={disabled || !selectedMedia}
        >
          <ArrowUp className="h-4 w-4 mr-1" />
          Медиа вверх
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => moveSelectedMedia("down")}
          disabled={disabled || !selectedMedia}
        >
          <ArrowDown className="h-4 w-4 mr-1" />
          Медиа вниз
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" disabled={disabled}>
              <Eye className="h-4 w-4 mr-1" />
              Предпросмотр
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Предпросмотр публикации</DialogTitle>
              <DialogDescription>Так пост будет выглядеть на сайте.</DialogDescription>
            </DialogHeader>
            <div
              className="max-h-[60vh] overflow-auto rounded-md border bg-white p-4 text-sm leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_img]:rounded-md"
              dangerouslySetInnerHTML={{ __html: value || "<p>Текст пока не добавлен.</p>" }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative">
        {!value && !isFocused && (
          <div className="pointer-events-none absolute left-3 top-3 text-sm text-gray-400">
            {placeholder ?? "Введите текст"}
          </div>
        )}
        <div
          ref={editorRef}
          id={id}
          contentEditable={!disabled}
          onInput={handleInput}
          onPaste={handlePaste}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label={placeholder ?? "Текст"}
          className="min-h-[200px] rounded-md border border-input bg-white px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>
  )
}
