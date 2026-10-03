'use client';
import { Markdown } from '@tiptap/markdown';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

import { RICH_TEXT_CLASS } from '@/components/base/richTextStyles';

interface RichTextContentProps {
  value: string;
}

const RichTextContent = ({ value }: Readonly<RichTextContentProps>) => {
  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    content: value,
    contentType: 'markdown',
    editable: false,
    immediatelyRender: false,
    editorProps: { attributes: { class: RICH_TEXT_CLASS } }
  });

  useEffect(() => {
    if (editor && editor.getMarkdown() !== value) {
      editor.commands.setContent(value, { contentType: 'markdown' });
    }
  }, [editor, value]);

  return <EditorContent editor={editor} />;
};

export { RichTextContent };
