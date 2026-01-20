"use client"

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type CSSProperties } from "react"
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Eraser,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Palette,
  Plus,
  Quote,
  Redo2,
  Strikethrough,
  TableIcon,
  Underline,
  Undo2,
  Video,
} from "lucide-react"
import { Extension, Mark, Node, mergeAttributes } from "@tiptap/core"
import { EditorContent, NodeViewWrapper, ReactNodeViewRenderer, useEditor, type NodeViewProps } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import UnderlineExtension from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import Dropcursor from "@tiptap/extension-dropcursor"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"
import { Button } from "@/components/ui/button"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onUploadMedia: (file: File) => Promise<string | null>
  disabled?: boolean
  id?: string
}

type MediaAlign = "left" | "center" | "right"

const FOOTNOTE_SYMBOLS = ["¹", "²", "³", "⁴", "⁵", "⁶"]
const DEFAULT_LINE_HEIGHT = "1.6"
const LINE_HEIGHT_OPTIONS = ["1.2", "1.4", "1.6", "1.8", "2.0"]
const SPACING_OPTIONS = ["0", "0.5rem", "1rem", "1.5rem", "2rem", "3rem"]
const DEFAULT_MEDIA_WIDTH = 70
const FONT_SIZE_OPTIONS = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"]
const CTA_URL = "https://www.alipayfast.ru/#calculator"
const CTA_LABEL = "Купить юани"

const normalizeUrl = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return ""
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  return `https://${trimmed}`
}

const TextStyle = Mark.create({
  name: "textStyle",
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => element.style.color || null,
        renderHTML: (attributes) => {
          if (!attributes.color) {
            return {}
          }
          return { style: `color: ${attributes.color}` }
        },
      },
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) {
            return {}
          }
          return { style: `font-size: ${attributes.fontSize}` }
        },
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: "span",
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0]
  },
})

const LineHeight = Extension.create({
  name: "lineHeight",
  addOptions() {
    return {
      types: ["paragraph", "heading", "listItem"],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight || null,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {}
              }
              return { style: `line-height: ${attributes.lineHeight}` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ commands }) =>
          this.options.types.every((type) => commands.updateAttributes(type, { lineHeight })),
      unsetLineHeight:
        () =>
        ({ commands }) =>
          this.options.types.every((type) => commands.updateAttributes(type, { lineHeight: null })),
    }
  },
})

const BlockSpacing = Extension.create({
  name: "blockSpacing",
  addOptions() {
    return {
      types: ["paragraph", "heading", "listItem"],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          marginBottom: {
            default: null,
            parseHTML: (element) => element.style.marginBottom || null,
            renderHTML: (attributes) => {
              if (!attributes.marginBottom) {
                return {}
              }
              return { style: `margin-bottom: ${attributes.marginBottom}` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setBlockSpacing:
        (marginBottom: string) =>
        ({ commands }) =>
          this.options.types.every((type) => commands.updateAttributes(type, { marginBottom })),
      unsetBlockSpacing:
        () =>
        ({ commands }) =>
          this.options.types.every((type) => commands.updateAttributes(type, { marginBottom: null })),
    }
  },
})

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {}
              }
              return { style: `font-size: ${attributes.fontSize}` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ commands }) =>
          commands.setMark("textStyle", { fontSize }),
      unsetFontSize:
        () =>
        ({ commands }) =>
          commands.updateAttributes("textStyle", { fontSize: null }),
    }
  },
})

