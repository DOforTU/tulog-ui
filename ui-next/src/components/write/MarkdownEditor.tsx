"use client";

import { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import styles from "./MarkdownEditor.module.css";
import { PostData } from "@/app/write/page";
import { uploadPostImage } from "@/lib/api/file";

interface MarkdownEditorProps {
    postData: PostData;
    onPostDataChange: (field: keyof PostData, value: any) => void;
}

export default function MarkdownEditor({ postData, onPostDataChange }: MarkdownEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [showPreview, setShowPreview] = useState(true);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onPostDataChange("title", e.target.value);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onPostDataChange("content", e.target.value);
        adjustTextareaHeight();
    };

    const adjustTextareaHeight = useCallback(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const insertMarkdown = (prefix: string, suffix: string = "") => {
        if (!textareaRef.current) return;

        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);

        const newText = prefix + selectedText + suffix;
        const before = textarea.value.substring(0, start);
        const after = textarea.value.substring(end);

        const fullText = before + newText + after;
        onPostDataChange("content", fullText);

        // 포커스 및 커서 위치 설정
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Tab") {
            e.preventDefault();
            insertMarkdown("    "); // 4 spaces for indentation
        }
    };

    const handleImageUpload = async (file: File) => {
        // 즉시 미리보기를 위한 Blob URL 생성
        const previewUrl = URL.createObjectURL(file);

        try {
            // 먼저 미리보기 이미지로 마크다운 삽입
            const previewMarkdown = `![${file.name}](${previewUrl})`;
            insertMarkdown(previewMarkdown);

            // 백그라운드에서 실제 업로드 진행
            const imageUrl = await uploadPostImage(file);
            console.log("Uploaded image URL:", imageUrl);

            // 업로드 완료 후 실제 URL로 교체
            if (textareaRef.current) {
                const currentContent = textareaRef.current.value;
                const updatedContent = currentContent.replace(previewMarkdown, `![${file.name}](${imageUrl})`);
                onPostDataChange("content", updatedContent);

                // 업로드 완료 후에만 Blob URL 정리
                setTimeout(() => URL.revokeObjectURL(previewUrl), 1000);
            }
        } catch (error) {
            console.error("Image upload failed:", error);
            // 실패시 에러 메시지로 교체
            if (textareaRef.current) {
                const currentContent = textareaRef.current.value;
                const previewMarkdown = `![${file.name}](${previewUrl})`;
                const updatedContent = currentContent.replace(previewMarkdown, `![Upload failed: ${file.name}]()`);
                onPostDataChange("content", updatedContent);

                // 실패시에도 Blob URL 정리
                URL.revokeObjectURL(previewUrl);
            }
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            handleImageUpload(file);
        }
        // Reset input
        e.target.value = "";
    };

    const handleImageButtonClick = () => {
        fileInputRef.current?.click();
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

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);

        for (const file of files) {
            if (file.type.startsWith("image/")) {
                await handleImageUpload(file);
            }
        }
    };

    return (
        <div className={styles.editorContainer}>
            {/* Title Input */}
            <div className={styles.titleSection}>
                <input
                    type="text"
                    placeholder="Enter your post title..."
                    value={postData.title}
                    onChange={handleTitleChange}
                    className={styles.titleInput}
                />
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.toolbarGroup}>
                    <button className={styles.toolButton} onClick={() => insertMarkdown("**", "**")} title="Bold">
                        <strong>B</strong>
                    </button>
                    <button className={styles.toolButton} onClick={() => insertMarkdown("*", "*")} title="Italic">
                        <em>I</em>
                    </button>
                    <button
                        className={styles.toolButton}
                        onClick={() => insertMarkdown("~~", "~~")}
                        title="Strikethrough"
                    >
                        <s>S</s>
                    </button>
                </div>

                <div className={styles.toolbarGroup}>
                    <button className={styles.toolButton} onClick={() => insertMarkdown("# ")} title="Heading 1">
                        H1
                    </button>
                    <button className={styles.toolButton} onClick={() => insertMarkdown("## ")} title="Heading 2">
                        H2
                    </button>
                    <button className={styles.toolButton} onClick={() => insertMarkdown("### ")} title="Heading 3">
                        H3
                    </button>
                </div>

                <div className={styles.toolbarGroup}>
                    <button className={styles.toolButton} onClick={() => insertMarkdown("- ")} title="Bullet List">
                        •
                    </button>
                    <button className={styles.toolButton} onClick={() => insertMarkdown("1. ")} title="Numbered List">
                        1.
                    </button>
                    <button className={styles.toolButton} onClick={() => insertMarkdown("> ")} title="Quote">
                        &ldquo;&rdquo;
                    </button>
                </div>

                <div className={styles.toolbarGroup}>
                    <button className={styles.toolButton} onClick={() => insertMarkdown("`", "`")} title="Inline Code">
                        &lt;/&gt;
                    </button>
                    <button
                        className={styles.toolButton}
                        onClick={() => insertMarkdown("```\n", "\n```")}
                        title="Code Block"
                    >
                        {}
                    </button>
                    <button className={styles.toolButton} onClick={() => insertMarkdown("[", "](url)")} title="Link">
                        🔗
                    </button>
                    <button className={styles.toolButton} onClick={handleImageButtonClick} title="Upload Image">
                        📷
                    </button>
                </div>

                <div className={styles.toolbarGroup}>
                    <button
                        className={`${styles.toolButton} ${showPreview ? styles.active : ""}`}
                        onClick={() => setShowPreview(!showPreview)}
                        title="Toggle Preview"
                    >
                        👁️
                    </button>
                </div>

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    style={{ display: "none" }}
                />
            </div>

            {/* Content Editor */}
            <div className={styles.editorMain}>
                <div
                    className={`${styles.editorWrapper} ${dragActive ? styles.dragActive : ""} ${
                        showPreview ? styles.splitView : styles.fullView
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <textarea
                        ref={textareaRef}
                        placeholder="Write your post content in Markdown...

# Example
## Subheading
- Bullet point
- Another point

**Bold text** and *italic text*

```javascript
console.log('Code block');
```

> Quote text

[Link text](https://example.com)"
                        value={postData.content}
                        onChange={handleContentChange}
                        onKeyDown={handleKeyDown}
                        className={styles.contentTextarea}
                    />

                    {dragActive && (
                        <div className={styles.dragOverlay}>
                            <div className={styles.dragMessage}>📁 Drop images here to upload</div>
                        </div>
                    )}
                </div>

                {/* Preview Panel */}
                {showPreview && (
                    <div className={styles.previewWrapper}>
                        <div className={styles.previewHeader}>
                            <h4>Preview</h4>
                        </div>
                        <div className={styles.previewContent}>
                            {postData.title && <h1 className={styles.previewTitle}>{postData.title}</h1>}
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    img: ({ src, alt }) => {
                                        if (!src || typeof src !== "string") return null;
                                        return (
                                            <div className={styles.imageWrapper}>
                                                <Image
                                                    src={src}
                                                    alt={alt || ""}
                                                    width={500}
                                                    height={300}
                                                    style={{
                                                        width: "100%",
                                                        height: "auto",
                                                        maxWidth: "500px",
                                                        borderRadius: "8px",
                                                    }}
                                                    unoptimized={src.startsWith("blob:")}
                                                />
                                            </div>
                                        );
                                    },
                                }}
                            >
                                {postData.content || "*Start typing to see preview...*"}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>

            {/* Help Text */}
            <div className={styles.helpText}>
                <span>
                    💡 Use Markdown syntax to format your content. You can drag & drop images directly into the editor.
                </span>
            </div>
        </div>
    );
}
