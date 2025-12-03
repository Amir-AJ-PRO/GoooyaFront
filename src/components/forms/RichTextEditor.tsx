'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Import polyfill برای findDOMNode در React 18
import '@/lib/react18-polyfill';

// Dynamic import برای جلوگیری از خطای SSR
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">در حال بارگذاری ویرایشگر...</div>
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

/**
 * کامپوننت ویرایشگر متن غنی با Quill
 */
export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'متن خود را وارد کنید...',
  minHeight = '300px'
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // تنظیمات toolbar با useMemo برای جلوگیری از re-render غیرضروری
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  }), []);

  const formats = useMemo(() => ([
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'color', 'background',
    'link'
  ]), []);

  if (!mounted) {
    return (
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500"
        style={{ minHeight }}
      >
        در حال بارگذاری ویرایشگر...
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <style jsx global>{`
        .rich-text-editor .quill {
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          transition: border-color 0.2s;
        }
        
        .rich-text-editor .quill:focus-within {
          border-color: #3b82f6;
          outline: none;
        }
        
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border: none;
          border-bottom: 2px solid #e5e7eb;
          background: #f9fafb;
        }
        
        .rich-text-editor .ql-container {
          border: none;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          font-family: inherit;
          font-size: 16px;
        }
        
        .rich-text-editor .ql-editor {
          min-height: ${minHeight};
          direction: rtl;
          text-align: right;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: normal;
          right: 15px;
          left: auto;
        }

        /* استایل‌های بهتر برای محتوای RTL */
        .rich-text-editor .ql-editor p,
        .rich-text-editor .ql-editor li {
          text-align: right;
          direction: rtl;
        }

        .rich-text-editor .ql-editor ul,
        .rich-text-editor .ql-editor ol {
          padding-right: 1.5em;
          padding-left: 0;
        }
      `}</style>
      
      {/* استفاده از try-catch برای جلوگیری از خطا */}
      {mounted && (
        <ReactQuill
          theme="snow"
          value={value || ''} // Ensure value is always a string
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