const ImageBlock = Node.create({
  name: "imageBlock",
  group: "block",
  atom: true,
  draggable: true,
  isolating: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: "",
      },
      title: {
        default: "",
      },
      align: {
        default: "center",
      },
      width: {
        default: DEFAULT_MEDIA_WIDTH,
      },
      caption: {
        default: "",
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'figure[data-type="image"]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false
          const img = element.querySelector("img")
          const caption = element.querySelector("figcaption")
          return {
            src: img?.getAttribute("src") ?? null,
            alt: img?.getAttribute("alt") ?? "",
            title: img?.getAttribute("title") ?? "",
            align: element.dataset.align ?? "center",
            width: Number(element.dataset.width ?? DEFAULT_MEDIA_WIDTH),
            caption: caption?.textContent ?? "",
          }
        },
      },
      {
        tag: "img[src]",
        getAttrs: (element) => {
          if (!(element instanceof HTMLImageElement)) return false
          return {
            src: element.getAttribute("src"),
            alt: element.getAttribute("alt") ?? "",
            title: element.getAttribute("title") ?? "",
            align: "center",
            width: DEFAULT_MEDIA_WIDTH,
            caption: "",
          }
        },
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    const figureAttributes = mergeAttributes(HTMLAttributes, {
      "data-type": "image",
      "data-align": HTMLAttributes.align,
      "data-width": HTMLAttributes.width,
      class: "blog-media",
      style: `--media-width: ${HTMLAttributes.width}%`,
    })
    const children = [
      [
        "img",
        {
          src: HTMLAttributes.src,
          alt: HTMLAttributes.alt ?? "",
          title: HTMLAttributes.title ?? "",
          class: "blog-media__element",
        },
      ],
    ]
    if (HTMLAttributes.caption) {
      children.push(["figcaption", { class: "blog-media__caption" }, HTMLAttributes.caption])
    }
    return ["figure", figureAttributes, ...children]
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockView)
  },
})

const VideoBlock = Node.create({
  name: "videoBlock",
  group: "block",
  atom: true,
  draggable: true,
  isolating: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      align: {
        default: "center",
      },
      width: {
        default: DEFAULT_MEDIA_WIDTH,
      },
      caption: {
        default: "",
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'figure[data-type="video"]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false
          const video = element.querySelector("video")
          const caption = element.querySelector("figcaption")
          return {
            src: video?.getAttribute("src") ?? null,
            align: element.dataset.align ?? "center",
            width: Number(element.dataset.width ?? DEFAULT_MEDIA_WIDTH),
            caption: caption?.textContent ?? "",
          }
        },
      },
      {
        tag: "video[src]",
        getAttrs: (element) => {
          if (!(element instanceof HTMLVideoElement)) return false
          return {
            src: element.getAttribute("src"),
            align: "center",
            width: DEFAULT_MEDIA_WIDTH,
            caption: "",
          }
        },
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    const figureAttributes = mergeAttributes(HTMLAttributes, {
      "data-type": "video",
      "data-align": HTMLAttributes.align,
      "data-width": HTMLAttributes.width,
      class: "blog-media",
      style: `--media-width: ${HTMLAttributes.width}%`,
    })
    const children = [
      [
        "video",
        {
          src: HTMLAttributes.src,
          controls: "true",
          class: "blog-media__element",
        },
      ],
    ]
    if (HTMLAttributes.caption) {
      children.push(["figcaption", { class: "blog-media__caption" }, HTMLAttributes.caption])
    }
    return ["figure", figureAttributes, ...children]
  },
  addNodeView() {
    return ReactNodeViewRenderer(VideoBlockView)
  },
})

