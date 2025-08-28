export interface ExportOptions {
  filename?: string;
  margin?: number;
  image?: { type: string; quality: number };
  html2canvas?: { scale: number; useCORS: boolean; backgroundColor?: string };
  jsPDF?: { unit: string; format: string; orientation: string };
}

export async function exportToPDF(
  elementId: string,
  options: ExportOptions = {}
): Promise<void> {
  // Dynamic import to avoid SSR issues
  const html2pdf = (await import("html2pdf.js")).default;

  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error("Element not found for PDF export");
  }

  const defaultOptions = {
    margin: [0.4, 0.5, 0.4, 0.5], // Top, Right, Bottom, Left - increased margins
    filename: "document.pdf",
    image: { type: "jpeg", quality: 0.95 },
    html2canvas: {
      scale: 1.2, // Reduced scale for better text rendering
      useCORS: true,
      letterRendering: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
      width: 800,
      height: null,
      removeContainer: true,
      onclone: (clonedDoc: Document) => {
        // Ensure better line height for readability
        const style = clonedDoc.createElement("style");
        style.innerHTML = `
          * {
            line-height: 1.6 !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }
          p, div, span {
            orphans: 3 !important;
            widows: 3 !important;
          }
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
          table {
            page-break-inside: auto !important;
          }
          tr {
            page-break-inside: avoid !important;
            page-break-after: auto !important;
          }
          td {
            page-break-inside: avoid !important;
          }
        `;
        clonedDoc.head.appendChild(style);
      },
    },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait",
      compress: true,
      precision: 2,
    },
    pagebreak: {
      mode: ["css", "legacy"],
      before: [".page-break-before", ".print-break"],
      after: [".page-break-after"],
      avoid: [
        "table",
        "tr",
        "img",
        "pre",
        ".mermaid",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
      ],
    },
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    // Show loading state
    const loadingElement = document.createElement("div");
    loadingElement.id = "pdf-loading";
    loadingElement.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; color: white; font-family: system-ui, sans-serif;">
        <div style="text-align: center;">
          <div style="width: 50px; height: 50px; border: 3px solid #8360ff; border-top: 3px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
          <p>Generating PDF...</p>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(loadingElement);

    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Prepare the element for PDF export with better spacing
    clonedElement.style.display = "block";
    clonedElement.style.visibility = "visible";
    clonedElement.style.position = "static";
    clonedElement.style.width = "100%";
    clonedElement.style.maxWidth = "800px";
    clonedElement.style.backgroundColor = "#ffffff";
    clonedElement.style.fontFamily = "system-ui, -apple-system, sans-serif";
    clonedElement.style.fontSize = "12px";
    clonedElement.style.lineHeight = "1.5";
    clonedElement.style.color = "#2d3748";
    clonedElement.style.padding = "20px";
    clonedElement.style.boxSizing = "border-box";

    // Remove unnecessary spacing and empty elements
    const emptyElements = clonedElement.querySelectorAll(
      "div:empty, p:empty, span:empty"
    );
    emptyElements.forEach((el) => el.remove());

    // Process headings for better spacing
    const headings = clonedElement.querySelectorAll("h1, h2, h3, h4, h5, h6");
    for (const heading of Array.from(headings)) {
      (heading as HTMLElement).style.pageBreakAfter = "avoid";
      (heading as HTMLElement).style.marginTop = "24px";
      (heading as HTMLElement).style.marginBottom = "12px";
      (heading as HTMLElement).style.lineHeight = "1.3";
    }

    // Process paragraphs for consistent spacing
    const paragraphs = clonedElement.querySelectorAll("p");
    for (const p of Array.from(paragraphs)) {
      (p as HTMLElement).style.marginTop = "0";
      (p as HTMLElement).style.marginBottom = "12px";
      (p as HTMLElement).style.pageBreakInside = "avoid";
    }

    // Process mermaid diagrams for better PDF layout
    const mermaidElements = clonedElement.querySelectorAll(".mermaid");
    for (const mermaidEl of Array.from(mermaidElements)) {
      const svgElement = mermaidEl.querySelector("svg");
      if (svgElement) {
        svgElement.setAttribute("width", "100%");
        svgElement.setAttribute("height", "auto");
        svgElement.style.maxWidth = "100%";
        svgElement.style.height = "auto";
        svgElement.style.display = "block";
        svgElement.style.margin = "16px auto";

        (mermaidEl as HTMLElement).style.pageBreakInside = "avoid";
        (mermaidEl as HTMLElement).style.marginTop = "16px";
        (mermaidEl as HTMLElement).style.marginBottom = "16px";
      }
    }

    // Process code blocks for better PDF rendering
    const codeBlocks = clonedElement.querySelectorAll("pre");
    for (const codeBlock of Array.from(codeBlocks)) {
      (codeBlock as HTMLElement).style.backgroundColor = "#f7fafc";
      (codeBlock as HTMLElement).style.color = "#2d3748";
      (codeBlock as HTMLElement).style.padding = "12px";
      (codeBlock as HTMLElement).style.borderRadius = "4px";
      (codeBlock as HTMLElement).style.margin = "12px 0";
      (codeBlock as HTMLElement).style.fontSize = "11px";
      (codeBlock as HTMLElement).style.lineHeight = "1.4";
      (codeBlock as HTMLElement).style.overflow = "visible";
      (codeBlock as HTMLElement).style.whiteSpace = "pre-wrap";
      (codeBlock as HTMLElement).style.wordBreak = "break-word";
      (codeBlock as HTMLElement).style.pageBreakInside = "avoid";
      (codeBlock as HTMLElement).style.border = "1px solid #e2e8f0";
    }

    // Process tables for better PDF rendering
    const tables = clonedElement.querySelectorAll("table");
    for (const table of Array.from(tables)) {
      (table as HTMLElement).style.borderCollapse = "collapse";
      (table as HTMLElement).style.width = "100%";
      (table as HTMLElement).style.margin = "16px 0";
      (table as HTMLElement).style.pageBreakInside = "avoid";
      (table as HTMLElement).style.fontSize = "11px";

      // Style table headers
      const headers = table.querySelectorAll("th");
      for (const header of Array.from(headers)) {
        (header as HTMLElement).style.backgroundColor = "#667eea";
        (header as HTMLElement).style.color = "white";
        (header as HTMLElement).style.padding = "8px 10px";
        (header as HTMLElement).style.fontSize = "10px";
        (header as HTMLElement).style.fontWeight = "600";
        (header as HTMLElement).style.textAlign = "left";
        (header as HTMLElement).style.border = "1px solid #5a67d8";
      }

      // Style table cells
      const cells = table.querySelectorAll("td");
      for (const cell of Array.from(cells)) {
        (cell as HTMLElement).style.border = "1px solid #e2e8f0";
        (cell as HTMLElement).style.padding = "8px 10px";
        (cell as HTMLElement).style.fontSize = "10px";
        (cell as HTMLElement).style.lineHeight = "1.4";
        (cell as HTMLElement).style.verticalAlign = "top";
      }

      // Add zebra striping
      const rows = table.querySelectorAll("tbody tr");
      for (let i = 0; i < rows.length; i++) {
        if (i % 2 === 1) {
          (rows[i] as HTMLElement).style.backgroundColor = "#f7fafc";
        }
      }
    }

    // Process lists for better spacing
    const lists = clonedElement.querySelectorAll("ul, ol");
    for (const list of Array.from(lists)) {
      (list as HTMLElement).style.marginTop = "8px";
      (list as HTMLElement).style.marginBottom = "16px";
      (list as HTMLElement).style.paddingLeft = "20px";

      const items = list.querySelectorAll("li");
      for (const item of Array.from(items)) {
        (item as HTMLElement).style.marginBottom = "4px";
        (item as HTMLElement).style.lineHeight = "1.4";
      }
    }

    // Process blockquotes
    const blockquotes = clonedElement.querySelectorAll("blockquote");
    for (const quote of Array.from(blockquotes)) {
      (quote as HTMLElement).style.borderLeft = "3px solid #667eea";
      (quote as HTMLElement).style.paddingLeft = "16px";
      (quote as HTMLElement).style.margin = "16px 0";
      (quote as HTMLElement).style.backgroundColor = "#f7fafc";
      (quote as HTMLElement).style.padding = "12px 16px";
      (quote as HTMLElement).style.pageBreakInside = "avoid";
    }

    // Temporarily append to document for proper rendering
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "0";
    tempContainer.style.width = "800px";
    tempContainer.style.backgroundColor = "#ffffff";
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    await html2pdf().set(finalOptions).from(clonedElement).save();

    // Clean up temporary container
    document.body.removeChild(tempContainer);

    // Remove loading state
    document.body.removeChild(loadingElement);
  } catch (error) {
    // Clean up temporary container if it exists
    const tempContainer = document.querySelector(
      'body > div[style*="position: absolute"][style*="left: -9999px"]'
    );
    if (tempContainer) {
      document.body.removeChild(tempContainer);
    }

    // Remove loading state if there's an error
    const loadingElement = document.getElementById("pdf-loading");
    if (loadingElement) {
      document.body.removeChild(loadingElement);
    }

    console.error("PDF Export Error:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
}

export function generateFilename(title: string): string {
  const sanitizedTitle = title
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
    .trim();

  const timestamp = new Date().toISOString().split("T")[0];
  return `${sanitizedTitle || "document"}-${timestamp}.pdf`;
}
