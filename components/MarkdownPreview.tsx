"use client";

import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import mermaid from "mermaid";

interface MarkdownPreviewProps {
  content: string;
}

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "inherit",
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
  },
  sequence: {
    useMaxWidth: true,
  },
  gantt: {
    useMaxWidth: true,
  },
});

// Function to normalize table formatting
const normalizeTableContent = (content: string): string => {
  let normalized = content;

  // Split content into lines
  const lines = normalized.split("\n");
  const processedLines: string[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    // Check if this line contains table markers but might be a broken table
    if (line.includes("|")) {
      // Look ahead to see if this might be a broken table pattern
      const potentialTableLines: string[] = [];
      let j = i;

      // Collect consecutive lines that might be part of a broken table
      while (j < lines.length) {
        const currentLine = lines[j].trim();

        // If it's a table-like line or an empty line (which might separate table rows)
        if (currentLine.includes("|") || currentLine === "") {
          potentialTableLines.push(currentLine);
          j++;

          // Stop if we find two consecutive non-table lines
          if (
            j < lines.length - 1 &&
            !lines[j].trim().includes("|") &&
            !lines[j + 1].trim().includes("|") &&
            lines[j].trim() !== "" &&
            lines[j + 1].trim() !== ""
          ) {
            break;
          }
        } else {
          // If it's not table-related, stop collecting
          break;
        }
      }

      // Check if we found a broken table pattern
      if (potentialTableLines.length >= 3) {
        const tableRows = potentialTableLines.filter(
          (l) => l.includes("|") && l.trim() !== ""
        );

        // If we have multiple table rows, try to reconstruct the table
        if (tableRows.length >= 2) {
          // Process each table row
          const processedTableRows: string[] = [];
          let foundSeparator = false;

          for (const row of tableRows) {
            let cleanedLine = row.trim();

            // Check if this line is a table separator (contains only |, -, and spaces)
            const isSeparator = /^[\|\s\-]+$/.test(cleanedLine);

            if (isSeparator) {
              foundSeparator = true;
              continue; // Skip separator lines, we'll generate our own
            }

            // Ensure the line starts and ends with |
            if (!cleanedLine.startsWith("|")) {
              cleanedLine = "|" + cleanedLine;
            }
            if (!cleanedLine.endsWith("|")) {
              cleanedLine = cleanedLine + "|";
            }

            // Split by | and clean each cell
            const cells = cleanedLine.split("|");
            const cleanedCells = cells.map((cell, index) => {
              if (index === 0 || index === cells.length - 1) {
                return ""; // First and last are empty because of splitting
              }
              return cell.trim();
            });

            // Reconstruct the line with proper spacing
            if (cleanedCells.length > 2) {
              const tableRow =
                "| " + cleanedCells.slice(1, -1).join(" | ") + " |";
              processedTableRows.push(tableRow);
            }
          }

          // Add the reconstructed table
          if (processedTableRows.length > 0) {
            // Add header row
            processedLines.push(processedTableRows[0]);

            // Add separator row (generate based on number of columns)
            if (processedTableRows[0]) {
              const columnCount =
                (processedTableRows[0].match(/\|/g) || []).length - 1;
              const separator = "|" + " --- |".repeat(columnCount);
              processedLines.push(separator);
            }

            // Add data rows
            for (let k = 1; k < processedTableRows.length; k++) {
              processedLines.push(processedTableRows[k]);
            }
          }

          // Skip all the lines we just processed
          i = j;
          continue;
        }
      }

      // If it's not a broken table, process as normal line
      if (line.includes("|")) {
        // Check if this is a separator line
        const isSeparator = /^[\|\s\-]+$/.test(line);
        if (isSeparator) {
          // This is a table separator, keep it as is
          processedLines.push(lines[i]);
        } else {
          let cleanedLine = line;

          // Ensure the line starts and ends with |
          if (!cleanedLine.startsWith("|")) {
            cleanedLine = "|" + cleanedLine;
          }
          if (!cleanedLine.endsWith("|")) {
            cleanedLine = cleanedLine + "|";
          }

          // Split by | and clean each cell
          const cells = cleanedLine.split("|");
          const cleanedCells = cells.map((cell, index) => {
            if (index === 0 || index === cells.length - 1) {
              return "";
            }
            return cell.trim();
          });

          // Reconstruct the line with proper spacing
          if (cleanedCells.length > 2) {
            const tableRow =
              "| " + cleanedCells.slice(1, -1).join(" | ") + " |";
            processedLines.push(tableRow);
          } else {
            processedLines.push(lines[i]);
          }
        }
      } else {
        processedLines.push(lines[i]);
      }
    } else {
      processedLines.push(lines[i]);
    }

    i++;
  }

  return processedLines.join("\n");
};

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  useEffect(() => {
    const renderMermaid = async () => {
      try {
        // Wait a bit for DOM to be ready
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Find all mermaid elements
        const mermaidElements = document.querySelectorAll(".mermaid");

        // Render each mermaid diagram
        for (let i = 0; i < mermaidElements.length; i++) {
          const element = mermaidElements[i] as HTMLElement;
          if (element.getAttribute("data-processed") !== "true") {
            try {
              const graphDefinition = element.textContent || "";
              if (graphDefinition.trim()) {
                // Generate unique ID for each diagram
                const id = `mermaid-${Date.now()}-${i}`;
                const { svg } = await mermaid.render(id, graphDefinition);
                element.innerHTML = svg;
                element.setAttribute("data-processed", "true");
              }
            } catch (error) {
              console.error("Mermaid render error:", error);
              element.innerHTML = `<div class="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">
                <strong>Mermaid Syntax Error:</strong><br/>
                ${error instanceof Error ? error.message : "Unknown error"}
              </div>`;
              element.setAttribute("data-processed", "true");
            }
          }
        }
      } catch (error) {
        console.error("Mermaid initialization error:", error);
      }
    };

    renderMermaid();
  }, [content]);

  // Normalize table content for better parsing
  const normalizedContent = normalizeTableContent(content);

  return (
    <div className="h-full overflow-auto custom-scrollbar">
      <div className="markdown-content prose prose-lg max-w-none p-6 bg-white">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: ({ node, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";
              const isInline = !match && !className;

              if (!isInline && language === "mermaid") {
                return (
                  <div
                    className="mermaid my-6 flex justify-center"
                    data-processed="false"
                  >
                    {String(children).replace(/\n$/, "")}
                  </div>
                );
              }

              return !isInline && match ? (
                <div className="my-4">
                  <SyntaxHighlighter
                    style={vscDarkPlus as any}
                    language={language}
                    PreTag="div"
                    className="rounded-lg shadow-md"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code
                  className="px-2 py-1 bg-gray-100 text-[#8360ff] rounded-md font-mono text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            h1: ({ children }) => (
              <h1 className="text-4xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-[#8360ff]">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-3xl font-semibold text-gray-800 mt-8 mb-4">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-2xl font-medium text-gray-700 mt-6 mb-3">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-gray-600 leading-relaxed mb-4">{children}</p>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-[#8360ff] hover:text-[#6d47e6] underline decoration-2 underline-offset-2 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-[#8360ff] pl-6 py-2 my-6 bg-purple-50 italic text-gray-700">
                {children}
              </blockquote>
            ),
            ul: ({ children }) => (
              <ul className="list-disc ml-6 mb-4 space-y-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal ml-6 mb-4 space-y-1">{children}</ol>
            ),
            li: ({ children }) => <li className="text-gray-600">{children}</li>,
            // Enhanced table components
            table: ({ children, ...props }) => (
              <div className="my-8 overflow-x-auto">
                <table
                  className="w-full border-collapse bg-white text-left text-sm rounded-lg overflow-hidden shadow-lg border border-gray-200"
                  {...props}
                >
                  {children}
                </table>
              </div>
            ),
            thead: ({ children, ...props }) => (
              <thead
                className="bg-gradient-to-r from-[#8360ff] to-[#6d47e6]"
                {...props}
              >
                {children}
              </thead>
            ),
            tbody: ({ children, ...props }) => (
              <tbody className="divide-y divide-gray-100" {...props}>
                {children}
              </tbody>
            ),
            tr: ({ children, ...props }) => (
              <tr className="hover:bg-gray-50 transition-colors" {...props}>
                {children}
              </tr>
            ),
            th: ({ children, ...props }) => (
              <th
                className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white text-left"
                {...props}
              >
                {children}
              </th>
            ),
            td: ({ children, ...props }) => (
              <td
                className="px-6 py-4 text-sm text-gray-900 border-b border-gray-100"
                {...props}
              >
                {children}
              </td>
            ),
            hr: () => <hr className="my-8 border-gray-300" />,
          }}
        >
          {normalizedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