const Footnote = Node.create({
  name: "footnote",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  addAttributes() {
    return {
      label: {
        default: "¹",
      },
      text: {
        default: "",
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: "sup[data-footnote]",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false
          return {
            label: element.textContent ?? "¹",
            text: element.dataset.footnote ?? "",
          }
        },
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "sup",
      mergeAttributes(HTMLAttributes, {
        "data-footnote": HTMLAttributes.text ?? "",
        class: "blog-footnote",
      }),
      HTMLAttributes.label ?? "¹",
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(FootnoteView)
  },
})

function ImageBlockView({ node, updateAttributes, selected, editor, getPos }: NodeViewProps) {
  const { src, align, width, caption } = node.attrs
  const widthValue = Number(width) || 100

  const handleSelect = () => {
    const position = getPos?.()
    if (typeof position === "number") {
      editor.commands.setNodeSelection(position)
    }
  }

  return (
    <NodeViewWrapper
      className={`blog-media tiptap-media ${selected ? "is-selected" : ""}`}
      data-type="image"
      data-align={align}
      data-width={widthValue}
      style={{ "--media-width": `${widthValue}%` } as CSSProperties}
      contentEditable={false}
    >
      <div
        className="tiptap-media__canvas"
        data-drag-handle
        onMouseDown={(event) => {
          if (event.button !== 0) return
          handleSelect()
        }}
      >
        {src ? <img src={src} alt="" className="blog-media__element" /> : null}
        <MediaControls
          align={align}
          onAlignChange={(nextAlign) => updateAttributes({ align: nextAlign })}
          width={widthValue}
          onWidthChange={(nextWidth) => updateAttributes({ width: nextWidth })}
          onSelect={handleSelect}
        />
      </div>
      <div className="tiptap-media__caption">
        <input
          className="tiptap-media__caption-input"
          type="text"
          placeholder="Подпись к изображению"
          value={caption ?? ""}
          onChange={(event) => updateAttributes({ caption: event.target.value })}
        />
      </div>
    </NodeViewWrapper>
  )
}

function VideoBlockView({ node, updateAttributes, selected, editor, getPos }: NodeViewProps) {
  const { src, align, width, caption } = node.attrs
  const widthValue = Number(width) || 100

  const handleSelect = () => {
    const position = getPos?.()
    if (typeof position === "number") {
      editor.commands.setNodeSelection(position)
    }
  }

  return (
    <NodeViewWrapper
      className={`blog-media tiptap-media ${selected ? "is-selected" : ""}`}
      data-type="video"
      data-align={align}
      data-width={widthValue}
      style={{ "--media-width": `${widthValue}%` } as CSSProperties}
      contentEditable={false}
    >
      <div
        className="tiptap-media__canvas"
        data-drag-handle
        onMouseDown={(event) => {
          if (event.button !== 0) return
          handleSelect()
        }}
      >
        {src ? <video src={src} controls className="blog-media__element" /> : null}
        <MediaControls
          align={align}
          onAlignChange={(nextAlign) => updateAttributes({ align: nextAlign })}
          width={widthValue}
          onWidthChange={(nextWidth) => updateAttributes({ width: nextWidth })}
          onSelect={handleSelect}
        />
      </div>
      <div className="tiptap-media__caption">
        <input
          className="tiptap-media__caption-input"
          type="text"
          placeholder="Подпись к видео"
          value={caption ?? ""}
          onChange={(event) => updateAttributes({ caption: event.target.value })}
        />
      </div>
    </NodeViewWrapper>
  )
}

function FootnoteView({ node, updateAttributes, selected }: NodeViewProps) {
  const { label, text } = node.attrs

  const editFootnote = () => {
    const nextLabel = window.prompt("Метка сноски", label ?? "¹")
    if (nextLabel === null) return
    const nextText = window.prompt("Текст сноски", text ?? "")
    if (nextText === null) return
    updateAttributes({ label: nextLabel || "¹", text: nextText })
  }

  return (
    <NodeViewWrapper
      as="span"
      className={`tiptap-footnote ${selected ? "is-selected" : ""}`}
      data-footnote={text ?? ""}
      contentEditable={false}
    >
      <button type="button" className="tiptap-footnote__badge" onClick={editFootnote}>
        {label ?? "¹"}
      </button>
    </NodeViewWrapper>
  )
}

function MediaControls({
  align,
  onAlignChange,
  width,
  onWidthChange,
  onSelect,
}: {
  align: MediaAlign
  onAlignChange: (value: MediaAlign) => void
  width: number
  onWidthChange: (value: number) => void
  onSelect?: () => void
}) {
  return (
    <div className="tiptap-media__controls" contentEditable={false}>
      <button
        type="button"
        className="tiptap-media__drag"
        data-drag-handle
        draggable
        title="Перетащить"
        onMouseDown={(event) => {
          if (event.button !== 0) return
          onSelect?.()
        }}
      >
        ⋮⋮
      </button>
      <div className="tiptap-media__align">
        <button
          type="button"
          className={align === "left" ? "is-active" : ""}
          onClick={() => onAlignChange("left")}
          title="Выравнивание влево"
        >
          <AlignLeft size={14} />
        </button>
        <button
          type="button"
          className={align === "center" ? "is-active" : ""}
          onClick={() => onAlignChange("center")}
          title="По центру"
        >
          <AlignCenter size={14} />
        </button>
        <button
          type="button"
          className={align === "right" ? "is-active" : ""}
          onClick={() => onAlignChange("right")}
          title="Выравнивание вправо"
        >
          <AlignRight size={14} />
        </button>
      </div>
      <div className="tiptap-media__width">
        <input
          type="range"
          min={40}
          max={100}
          step={5}
          value={width}
          onChange={(event) => onWidthChange(Number(event.target.value))}
        />
        <span>{width}%</span>
      </div>
    </div>
  )
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Начните писать...",
  onUploadMedia,
  disabled,
  id,
}: RichTextEditorProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [lineHeightValue, setLineHeightValue] = useState("default")
  const [spacingValue, setSpacingValue] = useState("default")
  const [fontSizeValue, setFontSizeValue] = useState("default")
  const [textColor, setTextColor] = useState("#000000")

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextStyle,
      FontSize,
      UnderlineExtension,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      Dropcursor.configure({ color: "#f97316", width: 2 }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      LineHeight,
      BlockSpacing,
      ImageBlock,
      VideoBlock,
      Footnote,
    ],
    content: value || "<p></p>",
    editable: !disabled,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor__content",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false
        const files = event.dataTransfer?.files
        if (!files || files.length === 0) return false
        const [file] = Array.from(files)
        if (!file) return false
        const insertNode = async (type: "image" | "video") => {
          setIsUploading(true)
          const url = await onUploadMedia(file)
          setIsUploading(false)
          if (!url) return
          const nodeType = type === "image" ? "imageBlock" : "videoBlock"
          const node = view.state.schema.nodes[nodeType]?.create({
            src: url,
            align: "center",
            width: DEFAULT_MEDIA_WIDTH,
            caption: "",
          })
          if (!node) return
          const transaction = view.state.tr.replaceSelectionWith(node)
          view.dispatch(transaction.scrollIntoView())
        }
        if (file.type.startsWith("image/")) {
          void insertNode("image")
          return true
        }
        if (file.type.startsWith("video/")) {
          void insertNode("video")
          return true
        }
        return false
      },
    },
  })

  const uploadAndInsert = useCallback(
    async (file: File, type: "image" | "video") => {
      if (!editor) return
      setIsUploading(true)
      const url = await onUploadMedia(file)
      setIsUploading(false)
      if (!url) return
      const nodeType = type === "image" ? "imageBlock" : "videoBlock"
      editor
        .chain()
        .focus()
        .insertContent({
          type: nodeType,
          attrs: { src: url, align: "center", width: DEFAULT_MEDIA_WIDTH, caption: "" },
        })
        .run()
    },
    [editor, onUploadMedia],
  )

  useEffect(() => {
    if (!editor) return
    editor.setEditable(!disabled)
  }, [editor, disabled])

  useEffect(() => {
    if (!editor) return
    const updateLineHeightValue = () => {
      const currentLineHeight =
        editor.getAttributes("paragraph").lineHeight ?? editor.getAttributes("heading").lineHeight ?? null
      setLineHeightValue(currentLineHeight ?? "default")
    }
    const updateSpacingValue = () => {
      const currentMarginBottom =
        editor.getAttributes("paragraph").marginBottom ??
        editor.getAttributes("heading").marginBottom ??
        editor.getAttributes("listItem").marginBottom ??
        null
      setSpacingValue(currentMarginBottom ?? "default")
    }
    const updateInlineStyleValues = () => {
      const currentFontSize = editor.getAttributes("textStyle").fontSize ?? null
      const currentColor = editor.getAttributes("textStyle").color ?? null
      setFontSizeValue(currentFontSize ?? "default")
      setTextColor(currentColor ?? "#000000")
    }
    updateLineHeightValue()
    updateSpacingValue()
    updateInlineStyleValues()
    editor.on("selectionUpdate", updateLineHeightValue)
    editor.on("transaction", updateLineHeightValue)
    editor.on("selectionUpdate", updateSpacingValue)
    editor.on("transaction", updateSpacingValue)
    editor.on("selectionUpdate", updateInlineStyleValues)
    editor.on("transaction", updateInlineStyleValues)
    return () => {
      editor.off("selectionUpdate", updateLineHeightValue)
      editor.off("transaction", updateLineHeightValue)
      editor.off("selectionUpdate", updateSpacingValue)
      editor.off("transaction", updateSpacingValue)
      editor.off("selectionUpdate", updateInlineStyleValues)
      editor.off("transaction", updateInlineStyleValues)
    }
  }, [editor])

  useEffect(() => {
    if (!editor) return
    const html = editor.getHTML()
    if (value !== html) {
      editor.commands.setContent(value || "<p></p>", false)
    }
  }, [editor, value])

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("Ссылка", previousUrl ?? "")
    if (url === null) return
    const normalizedUrl = normalizeUrl(url)
    if (!normalizedUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    if (editor.state.selection.empty) {
      const linkText = window.prompt("Текст ссылки", normalizedUrl)
      if (linkText === null) return
      const label = linkText.trim() || normalizedUrl
      editor
        .chain()
        .focus()
        .insertContent(
          `<a href="${normalizedUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`,
        )
        .run()
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: normalizedUrl }).run()
  }, [editor])

  const insertCtaButton = useCallback(() => {
    if (!editor) return
    editor
      .chain()
      .focus()
      .insertContent(
        `<p><a href="${CTA_URL}" class="cta-button" target="_blank" rel="noopener noreferrer">${CTA_LABEL}</a></p>`,
      )
      .run()
  }, [editor])

  const insertFootnote = useCallback(() => {
    if (!editor) return
    const text = window.prompt("Текст сноски", "")
    if (text === null) return
    const label = window.prompt("Метка", FOOTNOTE_SYMBOLS[Math.floor(Math.random() * FOOTNOTE_SYMBOLS.length)] ?? "¹")
    if (label === null) return
    editor.chain().focus().insertContent({ type: "footnote", attrs: { text, label: label || "¹" } }).run()
  }, [editor])

  const handleLineHeightChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!editor) return
    const nextValue = event.target.value
    if (nextValue === "default") {
      editor.chain().focus().unsetLineHeight().run()
      return
    }
    editor.chain().focus().setLineHeight(nextValue).run()
  }

  const handleSpacingChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!editor) return
    const nextValue = event.target.value
    if (nextValue === "default") {
      editor.chain().focus().unsetBlockSpacing().run()
      return
    }
    editor.chain().focus().setBlockSpacing(nextValue).run()
  }

  const handleFontSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!editor) return
    const nextValue = event.target.value
    if (nextValue === "default") {
      editor.chain().focus().unsetFontSize().run()
      return
    }
    editor.chain().focus().setFontSize(nextValue).run()
  }

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!editor) return
    const nextColor = event.target.value
    setTextColor(nextColor)
    const currentStyles = editor.getAttributes("textStyle")
    editor.chain().focus().setMark("textStyle", { ...currentStyles, color: nextColor }).run()
  }

  const handleImageInput = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      await uploadAndInsert(file, "image")
      event.target.value = ""
    }
  }

  const handleVideoInput = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      await uploadAndInsert(file, "video")
      event.target.value = ""
    }
  }

  const mediaStatus = isUploading ? "Загрузка медиа..." : ""

  return (
    <div className="space-y-3" id={id}>
      <div className="tiptap-editor__toolbar flex flex-wrap gap-2 rounded-lg border border-input bg-muted/40 p-2">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor}
            className={editor?.isActive("bold") ? "bg-muted" : ""}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor}
            className={editor?.isActive("italic") ? "bg-muted" : ""}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            disabled={!editor}
            className={editor?.isActive("strike") ? "bg-muted" : ""}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleCode().run()}
            disabled={!editor}
            className={editor?.isActive("code") ? "bg-muted" : ""}
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            disabled={!editor}
            className={editor?.isActive("underline") ? "bg-muted" : ""}
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={setLink}
            disabled={!editor}
            className={editor?.isActive("link") ? "bg-muted" : ""}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={insertCtaButton} disabled={!editor}>
            <span className="text-xs font-semibold text-orange-600">Кнопка</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().unsetAllMarks().run()}
            disabled={!editor}
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            disabled={!editor}
            className={editor?.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            disabled={!editor}
            className={editor?.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            disabled={!editor}
            className={editor?.isActive("bulletList") ? "bg-muted" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            disabled={!editor}
            className={editor?.isActive("orderedList") ? "bg-muted" : ""}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            disabled={!editor}
            className={editor?.isActive("blockquote") ? "bg-muted" : ""}
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
            disabled={!editor}
            className={editor?.isActive({ textAlign: "left" }) ? "bg-muted" : ""}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
            disabled={!editor}
            className={editor?.isActive({ textAlign: "center" }) ? "bg-muted" : ""}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
            disabled={!editor}
            className={editor?.isActive({ textAlign: "right" }) ? "bg-muted" : ""}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
            disabled={!editor}
            className={editor?.isActive({ textAlign: "justify" }) ? "bg-muted" : ""}
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">Размер</span>
          <select
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            value={fontSizeValue}
            onChange={handleFontSizeChange}
            disabled={!editor}
          >
            <option value="default">По умолчанию</option>
            {FONT_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">Цвет</span>
          <label className="flex items-center gap-2 text-xs text-slate-500">
            <Palette className="h-4 w-4" />
            <input
              type="color"
              className="h-8 w-8 cursor-pointer rounded border border-input bg-white p-0.5"
              value={textColor}
              onChange={handleColorChange}
              disabled={!editor}
            />
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (!editor) return
              const currentStyles = editor.getAttributes("textStyle")
              editor.chain().focus().setMark("textStyle", { ...currentStyles, color: null }).run()
            }}
            disabled={!editor}
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => imageInputRef.current?.click()}>
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => videoInputRef.current?.click()}>
            <Video className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            disabled={!editor}
          >
            <TableIcon className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={insertFootnote} disabled={!editor}>
            <span className="text-xs">Сноска</span>
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">Интервал</span>
          <select
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            value={lineHeightValue}
            onChange={handleLineHeightChange}
            disabled={!editor}
          >
            <option value="default">По умолчанию</option>
            {LINE_HEIGHT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">Отступ</span>
          <select
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            value={spacingValue}
            onChange={handleSpacingChange}
            disabled={!editor}
          >
            <option value="default">По умолчанию</option>
            {SPACING_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => editor?.chain().focus().undo().run()}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor?.chain().focus().redo().run()}>
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().addColumnBefore().run()}
            disabled={!editor?.can().addColumnBefore()}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().deleteColumn().run()}
            disabled={!editor?.can().deleteColumn()}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
        {mediaStatus && <div className="text-xs text-orange-600">{mediaStatus}</div>}
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageInput}
        disabled={disabled || isUploading}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleVideoInput}
        disabled={disabled || isUploading}
      />

      <div className={`tiptap-editor ${disabled ? "opacity-70" : ""}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
