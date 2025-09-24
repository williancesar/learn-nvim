// Day 19: Advanced Text Objects Practice - Comments, Strings, and Code Blocks
// Practice with comment blocks, multi-line strings, and complex code structures
// Use text objects like ip (inner paragraph), ap (around paragraph), and custom text objects

/**
 * Advanced JavaScript Code Editor and Syntax Highlighter
 * This module demonstrates complex text structures including:
 * - Multi-line comments and documentation blocks
 * - Template literals and multi-line strings
 * - Nested function definitions and code blocks
 * - Regular expressions and complex patterns
 */

// Configuration constants and settings
const EDITOR_CONFIG = {
    // Theme and appearance settings
    theme: {
        name: 'dark',
        colors: {
            background: '#1e1e1e',
            foreground: '#d4d4d4',
            comment: '#6a9955',
            string: '#ce9178',
            keyword: '#569cd6',
            number: '#b5cea8',
            operator: '#d4d4d4'
        }
    },

    // Editor behavior configuration
    editor: {
        tabSize: 4,
        insertSpaces: true,
        autoIndent: true,
        wordWrap: 'on',
        lineNumbers: true,
        minimap: {
            enabled: true,
            side: 'right'
        }
    },

    // Language support settings
    languages: {
        javascript: {
            extensions: ['.js', '.jsx', '.mjs'],
            highlighter: 'tree-sitter-javascript',
            formatter: 'prettier',
            linter: 'eslint'
        },
        typescript: {
            extensions: ['.ts', '.tsx'],
            highlighter: 'tree-sitter-typescript',
            formatter: 'prettier',
            linter: 'tslint'
        },
        python: {
            extensions: ['.py', '.pyw'],
            highlighter: 'tree-sitter-python',
            formatter: 'black',
            linter: 'pylint'
        }
    }
};

/*
 * Syntax highlighting engine using regular expressions
 * Supports multiple programming languages with extensible patterns
 * Each language defines its own set of token patterns and rules
 */
class SyntaxHighlighter {
    constructor(language = 'javascript') {
        this.language = language;
        this.patterns = this.initializePatterns();
        this.cache = new Map();
    }

