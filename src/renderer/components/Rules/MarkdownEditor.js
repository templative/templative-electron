import React, { useState, useRef, useEffect, useContext } from "react";
import "./MarkdownEditor.css";
import { RenderingWorkspaceContext } from "../Render/RenderingWorkspaceProvider";

import BoldIcon from "./Icons/Bold.svg?react";
import ItalicIcon from "./Icons/Italic.svg?react";
import HeaderIcon from "./Icons/Header.svg?react";
import LinkIcon from "./Icons/Link.svg?react";
import ImageIcon from "./Icons/Image.svg?react";
import CodeIcon from "./Icons/Code.svg?react";
import EyeIcon from "./Icons/Eye.svg?react";
import NumberedListIcon from "./Icons/NumberedList.svg?react";
import UnorderedListIcon from "./Icons/UnorderedList.svg?react";
import QuoteIcon from "./Icons/Quote.svg?react";

export default function MarkdownEditor({ markdownContent, onContentChange }) {
    const {
        markdownPreviewOpen,
        markdownEditorScrollPosition,
        markdownPreviewScrollPosition,
        setMarkdownPreviewOpen,
        setMarkdownEditorScrollPosition,
        setMarkdownPreviewScrollPosition
    } = useContext(RenderingWorkspaceContext);
    
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);
    const previewRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    const previewScrollTimeoutRef = useRef(null);

    useEffect(() => {
        updateLineNumbers();
    }, [markdownContent]);

    // Restore editor scroll position
    useEffect(() => {
        if (textareaRef.current && markdownEditorScrollPosition > 0) {
            textareaRef.current.scrollTop = markdownEditorScrollPosition;
        }
    }, [markdownEditorScrollPosition]);

    // Restore preview scroll position
    useEffect(() => {
        if (previewRef.current && markdownPreviewScrollPosition > 0) {
            previewRef.current.scrollTop = markdownPreviewScrollPosition;
        }
    }, [markdownPreviewScrollPosition]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            if (previewScrollTimeoutRef.current) {
                clearTimeout(previewScrollTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        // Add resize observer to update line numbers when textarea size changes
        if (textareaRef.current) {
            let resizeTimeout;
            const resizeObserver = new ResizeObserver(() => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(updateLineNumbers, 50);
            });
            resizeObserver.observe(textareaRef.current);
            
            return () => {
                resizeObserver.disconnect();
                clearTimeout(resizeTimeout);
            };
        }
    }, []);

    const updateLineNumbers = () => {
        if (lineNumbersRef.current && textareaRef.current) {
            // Small delay to ensure textarea is properly rendered
            setTimeout(() => {
                const textarea = textareaRef.current;
                const lines = markdownContent.split('\n');
                
                if (!textarea || textarea.clientWidth === 0) return;
                
                // Create a temporary element to measure line heights
                const measureElement = document.createElement('div');
                measureElement.style.cssText = `
                    position: absolute;
                    visibility: hidden;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    font-family: 'Courier New', Monaco, monospace;
                    font-size: 14px;
                    line-height: 1.6;
                    padding: 0;
                    width: ${textarea.clientWidth - 32}px;
                    border: none;
                    margin: 0;
                    box-sizing: border-box;
                `;
                document.body.appendChild(measureElement);
                
                let lineNumbersHTML = '';
                
                lines.forEach((line, index) => {
                    measureElement.textContent = line || ' '; // Use space for empty lines
                    const lineHeight = Math.max(22.4, measureElement.offsetHeight); // Minimum one line height
                    
                    // Create line number with appropriate height
                    const lineNumber = index + 1;
                    lineNumbersHTML += `<div class="line-number" style="height: ${lineHeight}px; line-height: ${lineHeight}px;">${lineNumber}</div>`;
                });
                
                lineNumbersRef.current.innerHTML = lineNumbersHTML;
                document.body.removeChild(measureElement);
            }, 10);
        }
    };

    const handleTextareaChange = (e) => {
        onContentChange(e.target.value);
    };

    const handleKeyDown = (e) => {
        // Handle keyboard shortcuts
        if ((e.ctrlKey || e.metaKey)) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    insertMarkdown("**", "**", "bold text");
                    break;
                case 'i':
                    e.preventDefault();
                    insertMarkdown("*", "*", "italic text");
                    break;
                case 'k':
                    e.preventDefault();
                    insertLink();
                    break;
            }
        }

        // Handle tab for indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            insertAtCursor('    '); // 4 spaces for indentation
        }

        // Handle Enter for list continuation
        if (e.key === 'Enter') {
            const textarea = textareaRef.current;
            const cursorPos = textarea.selectionStart;
            const textBeforeCursor = markdownContent.substring(0, cursorPos);
            const currentLine = textBeforeCursor.split('\n').pop();
            
            // Check if current line is a list item
            const bulletMatch = currentLine.match(/^(\s*)[\*\-\+]\s/);
            const numberMatch = currentLine.match(/^(\s*)(\d+)\.\s/);
            
            if (bulletMatch) {
                e.preventDefault();
                const indent = bulletMatch[1];
                const bulletChar = currentLine.match(/^(\s*)([-*+])\s/)[2];
                const newText = `\n${indent}${bulletChar} `;
                insertAtCursor(newText);
            } else if (numberMatch) {
                e.preventDefault();
                const indent = numberMatch[1];
                const nextNumber = parseInt(numberMatch[2]) + 1;
                const newText = `\n${indent}${nextNumber}. `;
                insertAtCursor(newText);
            }
        }
    };

    const insertAtCursor = (text) => {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = markdownContent.substring(0, start) + text + markdownContent.substring(end);
        onContentChange(newContent);
        
        // Set cursor position after inserted text
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + text.length;
            textarea.focus();
        }, 0);
    };

    const insertMarkdown = (before, after = "", placeholder = "") => {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        let selectedText = markdownContent.substring(start, end);
        
        if (!selectedText && placeholder) {
            selectedText = placeholder;
        }

        const newText = before + selectedText + after;
        const newContent = markdownContent.substring(0, start) + newText + markdownContent.substring(end);
        onContentChange(newContent);
        
        // Set selection to highlight the inserted content
        setTimeout(() => {
            textarea.selectionStart = start + before.length;
            textarea.selectionEnd = start + before.length + selectedText.length;
            textarea.focus();
        }, 0);
    };

    const insertAtLineStart = (prefix) => {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const lines = markdownContent.split('\n');
        const lineIndex = markdownContent.substring(0, start).split('\n').length - 1;
        const currentLine = lines[lineIndex];
        
        if (currentLine.startsWith(prefix)) {
            // Remove the prefix
            lines[lineIndex] = currentLine.substring(prefix.length);
        } else {
            // Add the prefix
            lines[lineIndex] = prefix + currentLine;
        }
        
        const newContent = lines.join('\n');
        onContentChange(newContent);
        
        setTimeout(() => {
            textarea.focus();
        }, 0);
    };

    const incrementHeader = () => {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const lines = markdownContent.split('\n');
        const lineIndex = markdownContent.substring(0, start).split('\n').length - 1;
        const currentLine = lines[lineIndex];
        
        const headerMatch = currentLine.match(/^(#{1,6})\s/);
        if (headerMatch) {
            const currentLevel = headerMatch[1].length;
            if (currentLevel < 6) {
                const newHeader = "#".repeat(currentLevel + 1) + " ";
                lines[lineIndex] = currentLine.replace(/^#{1,6}\s/, newHeader);
            }
        } else {
            // Add H1 header
            lines[lineIndex] = "# " + currentLine;
        }
        
        const newContent = lines.join('\n');
        onContentChange(newContent);
        
        setTimeout(() => {
            textarea.focus();
        }, 0);
    };

    const insertLink = () => {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        let selectedText = markdownContent.substring(start, end);
        
        if (!selectedText) {
            selectedText = "Link Text";
        }

        const linkMarkdown = `[${selectedText}](URL)`;
        const newContent = markdownContent.substring(0, start) + linkMarkdown + markdownContent.substring(end);
        onContentChange(newContent);
        
        // Select the URL part for easy editing
        setTimeout(() => {
            textarea.selectionStart = start + selectedText.length + 3;
            textarea.selectionEnd = start + selectedText.length + 6;
            textarea.focus();
        }, 0);
    };

    const renderMarkdownToHtml = (markdown) => {
        // Enhanced markdown to HTML conversion
        let html = "This is mockup and not the final pdf...\n" + markdown;
        
        // Code blocks first (to preserve their content)
        html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');
        
        // Headers
        html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
        html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold and Italic
        html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
        
        // Links and Images
        html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" />');
        html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');
        
        // Inline code
        html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
        
        // Lists - simpler approach with CSS indentation
        html = html.replace(/^(\s*)[-*+] (.+$)/gim, (match, indent, content) => {
            const indentLevel = Math.floor(indent.length / 4);
            return `<li style="margin-left: ${indentLevel * 20}px">${content}</li>`;
        });
        html = html.replace(/^(\s*)\d+\. (.+$)/gim, (match, indent, content) => {
            const indentLevel = Math.floor(indent.length / 4);
            return `<li class="ordered" style="margin-left: ${indentLevel * 20}px">${content}</li>`;
        });
        
        // Wrap consecutive list items in appropriate tags - more precise
        const lines = html.split('\n');
        const processedLines = [];
        let inOrderedList = false;
        let inUnorderedList = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const isOrderedItem = line.match(/^<li class="ordered"/);
            const isUnorderedItem = line.match(/^<li(?:\s[^>]*)?>/) && !isOrderedItem;
            
            if (isOrderedItem) {
                if (!inOrderedList) {
                    processedLines.push('<ol>');
                    inOrderedList = true;
                }
                if (inUnorderedList) {
                    processedLines[processedLines.length - 1] += '</ul>';
                    inUnorderedList = false;
                }
                processedLines.push(line);
            } else if (isUnorderedItem) {
                if (!inUnorderedList) {
                    processedLines.push('<ul>');
                    inUnorderedList = true;
                }
                if (inOrderedList) {
                    processedLines[processedLines.length - 1] += '</ol>';
                    inOrderedList = false;
                }
                processedLines.push(line);
            } else {
                // Not a list item
                if (inOrderedList) {
                    processedLines.push('</ol>');
                    inOrderedList = false;
                }
                if (inUnorderedList) {
                    processedLines.push('</ul>');
                    inUnorderedList = false;
                }
                processedLines.push(lines[i]); // Keep original spacing
            }
        }
        
        // Close any remaining open lists
        if (inOrderedList) {
            processedLines.push('</ol>');
        }
        if (inUnorderedList) {
            processedLines.push('</ul>');
        }
        
        html = processedLines.join('\n');
        
        // Clean up list item classes
        html = html.replace(/<li class="ordered"/gm, '<li');
        
        // Blockquotes
        html = html.replace(/^> (.+$)/gim, '<blockquote>$1</blockquote>');
        
        // Clean up extra whitespace around block elements
        html = html.replace(/>\s*\n\s*</gm, '><');
        
        // Convert double line breaks to paragraph breaks
        html = html.replace(/\n\s*\n/gm, '</p><p>');
        
        // Wrap in paragraph tags if content doesn't start with a block element
        if (html && !html.match(/^\s*<(h[1-6]|ul|ol|blockquote|pre|div)/)) {
            html = '<p>' + html + '</p>';
        }
        
        // Convert remaining single line breaks to br tags (only within paragraphs/inline content)
        html = html.replace(/(?<!>)\n(?!<)/gm, '<br />');
        
        // Clean up empty paragraphs and extra spaces
        html = html.replace(/<p>\s*<\/p>/gm, '');
        html = html.replace(/\s+/gm, ' ');
        
        return html;
    };

    const handleScroll = () => {
        // Sync scroll position between textarea and line numbers
        if (lineNumbersRef.current && textareaRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
            
            // Throttle scroll position saving to avoid excessive state updates
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            scrollTimeoutRef.current = setTimeout(() => {
                setMarkdownEditorScrollPosition(textareaRef.current.scrollTop);
            }, 100);
        }
    };

    const handlePreviewScroll = () => {
        // Throttle preview scroll position saving to avoid excessive state updates
        if (previewScrollTimeoutRef.current) {
            clearTimeout(previewScrollTimeoutRef.current);
        }
        previewScrollTimeoutRef.current = setTimeout(() => {
            if (previewRef.current) {
                setMarkdownPreviewScrollPosition(previewRef.current.scrollTop);
            }
        }, 100);
    };

    return (
        <div className="markdown-editor-wrapper">
            <div className="markdown-toolbar">
                <div className="left-toolbar">
                <div className="toolbar-group">
                    <button 
                        className="toolbar-btn" 
                        onClick={() => insertMarkdown("**", "**", "bold text")}
                        title="Bold (Ctrl+B)"
                    >
                        <BoldIcon/>
                    </button>
                    <button 
                        className="toolbar-btn" 
                        onClick={() => insertMarkdown("*", "*", "italic text")}
                        title="Italic (Ctrl+I)"
                    >
                        <ItalicIcon/>
                    </button>
                    <button 
                        className="toolbar-btn" 
                        onClick={incrementHeader}
                        title="Header"
                    >
                        <HeaderIcon/>
                    </button>
                </div>
                
                <div className="toolbar-group">
                    <button 
                        className="toolbar-btn" 
                        onClick={() => insertAtLineStart("> ")}
                        title="Quote"
                    >
                        <QuoteIcon/>
                    </button>
                    <button 
                        className="toolbar-btn" 
                        onClick={() => insertAtLineStart("- ")}
                        title="Bullet List"
                    >
                        <UnorderedListIcon/>
                    </button>
                    <button 
                        className="toolbar-btn" 
                        onClick={() => insertAtLineStart("1. ")}
                        title="Numbered List"
                    >
                        <NumberedListIcon/>
                    </button>
                </div>
                
                <div className="toolbar-group">
                    <button 
                        className="toolbar-btn" 
                        onClick={insertLink}
                        title="Link (Ctrl+K)"
                    >
                        <LinkIcon/>
                    </button>
                    <button 
                        className="toolbar-btn" 
                        onClick={() => insertMarkdown("![Alt text](", ")", "image-url")}
                        title="Image"
                    >
                        <ImageIcon/>
                    </button>
                    <button 
                        className="toolbar-btn" 
                        onClick={() => insertMarkdown("`", "`", "code")}
                        title="Code"
                    >
                        <CodeIcon/>
                    </button>
                </div>

                </div>
                <div className="right-toolbar">
                
                <div className="toolbar-group">
                    <button 
                        className={`toolbar-btn ${markdownPreviewOpen ? 'active' : ''}`}
                        onClick={() => setMarkdownPreviewOpen(!markdownPreviewOpen)}
                        title="Toggle Preview"
                    >
                        <EyeIcon/>
                    </button>
                </div>
                </div>
            </div>
            
            <div className="markdown-content-container">
                <div className={`markdown-editor ${markdownPreviewOpen ? 'split-view' : 'full-view'}`}>
                    <div className="editor-container">
                        <div 
                            ref={lineNumbersRef}
                            className="line-numbers"
                        ></div>
                        <textarea
                            ref={textareaRef}
                            className="markdown-textarea"
                            value={markdownContent}
                            onChange={handleTextareaChange}
                            onKeyDown={handleKeyDown}
                            onScroll={handleScroll}
                            placeholder="Start writing your markdown content here..."
                            spellCheck={false}
                        />
                    </div>
                </div>
                
                {markdownPreviewOpen && (
                    <div className="markdown-preview" ref={previewRef} onScroll={handlePreviewScroll}>
                        <div 
                            className="preview-content"
                            dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(markdownContent) }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
} 