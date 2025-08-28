"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

export function MarkdownEditor({
  value,
  onChange,
  title,
  onTitleChange,
}: MarkdownEditorProps) {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="space-y-2 flex-shrink-0">
        <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
          Document Title
        </Label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter document title..."
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8360ff]/20 focus:border-[#8360ff] transition-all duration-200 placeholder:text-gray-400"
        />
      </div>

      <div className="flex-1 flex flex-col space-y-2 min-h-0">
        <Label
          htmlFor="markdown"
          className="text-sm font-semibold text-gray-700 flex-shrink-0"
        >
          Markdown Content
        </Label>
        <Textarea
          id="markdown"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="# Welcome to Markdown Editor

Start typing your **markdown** content here...

You can also upload a .md file using the 'Upload MD' button above.

## Features
- ✨ Live preview
- 🎨 Syntax highlighting  
- 📄 PDF export
- 📊 Mermaid diagrams
- 📁 File upload support
- 👁️ Multiple view modes

### Table Example - Form Status States

| Status | Deskripsi | Dapat Diakses Oleh |
|--------|-----------|-------------------|
| draft | Form baru dibuat, belum disubmit untuk approval | Creator, Superadmin |
| open | Form telah disubmit dan menunggu approval step pertama | Creator, Approver, Superadmin |
| in_approval | Form sedang dalam proses approval (step 2+) | Creator, Approver, Superadmin |
| approved | Form telah diapprove semua step, siap untuk payment | Creator, Finance, Superadmin |
| rejected | Form ditolak dan perlu revisi | Creator, Superadmin |

### Permission Matrix

| Action | Creator | Approver | Finance | Superadmin |
|--------|---------|----------|---------|------------|
| Create Form | Yes | No | No | Yes |
| Edit Draft | Yes | No | No | Yes |
| Submit for Approval | Yes | No | No | Yes |
| Approve Form | No | Yes* | No | Yes |
| Reject Form | No | Yes* | No | Yes |

### Code Example
```javascript
function hello() {
  console.log('Hello, World!');
}
```

### Mermaid Diagram
```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
```

> **Tip:** Use the view mode buttons to switch between side-by-side, editor-only, or preview-only views!"
          className="flex-1 font-mono text-sm leading-relaxed resize-none custom-scrollbar bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8360ff]/20 focus:border-[#8360ff] transition-all duration-200 min-h-0"
          style={{ minHeight: "400px" }}
        />
      </div>
    </div>
  );
}
