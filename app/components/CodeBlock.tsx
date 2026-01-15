"use client";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  code,
  language = "typescript",
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 sm:my-4 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
      {/* Header with filename and copy button */}
      <div className="flex items-center justify-between bg-slate-900/50 border-b border-slate-800 px-3 py-2 sm:px-4">
        {/* Filename tab */}
        {filename && (
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-slate-800/50 rounded-md text-[11px] sm:text-xs text-slate-300 font-mono truncate max-w-[200px]">
              {filename}
            </div>
          </div>
        )}

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="ml-auto flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md 
                     bg-slate-800/50 hover:bg-slate-700/50 
                     text-[11px] sm:text-xs text-slate-300 transition-colors
                     border border-slate-700/50"
        >
          {copied ? (
            <>
              <svg
                className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="hidden xs:inline">Copied</span>
            </>
          ) : (
            <>
              <svg
                className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span className="hidden xs:inline">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: "0.75rem",
            background: "transparent",
            fontSize: "0.8125rem",
          }}
          codeTagProps={{
            style: {
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
