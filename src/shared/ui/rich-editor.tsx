"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";


import "react-quill-new/dist/quill.snow.css"; 


const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-64 bg-slate-50 animate-pulse rounded-xl" />
});

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichEditor = ({ value, onChange, placeholder }: RichEditorProps) => {
  
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  }), []);

  return (
    <div className="rich-editor-wrapper">
      <style jsx global>{`
        .ql-container {
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          font-family: inherit;
          font-size: 1rem;
          min-height: 150px;
        }
        .ql-toolbar {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          background-color: #f8fafc;
        }
        .ql-editor {
           min-height: 150px;
        }
      `}</style>
      
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || "Vakansiya haqida batafsil yozing..."}
        className="bg-white rounded-xl shadow-sm"
      />
    </div>
  );
};