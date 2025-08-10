"use client";

import { useMemo, useCallback } from "react";
import styles from "./PostPreview.module.css";
import { PostData } from "@/app/write/page";

interface PostPreviewProps {
    postData: PostData;
}

export default function PostPreview({ postData }: PostPreviewProps) {
    // HTML escape 함수 (SSR 안전)
    const escapeHtml = useCallback((text: string) => {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }, []);

    // 간단한 마크다운 렌더링 함수
    const renderMarkdown = useMemo(() => {
        if (!postData.content) return "";

        let html = postData.content;

        // 코드 블록 처리 (먼저 처리해야 다른 마크다운과 충돌하지 않음)
        html = html.replace(/```(\w*)\n?([\s\S]*?)\n?```/g, (match, lang, code) => {
            const trimmedCode = code.trim();
            const languageClass = lang ? `language-${lang}` : "";
            return `<pre class="${styles.codeBlock}"><code class="${languageClass}">${escapeHtml(
                trimmedCode
            )}</code></pre>`;
        });

        // 인라인 코드 (코드 블록이 처리된 후 처리)
        html = html.replace(/`([^`\n]+)`/g, (match, code) => {
            return `<code class="${styles.inlineCode}">${escapeHtml(code)}</code>`;
        });

        // 헤딩
        html = html.replace(/^### (.*$)/gim, `<h3 class="${styles.h3}">$1</h3>`);
        html = html.replace(/^## (.*$)/gim, `<h2 class="${styles.h2}">$1</h2>`);
        html = html.replace(/^# (.*$)/gim, `<h1 class="${styles.h1}">$1</h1>`);

        // 굵은 글씨
        html = html.replace(/\*\*(.*?)\*\*/g, `<strong class="${styles.bold}">$1</strong>`);

        // 기울임
        html = html.replace(/\*(.*?)\*/g, `<em class="${styles.italic}">$1</em>`);

        // 취소선
        html = html.replace(/~~(.*?)~~/g, `<del class="${styles.strikethrough}">$1</del>`);

        // 링크
        html = html.replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            `<a href="$2" class="${styles.link}" target="_blank" rel="noopener noreferrer">$1</a>`
        );

        // 이미지
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, `<img src="$2" alt="$1" class="${styles.image}" />`);

        // 인용구
        html = html.replace(/^> (.*$)/gim, `<blockquote class="${styles.blockquote}">$1</blockquote>`);

        // 순서 없는 리스트
        html = html.replace(/^- (.*$)/gim, `<li class="${styles.listItem}">$1</li>`);
        html = html.replace(/(<li[^>]*>.*<\/li>)/g, `<ul class="${styles.unorderedList}">$1</ul>`);

        // 순서 있는 리스트
        html = html.replace(/^\d+\. (.*$)/gim, `<li class="${styles.listItem}">$1</li>`);

        // 줄바꿈 처리
        html = html.replace(/\n\n+/g, '</p><p class="' + styles.paragraph + '">');
        html = html.replace(/\n/g, "<br />");

        // 단락으로 감싸기
        if (html && !html.startsWith("<")) {
            html = `<p class="${styles.paragraph}">${html}</p>`;
        }

        return html;
    }, [postData.content, escapeHtml]);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className={styles.previewContainer}>
            {/* Preview Header */}
            <div className={styles.previewHeader}>
                <div className={styles.headerInfo}>
                    <h1 className={styles.previewTitle}>{postData.title || "Untitled Post"}</h1>

                    <div className={styles.metadata}>
                        <span className={styles.date}>{formatDate(new Date())}</span>
                        <span className={styles.separator}>•</span>
                        <span className={styles.category}>{postData.category}</span>
                        <span className={styles.separator}>•</span>
                        <span className={styles.visibility}>
                            {postData.visibility === "public"
                                ? "🌍 Public"
                                : postData.visibility === "private"
                                ? "🔒 Private"
                                : "👥 Team Only"}
                        </span>
                    </div>

                    {postData.tags.length > 0 && (
                        <div className={styles.tags}>
                            {postData.tags.map((tag, index) => (
                                <span key={index} className={styles.tag}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Content */}
            <div className={styles.previewContent}>
                {postData.content ? (
                    <div className={styles.markdownContent} dangerouslySetInnerHTML={{ __html: renderMarkdown }} />
                ) : (
                    <div className={styles.emptyContent}>
                        <p>Start writing to see the preview...</p>
                    </div>
                )}
            </div>

            {/* Preview Footer */}
            <div className={styles.previewFooter}>
                <div className={styles.wordStats}>
                    <span>Characters: {postData.content.length}</span>
                    <span>Words: {postData.content.split(/\s+/).filter((word) => word.length > 0).length}</span>
                    <span>Reading time: ~{Math.max(1, Math.ceil(postData.content.split(/\s+/).length / 200))} min</span>
                </div>
            </div>
        </div>
    );
}
