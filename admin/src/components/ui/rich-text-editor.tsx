"use client";

import { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import YoutubeExtension from "@tiptap/extension-youtube";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlignExtension from "@tiptap/extension-text-align";
import PlaceholderExtension from "@tiptap/extension-placeholder";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Undo,
  Redo,
  Eye,
  CodeXml,
  Sparkles,
  Info,
  Layers,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Write content here... Add headings, images, YouTube video embeds, or custom layouts...",
  className = "",
}: RichTextEditorProps) {
  const [viewMode, setViewMode] = useState<"visual" | "html" | "preview">("visual");
  const [rawHtml, setRawHtml] = useState(content);

  // Modals state
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      UnderlineExtension,
      TextAlignExtension.configure({
        types: ["heading", "paragraph"],
      }),
      PlaceholderExtension.configure({
        placeholder,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#c89b3c] underline hover:text-[#e5bf6c] transition-colors cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg border border-white/10 my-4 max-w-full h-auto shadow-lg",
        },
      }),
      YoutubeExtension.configure({
        inline: false,
        HTMLAttributes: {
          class: "rounded-lg overflow-hidden border border-white/10 aspect-video w-full my-6 shadow-2xl",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm sm:prose-base max-w-none focus:outline-none min-h-[260px] p-4 text-neutral-200 leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setRawHtml(html);
      onChange(html);
    },
  });

  const handleRawHtmlChange = (newHtml: string) => {
    setRawHtml(newHtml);
    onChange(newHtml);
    if (editor) {
      editor.commands.setContent(newHtml, { emitUpdate: false });
    }
  };

  const handleInsertLink = useCallback(() => {
    if (!editor || !linkUrl) return;
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    }
    setLinkUrl("");
    setIsLinkDialogOpen(false);
  }, [editor, linkUrl]);

  const handleInsertImage = useCallback(() => {
    if (!editor || !imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run();
    setImageUrl("");
    setImageAlt("");
    setIsImageDialogOpen(false);
  }, [editor, imageUrl, imageAlt]);

  const handleInsertVideo = useCallback(() => {
    if (!editor || !videoUrl) return;
    editor.chain().focus().setYoutubeVideo({ src: videoUrl }).run();
    setVideoUrl("");
    setIsVideoDialogOpen(false);
  }, [editor, videoUrl]);

  const insertCalloutBox = (type: "info" | "warning" | "gold") => {
    if (!editor) return;
    const styles = {
      info: 'style="border-left: 3px solid #3b82f6; background: rgba(59,130,246,0.08); padding: 12px 16px; border-radius: 4px; margin: 16px 0;"',
      warning: 'style="border-left: 3px solid #f59e0b; background: rgba(245,158,11,0.08); padding: 12px 16px; border-radius: 4px; margin: 16px 0;"',
      gold: 'style="border-left: 3px solid #c89b3c; background: rgba(200,155,60,0.08); padding: 12px 16px; border-radius: 4px; margin: 16px 0;"',
    };

    const html = `<div ${styles[type]}><p><strong>Important Maritime Notice:</strong> Add your notice text here...</p></div>`;
    editor.chain().focus().insertContent(html).run();
  };

  if (!editor) {
    return (
      <div className="h-64 rounded-lg bg-[#18181b] border border-white/10 flex items-center justify-center text-xs text-neutral-500 font-mono">
        Initializing Rich Content Engine...
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-white/10 bg-[#18181b] overflow-hidden shadow-xl ${className}`}>
      {/* Top Main Toolbar */}
      <div className="border-b border-white/10 bg-[#141416]/90 p-2 flex flex-wrap items-center justify-between gap-2 sticky top-0 z-20 backdrop-blur-md">
        
        {/* Left Formatting Group */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings */}
          <div className="flex items-center bg-[#202023] rounded p-0.5 border border-white/5 mr-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-1.5 rounded text-xs transition-colors ${
                editor.isActive("heading", { level: 1 })
                  ? "bg-[#c89b3c] text-[#141416] font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Heading 1"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1.5 rounded text-xs transition-colors ${
                editor.isActive("heading", { level: 2 })
                  ? "bg-[#c89b3c] text-[#141416] font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-1.5 rounded text-xs transition-colors ${
                editor.isActive("heading", { level: 3 })
                  ? "bg-[#c89b3c] text-[#141416] font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Heading 3"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
              className={`p-1.5 rounded text-xs transition-colors ${
                editor.isActive("heading", { level: 4 })
                  ? "bg-[#c89b3c] text-[#141416] font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Heading 4"
            >
              <Heading4 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Text Style: Bold, Italic, Underline, Strike, Code */}
          <div className="flex items-center bg-[#202023] rounded p-0.5 border border-white/5 mr-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded text-xs transition-colors ${
                editor.isActive("bold")
                  ? "bg-[#c89b3c] text-[#141416] font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded text-xs transition-colors ${
                editor.isActive("italic")
                  ? "bg-[#c89b3c] text-[#141416] font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1.5 rounded text-xs transition-colors ${
                editor.isActive("underline")
                  ? "bg-[#c89b3c] text-[#141416] font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Underline (Ctrl+U)"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-1.5 rounded text-xs transition-colors ${
                editor.isActive("strike")
                  ? "bg-[#c89b3c] text-[#141416] font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Strikethrough"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-1.5 rounded text-xs transition-colors ${
                editor.isActive("code")
                  ? "bg-[#c89b3c] text-[#141416] font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Inline Code"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center bg-[#202023] rounded p-0.5 border border-white/5 mr-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={`p-1.5 rounded text-xs transition-colors ${
                editor.isActive({ textAlign: "left" })
                  ? "bg-[#c89b3c] text-[#141416]"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Align Left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              className={`p-1.5 rounded text-xs transition-colors ${
                editor.isActive({ textAlign: "center" })
                  ? "bg-[#c89b3c] text-[#141416]"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Align Center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={`p-1.5 rounded text-xs transition-colors ${
                editor.isActive({ textAlign: "right" })
                  ? "bg-[#c89b3c] text-[#141416]"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Align Right"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lists & Quotes */}
          <div className="flex items-center bg-[#202023] rounded p-0.5 border border-white/5 mr-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded text-xs transition-colors ${
                editor.isActive("bulletList")
                  ? "bg-[#c89b3c] text-[#141416]"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded text-xs transition-colors ${
                editor.isActive("orderedList")
                  ? "bg-[#c89b3c] text-[#141416]"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded text-xs transition-colors ${
                editor.isActive("blockquote")
                  ? "bg-[#c89b3c] text-[#141416]"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Blockquote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-1.5 rounded text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Horizontal Divider Line"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Rich Media: Link, Image, YouTube, Callout */}
          <div className="flex items-center bg-[#202023] rounded p-0.5 border border-white/5">
            <button
              type="button"
              onClick={() => {
                setLinkUrl(editor.getAttributes("link").href || "");
                setIsLinkDialogOpen(true);
              }}
              className={`p-1.5 rounded text-xs transition-colors ${
                editor.isActive("link")
                  ? "bg-[#c89b3c] text-[#141416]"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Insert Link"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsImageDialogOpen(true)}
              className="p-1.5 rounded text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Insert Image (URL / Fleet)"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsVideoDialogOpen(true)}
              className="p-1.5 rounded text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Embed YouTube Video"
            >
              <Video className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertCalloutBox("gold")}
              className="p-1.5 rounded text-xs text-[#c89b3c] hover:bg-[#c89b3c]/20 transition-colors"
              title="Insert Maritime Callout Block"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right View Mode & History Controls */}
        <div className="flex items-center gap-1.5">
          {/* History Undo / Redo */}
          <div className="flex items-center bg-[#202023] rounded p-0.5 border border-white/5 mr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1.5 rounded text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1.5 rounded text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visual / HTML / Preview Tabs */}
          <div className="flex bg-[#202023] p-0.5 rounded border border-white/5">
            <button
              type="button"
              onClick={() => setViewMode("visual")}
              className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 ${
                viewMode === "visual"
                  ? "bg-[#c89b3c] text-[#141416]"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Layers className="w-3 h-3" /> Visual
            </button>
            <button
              type="button"
              onClick={() => setViewMode("html")}
              className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 ${
                viewMode === "html"
                  ? "bg-[#c89b3c] text-[#141416]"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <CodeXml className="w-3 h-3" /> HTML Code
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 ${
                viewMode === "preview"
                  ? "bg-[#c89b3c] text-[#141416]"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Eye className="w-3 h-3" /> Live Preview
            </button>
          </div>
        </div>
      </div>

      {/* Editor Body Area based on View Mode */}
      <div className="bg-[#18181b]/70 min-h-[300px]">
        {viewMode === "visual" && (
          <div className="p-2">
            <EditorContent editor={editor} />
          </div>
        )}

        {viewMode === "html" && (
          <div className="p-4">
            <div className="text-[11px] font-mono text-neutral-500 mb-2 uppercase tracking-wider flex items-center gap-1">
              <CodeXml className="w-3 h-3 text-[#c89b3c]" /> Direct HTML / Structure View
            </div>
            <textarea
              value={rawHtml}
              onChange={(e) => handleRawHtmlChange(e.target.value)}
              rows={14}
              className="w-full bg-[#141416] border border-white/10 rounded-md p-4 font-mono text-xs text-amber-200/90 leading-relaxed focus:outline-none focus:border-[#c89b3c] resize-y"
              placeholder="<h2>Write custom HTML code here...</h2>"
            />
          </div>
        )}

        {viewMode === "preview" && (
          <div className="p-6 bg-[#141416] border-t border-white/5">
            <div className="text-[10px] font-mono text-[#c89b3c] uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Frontend Customer Render Preview
            </div>
            <div
              className="prose prose-invert prose-base max-w-none text-neutral-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: rawHtml }}
            />
          </div>
        )}
      </div>

      {/* Footer Info Bar */}
      <div className="border-t border-white/5 bg-[#141416]/50 px-4 py-2 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
        <div className="flex items-center gap-2">
          <span>DANAMIRA WYSIWYG ENGINE</span>
          <span>•</span>
          <span>{editor.storage.characterCount?.words?.() || rawHtml.split(/\s+/).filter(Boolean).length} WORDS</span>
        </div>
        <div className="text-[#c89b3c]">
          {viewMode.toUpperCase()} MODE ACTIVE
        </div>
      </div>

      {/* 1. Link Insertion Modal */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="bg-[#202023] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-white flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-[#c89b3c]" /> Insert Link
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Enter target URL address (e.g. https://danamira-shipping.com/charter)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">URL</Label>
              <Input
                placeholder="https://..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsLinkDialogOpen(false)}
              className="bg-transparent border-white/10 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleInsertLink}
              className="bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase"
            >
              Apply Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Image Insertion Modal */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="bg-[#202023] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#c89b3c]" /> Insert Image
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Paste image URL or fleet asset path (e.g. /fleet/molpadia/MV_MOLPADIA__PHOTO.jpg)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">Image URL / Path</Label>
              <Input
                placeholder="/fleet/molpadia/Photo-1.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="bg-[#18181b] border-white/10 text-xs text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">Alt Description</Label>
              <Input
                placeholder="MV MOLPADIA deck cranes view"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>

            {/* Quick Fleet Shortcuts */}
            <div className="bg-[#18181b] p-2.5 rounded border border-white/5 space-y-1.5">
              <span className="text-[10px] font-mono text-[#c89b3c] uppercase block">Quick Fleet Shortcuts:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl("/fleet/molpadia/MV_MOLPADIA__PHOTO.jpg");
                    setImageAlt("MV MOLPADIA Profile");
                  }}
                  className="text-[10px] bg-[#202023] hover:bg-[#c89b3c]/20 hover:text-[#c89b3c] text-neutral-300 px-2 py-1 rounded border border-white/5 transition-colors"
                >
                  🚢 MV MOLPADIA
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl("/fleet/metanira/PHOTO__MV_METANIRA.JPG");
                    setImageAlt("MV METANIRA Profile");
                  }}
                  className="text-[10px] bg-[#202023] hover:bg-[#c89b3c]/20 hover:text-[#c89b3c] text-neutral-300 px-2 py-1 rounded border border-white/5 transition-colors"
                >
                  🚢 MV METANIRA
                </button>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsImageDialogOpen(false)}
              className="bg-transparent border-white/10 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleInsertImage}
              className="bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase"
            >
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. YouTube Video Embed Modal */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="bg-[#202023] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-red-500" /> Embed Video
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Paste YouTube video link (e.g. https://www.youtube.com/watch?v=...)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">YouTube URL</Label>
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="bg-[#18181b] border-white/10 text-xs text-white"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsVideoDialogOpen(false)}
              className="bg-transparent border-white/10 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleInsertVideo}
              className="bg-[#c89b3c] hover:bg-[#e5bf6c] text-[#141416] text-xs font-semibold uppercase"
            >
              Embed Video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
