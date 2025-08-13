"use client";

import { useState, useRef, useCallback } from "react";
import styles from "./MarkdownEditor.module.css";
import { PostData } from "@/app/write/page";

interface MarkdownEditorProps {
    postData: PostData;
    onPostDataChange: (field: keyof PostData, value: any) => void;
}

export default function MarkdownEditor({ postData, onPostDataChange }: MarkdownEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [dragActive, setDragActive] = useState(false);

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

        const files = Array.from(e.dataTransfer.files);
        files.forEach((file) => {
            if (file.type.startsWith("image/")) {
                // TODO: 이미지 업로드 구현
                console.log("Image upload:", file);
                insertMarkdown(`![${file.name}](uploading...)`);
            }
        });
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
                </div>
            </div>

            {/* Content Editor */}
            <div
                className={`${styles.editorWrapper} ${dragActive ? styles.dragActive : ""}`}
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

            {/* Help Text */}
            <div className={styles.helpText}>
                <span>
                    💡 Use Markdown syntax to format your content. You can drag & drop images directly into the editor.
                </span>
            </div>
        </div>
    );
}
