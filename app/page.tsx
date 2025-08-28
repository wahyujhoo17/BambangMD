"use client";

import React, { useState, useEffect, useRef } from "react";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import { CoverPage } from "@/components/CoverPage";
import { exportToPDF, generateFilename } from "@/lib/pdfExporter";
import { Button } from "@/components/ui/button";
import {
  Download,
  Eye,
  Edit3,
  FileText,
  Upload,
  Columns2,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("My Document");
  const [isExporting, setIsExporting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">(
    "split"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved content on mount
  useEffect(() => {
    const savedMarkdown = localStorage.getItem("markdown-content");
    const savedTitle = localStorage.getItem("document-title");

    if (savedMarkdown) setMarkdown(savedMarkdown);
    if (savedTitle) setTitle(savedTitle);
  }, []);

  // Auto-save content
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("markdown-content", markdown);
      localStorage.setItem("document-title", title);
    }, 500);

    return () => clearTimeout(timer);
  }, [markdown, title]);

  const handleExportPDF = async () => {
    if (!markdown.trim()) {
      alert("Please add some content before exporting to PDF");
      return;
    }

    setIsExporting(true);
    try {
      const filename = generateFilename(title);
      await exportToPDF("export-content", { filename });
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // console.log("File selected:", file);

    if (file) {
      // console.log("File name:", file.name);
      // console.log("File type:", file.type);
      // console.log("File size:", file.size);

      setIsUploading(true);

      // Check for markdown files more broadly
      const isMarkdownFile =
        file.type === "text/markdown" ||
        file.type === "text/x-markdown" ||
        file.name.toLowerCase().endsWith(".md") ||
        file.name.toLowerCase().endsWith(".markdown");

      if (isMarkdownFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          console.log("File content loaded, length:", content.length);
          setMarkdown(content);
          setTitle(file.name.replace(/\.(md|markdown)$/i, ""));
          setIsUploading(false);
          alert("File uploaded successfully!");
        };
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          alert("Error reading file. Please try again.");
          setIsUploading(false);
        };
        reader.readAsText(file);
      } else {
        alert("Please select a valid Markdown file (.md or .markdown)");
        setIsUploading(false);
      }
    }

    // Reset input to allow selecting the same file again
    event.target.value = "";
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#8360ff] to-[#6d47e6] rounded-xl flex items-center justify-center">
                <FileText size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Bambang Markdown Editor
                </h1>
                <p className="text-sm text-gray-500">
                  Live preview & PDF export
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown,text/markdown,text/x-markdown"
                onChange={handleFileUpload}
                className="hidden"
              />

              <Button
                onClick={triggerFileUpload}
                disabled={isUploading}
                variant="outline"
                className="px-4 py-2 rounded-xl border-2 border-[#8360ff]/20 text-[#8360ff] hover:bg-[#8360ff]/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#8360ff]/30 border-t-[#8360ff] rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Upload MD
                  </>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="px-4 py-2 rounded-xl border-2 border-[#8360ff]/20 text-[#8360ff] hover:bg-[#8360ff]/10 transition-all duration-200 hidden lg:flex"
                  >
                    {viewMode === "split" && (
                      <Columns2 size={16} className="mr-2" />
                    )}
                    {viewMode === "editor" && (
                      <PanelLeftClose size={16} className="mr-2" />
                    )}
                    {viewMode === "preview" && (
                      <PanelRightClose size={16} className="mr-2" />
                    )}
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => setViewMode("split")}
                    className="cursor-pointer"
                  >
                    <Columns2 size={16} className="mr-2" />
                    Side by Side
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setViewMode("editor")}
                    className="cursor-pointer"
                  >
                    <PanelLeftClose size={16} className="mr-2" />
                    Editor Only
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setViewMode("preview")}
                    className="cursor-pointer"
                  >
                    <PanelRightClose size={16} className="mr-2" />
                    Preview Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={handleExportPDF}
                disabled={isExporting || !markdown.trim()}
                className="bg-gradient-to-r from-[#8360ff] to-[#6d47e6] hover:from-[#6d47e6] hover:to-[#5a3ad1] text-white px-6 py-2 rounded-xl font-semibold shadow-lg shadow-[#8360ff]/25 transition-all duration-200 hover:shadow-[#8360ff]/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download size={16} className="mr-2" />
                    Export PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Desktop View */}
        <div className="hidden lg:block h-[calc(100vh-140px)]">
          {viewMode === "split" && (
            <div className="grid grid-cols-2 gap-8 h-full">
              {/* Editor Section */}
              <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 flex flex-col">
                <div className="flex items-center space-x-2 mb-6">
                  <Edit3 size={20} className="text-[#8360ff]" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Editor
                  </h2>
                </div>
                <div className="flex-1 min-h-0">
                  <MarkdownEditor
                    value={markdown}
                    onChange={setMarkdown}
                    title={title}
                    onTitleChange={setTitle}
                  />
                </div>
              </div>

              {/* Preview Section */}
              <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col">
                <div className="flex items-center space-x-2 p-6 border-b border-gray-100">
                  <Eye size={20} className="text-[#8360ff]" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Preview
                  </h2>
                </div>
                <div className="flex-1 min-h-0">
                  <MarkdownPreview content={markdown} />
                </div>
              </div>
            </div>
          )}

          {viewMode === "editor" && (
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 h-full flex flex-col">
              <div className="flex items-center space-x-2 mb-6">
                <Edit3 size={20} className="text-[#8360ff]" />
                <h2 className="text-lg font-semibold text-gray-800">Editor</h2>
              </div>
              <div className="flex-1 min-h-0">
                <MarkdownEditor
                  value={markdown}
                  onChange={setMarkdown}
                  title={title}
                  onTitleChange={setTitle}
                />
              </div>
            </div>
          )}

          {viewMode === "preview" && (
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 h-full flex flex-col">
              <div className="flex items-center space-x-2 p-6 border-b border-gray-100">
                <Eye size={20} className="text-[#8360ff]" />
                <h2 className="text-lg font-semibold text-gray-800">Preview</h2>
              </div>
              <div className="flex-1 min-h-0">
                <MarkdownPreview content={markdown} />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-white rounded-xl p-1 shadow-md">
              <TabsTrigger
                value="editor"
                className="rounded-lg data-[state=active]:bg-[#8360ff] data-[state=active]:text-white"
              >
                <Edit3 size={16} className="mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="rounded-lg data-[state=active]:bg-[#8360ff] data-[state=active]:text-white"
              >
                <Eye size={16} className="mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="mt-6">
              <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 h-[calc(100vh-200px)]">
                <MarkdownEditor
                  value={markdown}
                  onChange={setMarkdown}
                  title={title}
                  onTitleChange={setTitle}
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-6">
              <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 h-[calc(100vh-200px)]">
                <MarkdownPreview content={markdown} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Loading Overlay for PDF Export */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#8360ff]/30 border-t-[#8360ff] rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Generating PDF...
              </h3>
              <p className="text-gray-600 text-sm">
                Please wait while we prepare your document
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Export Content */}
      <div id="export-content" className="hidden">
        <CoverPage title={title} />
        <div className="print-break">
          <MarkdownPreview content={markdown} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Made by{" "}
              <span className="text-[#8360ff] font-semibold">BagusWS</span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
