/**
 * Tiptap Content Renderer
 * Renders Tiptap editor content from Admin Panel on Customer Website
 * Handles both regular HTML content and custom embed nodes
 */
"use client";

import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { extractEmbeds, type EmbedData } from "../lib/tiptap-utils";
import SocialMediaEmbedNode from "./tiptap/SocialMediaEmbedNode";
import VideoEmbedNode from "./tiptap/VideoEmbedNode";
import EmbedErrorBoundary from "./tiptap/EmbedErrorBoundary";

interface TiptapRendererProps {
  content?: string;
  className?: string;
}

export const TiptapRenderer: React.FC<TiptapRendererProps> = ({
  content = "",
  className = "",
}) => {
  // State for client-side parsed content
  const [parsedContent, setParsedContent] = useState<{
    htmlWithoutEmbeds: string;
    embeds: Array<{ index: number; data: EmbedData }>;
  }>({
    htmlWithoutEmbeds: content,
    embeds: [],
  });

  // Parse embeds only on client-side to avoid hydration mismatch
  useEffect(() => {
    if (!content) {
      setParsedContent({ htmlWithoutEmbeds: "", embeds: [] });
      return;
    }

    try {
      const parsed = extractEmbeds(content);
      setParsedContent(parsed);
    } catch (error) {
      console.error("Error parsing Tiptap content:", error);
      setParsedContent({ htmlWithoutEmbeds: content, embeds: [] });
    }
  }, [content]);

  const { htmlWithoutEmbeds: html, embeds } = parsedContent;

  // Split HTML by placeholders and intersperse embed components
  const renderContent = () => {
    if (!html && embeds.length === 0) {
      return <p className='text-gray-500'>No content available.</p>;
    }

    if (embeds.length === 0) {
      // No embeds, just render the HTML
      return (
        <div
          className={className}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(html, {
              ALLOWED_TAGS: [
                "p",
                "br",
                "strong",
                "b",
                "em",
                "i",
                "u",
                "s",
                "code",
                "pre",
                "h1",
                "h2",
                "h3",
                "ul",
                "ol",
                "li",
                "blockquote",
                "a",
                "img",
                "hr",
                "table",
                "thead",
                "tbody",
                "tr",
                "th",
                "td",
              ],
              ALLOWED_ATTR: [
                "href",
                "src",
                "alt",
                "class",
                "width",
                "height",
                "target",
              ],
              ALLOWED_URI_REGEXP:
                /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
            }),
          }}
        />
      );
    }

    // Split HTML by placeholders and rebuild with embed components
    const parts: React.ReactNode[] = [];
    const placeholderRegex = /__EMBED_PLACEHOLDER_(\d+)__/;
    let lastIndex = 0;
    let match;

    while ((match = placeholderRegex.exec(html)) !== null) {
      // Add HTML before this placeholder
      if (match.index > lastIndex) {
        const htmlContent = html.substring(lastIndex, match.index);
        parts.push(
          <div
            key={`html-${lastIndex}`}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(htmlContent, {
                ALLOWED_TAGS: [
                  "p",
                  "br",
                  "strong",
                  "b",
                  "em",
                  "i",
                  "u",
                  "s",
                  "code",
                  "pre",
                  "h1",
                  "h2",
                  "h3",
                  "ul",
                  "ol",
                  "li",
                  "blockquote",
                  "a",
                  "img",
                  "hr",
                ],
                ALLOWED_ATTR: ["href", "src", "alt", "class"],
              }),
            }}
          />,
        );
      }

      // Add the embed component
      const embedIndex = parseInt(match[1], 10);
      const embedData = embeds.find((e) => e.index === embedIndex);

      if (embedData) {
        if (embedData.data.type === "video") {
          parts.push(
            <EmbedErrorBoundary key={`embed-${embedIndex}`}>
              <VideoEmbedNode
                src={embedData.data.src}
                width={embedData.data.width}
                height={embedData.data.height}
                controls={embedData.data.controls}
                autoplay={embedData.data.autoplay}
                loop={embedData.data.loop}
              />
            </EmbedErrorBoundary>,
          );
        } else if (embedData.data.type === "socialMedia") {
          parts.push(
            <EmbedErrorBoundary key={`embed-${embedIndex}`}>
              <SocialMediaEmbedNode
                src={embedData.data.src}
                platform={embedData.data.platform}
                width={embedData.data.width}
              />
            </EmbedErrorBoundary>,
          );
        }
      }

      lastIndex = match.index + match[0].length;
    }

    // Add any remaining HTML after the last placeholder
    if (lastIndex < html.length) {
      const htmlContent = html.substring(lastIndex);
      parts.push(
        <div
          key={`html-${lastIndex}`}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(htmlContent, {
              ALLOWED_TAGS: [
                "p",
                "br",
                "strong",
                "b",
                "em",
                "i",
                "u",
                "s",
                "code",
                "pre",
                "h1",
                "h2",
                "h3",
                "ul",
                "ol",
                "li",
                "blockquote",
                "a",
                "img",
                "hr",
              ],
              ALLOWED_ATTR: ["href", "src", "alt", "class"],
            }),
          }}
        />,
      );
    }

    return parts;
  };

  return <div className='tiptap-content'>{renderContent()}</div>;
};

export default TiptapRenderer;
