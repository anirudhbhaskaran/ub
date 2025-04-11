// components/CodeEditor.tsx
'use client';

import Editor from '@monaco-editor/react';

export default function CodeEditor({
  value,
  onChange,
  language,
  height = '200px',
}: {
  value: string;
  onChange: (val: string) => void;
  language: 'javascript' | 'python';
  height?: string;
}) {
  return (
    <Editor
      height={height}
      defaultLanguage={language}
      language={language}
      theme="vs-dark"
      value={value}
      onChange={(val) => onChange(val || '')}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        automaticLayout: true,
        lineNumbers: 'on',
      }}
    />
  );
}
