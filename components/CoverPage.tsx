"use client";

import React from "react";
import { FileText } from "lucide-react";

interface CoverPageProps {
  title: string;
  version?: string;
}

export function CoverPage({ title, version = "1.0.0" }: CoverPageProps) {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="cover-page h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#8360ff] to-[#6d47e6] text-white p-12 print-break">
      <div className="text-center space-y-8">
        {/* Logo */}
        <div className="mb-12">
          <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm">
            <FileText size={48} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold leading-tight">
            {title || "Untitled Document"}
          </h1>
          <div className="w-32 h-1 bg-white/50 mx-auto rounded-full"></div>
        </div>

        {/* Document Info */}
        <div className="space-y-6 text-xl">
          <div className="space-y-2">
            <p className="text-white/80">Version</p>
            <p className="font-semibold">{version}</p>
          </div>

          <div className="space-y-2">
            <p className="text-white/80">Generated on</p>
            <p className="font-semibold">{currentDate}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16">
          <p className="text-white/60 text-sm">
            Created with Bambang Markdown Editor
          </p>
        </div>
      </div>
    </div>
  );
}