    /*
     * Initialize syntax patterns for different languages
     * Returns a comprehensive set of regular expressions for tokenization
     */
    initializePatterns() {
        const patterns = {
            // JavaScript language patterns
            javascript: {
                // Comments: single-line and multi-line
                comment: [
                    /\/\/.*$/gm,                    // Single-line comments
                    /\/\*[\s\S]*?\*\//gm           // Multi-line comments
                ],

                // String literals: various quote types
                string: [
                    /"(?:[^"\\]|\\.)*"/g,          // Double-quoted strings
                    /'(?:[^'\\]|\\.)*'/g,          // Single-quoted strings
                    /`(?:[^`\\]|\\.|`)*`/g         // Template literals
                ],

                // Keywords and reserved words
                keyword: /\b(?:abstract|arguments|await|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|eval|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var|void|volatile|while|with|yield)\b/g,

                // Numbers: integers, floats, scientific notation
                number: /\b(?:0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|\d+\.?\d*(?:[eE][+-]?\d+)?)\b/g,

                // Operators and punctuation
                operator: /[+\-*/%=!<>&|^~?:;.,()[\]{}]/g,

                // Function names and identifiers
                function: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/g,

                // Regular expression literals
                regex: /\/(?:[^\/\\\n]|\\.)+\/[gimuy]*/g
            },

            // Python language patterns
            python: {
                comment: [
                    /#.*$/gm,                      // Single-line comments
                    /"""[\s\S]*?"""/g,             // Triple-quoted strings (docstrings)
                    /'''[\s\S]*?'''/g              // Single-quoted docstrings
                ],

                string: [
                    /"(?:[^"\\]|\\.)*"/g,
                    /'(?:[^'\\]|\\.)*'/g,
                    /"""[\s\S]*?"""/g,
                    /'''[\s\S]*?'''/g,
                    /r"(?:[^"\\]|\\.)*"/g,         // Raw strings
                    /r'(?:[^'\\]|\\.)*'/g,
                    /f"(?:[^"\\]|\\.)*"/g,         // F-strings
                    /f'(?:[^'\\]|\\.)*'/g
                ],

                keyword: /\b(?:and|as|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|raise|return|try|while|with|yield|None|True|False)\b/g,

                number: /\b(?:0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|\d+\.?\d*(?:[eE][+-]?\d+)?[jJ]?)\b/g,

                operator: /[+\-*/%=!<>&|^~?:;.,()[\]{}]/g,

                function: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g
            }
        };

        return patterns[this.language] || patterns.javascript;
    }

    /*
     * Tokenize source code into syntax elements
     * Returns an array of tokens with type and position information
     */
    tokenize(code) {
        // Check cache first for performance
        const cacheKey = `${this.language}:${code.slice(0, 100)}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const tokens = [];
        const lines = code.split('\n');

        lines.forEach((line, lineIndex) => {
            let position = 0;

            // Process each pattern type
            Object.entries(this.patterns).forEach(([type, patterns]) => {
                const patternArray = Array.isArray(patterns) ? patterns : [patterns];

                patternArray.forEach(pattern => {
                    let match;
                    const regex = new RegExp(pattern.source, pattern.flags);

                    while ((match = regex.exec(line)) !== null) {
                        tokens.push({
                            type,
                            value: match[0],
                            line: lineIndex,
                            start: match.index,
                            end: match.index + match[0].length
                        });
                    }
                });
            });
        });

        // Sort tokens by position for correct highlighting order
        tokens.sort((a, b) => {
            if (a.line !== b.line) return a.line - b.line;
            return a.start - b.start;
        });

        // Cache the result for future use
        this.cache.set(cacheKey, tokens);
        return tokens;
    }

    /*
     * Apply syntax highlighting to HTML output
     * Wraps tokens in span elements with appropriate CSS classes
     */
    highlight(code) {
        const tokens = this.tokenize(code);
        const lines = code.split('\n');
        const highlightedLines = [];

        lines.forEach((line, lineIndex) => {
            let highlightedLine = '';
            let lastEnd = 0;

            // Find tokens for this line
            const lineTokens = tokens.filter(token => token.line === lineIndex);

            lineTokens.forEach(token => {
                // Add any text before this token
                if (token.start > lastEnd) {
                    highlightedLine += this.escapeHtml(line.slice(lastEnd, token.start));
                }

                // Add the highlighted token
                highlightedLine += `<span class="token-${token.type}">${this.escapeHtml(token.value)}</span>`;
                lastEnd = token.end;
            });

            // Add any remaining text after the last token
            if (lastEnd < line.length) {
                highlightedLine += this.escapeHtml(line.slice(lastEnd));
            }

            highlightedLines.push(highlightedLine);
        });

        return highlightedLines.join('\n');
    }

    /*
     * Escape HTML special characters to prevent XSS attacks
     * Replaces <, >, &, ", and ' with their HTML entity equivalents
     */
    escapeHtml(text) {
        const entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return text.replace(/[&<>"']/g, (char) => entityMap[char]);
    }
}

/*
 * Code editor component with advanced features
 * Provides syntax highlighting, auto-completion, and error detection
 */
class CodeEditor {
    constructor(container, options = {}) {
        this.container = container;
        this.options = { ...EDITOR_CONFIG.editor, ...options };
        this.content = '';
        this.cursor = { line: 0, column: 0 };
        this.selection = { start: null, end: null };
        this.history = [];
        this.historyIndex = -1;
        this.highlighter = new SyntaxHighlighter(options.language);

        this.initializeEditor();
        this.bindEvents();
    }

    /*
     * Initialize the editor DOM structure and styling
     * Creates necessary elements for line numbers, content area, and minimap
     */
    initializeEditor() {
        // Create main editor container
        this.editorElement = document.createElement('div');
        this.editorElement.className = 'code-editor';
        this.editorElement.innerHTML = `
            <div class="editor-header">
                <div class="editor-tabs">
                    <div class="editor-tab active">
                        <span class="tab-name">main.js</span>
                        <button class="tab-close">×</button>
                    </div>
                </div>
                <div class="editor-actions">
                    <button class="action-button" title="Format Code">
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <path d="M4 4h8v1H4V4zm0 3h8v1H4V7zm0 3h5v1H4v-1z"/>
                        </svg>
                    </button>
                    <button class="action-button" title="Find and Replace">
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <path d="M11.5 3a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="editor-body">
                <div class="line-numbers" contenteditable="false"></div>
                <div class="editor-content" contenteditable="true"></div>
                <div class="editor-minimap"></div>
            </div>
            <div class="editor-footer">
                <span class="cursor-position">Line 1, Column 1</span>
                <span class="file-encoding">UTF-8</span>
                <span class="language-mode">${this.highlighter.language}</span>
            </div>
        `;

        this.container.appendChild(this.editorElement);

        // Get references to editor elements
        this.lineNumbers = this.editorElement.querySelector('.line-numbers');
        this.contentArea = this.editorElement.querySelector('.editor-content');
        this.minimap = this.editorElement.querySelector('.editor-minimap');
        this.cursorPosition = this.editorElement.querySelector('.cursor-position');
    }

    /*
     * Bind event handlers for editor functionality
     * Handles keyboard input, mouse events, and editor actions
     */
    bindEvents() {
        // Content change events
        this.contentArea.addEventListener('input', (event) => {
            this.handleContentChange(event);
        });

        // Keyboard shortcuts and special keys
        this.contentArea.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });

        // Mouse events for cursor positioning
        this.contentArea.addEventListener('click', (event) => {
            this.updateCursorPosition(event);
        });

        // Selection events
        this.contentArea.addEventListener('mouseup', () => {
            this.updateSelection();
        });

        // Tab functionality
        this.editorElement.querySelector('.tab-close').addEventListener('click', () => {
            this.closeTab();
        });

        // Action button events
        this.editorElement.querySelector('.action-button[title="Format Code"]').addEventListener('click', () => {
            this.formatCode();
        });

        this.editorElement.querySelector('.action-button[title="Find and Replace"]').addEventListener('click', () => {
            this.showFindReplace();
        });
    }

    /*
     * Handle content changes and trigger syntax highlighting
     * Updates the editor display and maintains cursor position
     */
    handleContentChange(event) {
        this.content = this.contentArea.textContent;
        this.addToHistory(this.content);
        this.updateSyntaxHighlighting();
        this.updateLineNumbers();
        this.updateMinimap();
    }

    /*
     * Handle special keyboard shortcuts and commands
     * Implements common editor shortcuts like Ctrl+S, Ctrl+Z, etc.
     */
    handleKeyDown(event) {
        // Save shortcut
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            this.saveFile();
            return;
        }

        // Undo shortcut
        if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
            event.preventDefault();
            this.undo();
            return;
        }

        // Redo shortcut
        if (event.ctrlKey && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
            event.preventDefault();
            this.redo();
            return;
        }

        // Tab handling for indentation
        if (event.key === 'Tab') {
            event.preventDefault();
            this.insertTab(event.shiftKey);
            return;
        }

        // Auto-closing brackets and quotes
        if (this.shouldAutoClose(event.key)) {
            this.insertAutoClose(event.key);
            event.preventDefault();
            return;
        }
    }

    /*
     * Update syntax highlighting for the current content
     * Applies color coding based on the selected language
     */
    updateSyntaxHighlighting() {
        const highlightedContent = this.highlighter.highlight(this.content);
        // Note: In a real implementation, we'd need to preserve cursor position
        // This is a simplified version for demonstration
        this.contentArea.innerHTML = highlightedContent;
    }

    /*
     * Generate and update line numbers display
     * Synchronizes with content area scroll position
     */
    updateLineNumbers() {
        const lines = this.content.split('\n');
        const lineNumbersHtml = lines.map((_, index) =>
            `<div class="line-number">${index + 1}</div>`
        ).join('');

        this.lineNumbers.innerHTML = lineNumbersHtml;
    }

    /*
     * Update minimap representation of the code
     * Provides a bird's-eye view of the entire document
     */
    updateMinimap() {
        const lines = this.content.split('\n');
        const minimapHtml = lines.slice(0, 100).map(line => {
            const truncated = line.slice(0, 50);
            const density = Math.min(line.length / 80, 1);
            return `<div class="minimap-line" style="opacity: ${0.3 + density * 0.7}">${truncated}</div>`;
        }).join('');

        this.minimap.innerHTML = minimapHtml;
    }
}

// Export the editor components and utilities
export {
    EDITOR_CONFIG,
    SyntaxHighlighter,
    CodeEditor
};