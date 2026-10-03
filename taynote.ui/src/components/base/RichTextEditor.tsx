'use client';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from '@tiptap/markdown';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  SquareCode,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2
} from 'lucide-react';
import { useEffect } from 'react';

import { RICH_TEXT_CLASS } from '@/components/base/richTextStyles';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  label?: string;
  placeholder?: string;
  maxLength?: number;
  error?: string;
}

const RichTextEditor = ({
  value,
  onChange,
  label,
  placeholder,
  maxLength,
  error
}: Readonly<RichTextEditorProps>) => {
  const editor = useEditor({
    extensions: [StarterKit, Markdown, Placeholder.configure({ placeholder })],
    content: value,
    contentType: 'markdown',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          RICH_TEXT_CLASS,
          'min-h-40 max-h-[40dvh] overflow-y-auto px-3 py-2.5 text-[15px]'
        ),
        'aria-label': label ?? 'Rich text editor'
      }
    },
    onUpdate: ({ editor: e }) => onChange(e.getMarkdown())
  });

  // Sync external changes (form reset) into the editor.
  useEffect(() => {
    if (editor && editor.getMarkdown() !== value) {
      editor.commands.setContent(value, { contentType: 'markdown', emitUpdate: false });
    }
  }, [editor, value]);

  const groups = editor
    ? [
        [
          {
            title: 'Bold',
            icon: Bold,
            active: editor.isActive('bold'),
            run: () => editor.chain().focus().toggleBold().run()
          },
          {
            title: 'Italic',
            icon: Italic,
            active: editor.isActive('italic'),
            run: () => editor.chain().focus().toggleItalic().run()
          },
          {
            title: 'Strikethrough',
            icon: Strikethrough,
            active: editor.isActive('strike'),
            run: () => editor.chain().focus().toggleStrike().run()
          },
          {
            title: 'Inline code',
            icon: Code,
            active: editor.isActive('code'),
            run: () => editor.chain().focus().toggleCode().run()
          }
        ],
        [
          {
            title: 'Heading 1',
            icon: Heading1,
            active: editor.isActive('heading', { level: 1 }),
            run: () => editor.chain().focus().toggleHeading({ level: 1 }).run()
          },
          {
            title: 'Heading 2',
            icon: Heading2,
            active: editor.isActive('heading', { level: 2 }),
            run: () => editor.chain().focus().toggleHeading({ level: 2 }).run()
          },
          {
            title: 'Heading 3',
            icon: Heading3,
            active: editor.isActive('heading', { level: 3 }),
            run: () => editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        ],
        [
          {
            title: 'Bullet list',
            icon: List,
            active: editor.isActive('bulletList'),
            run: () => editor.chain().focus().toggleBulletList().run()
          },
          {
            title: 'Numbered list',
            icon: ListOrdered,
            active: editor.isActive('orderedList'),
            run: () => editor.chain().focus().toggleOrderedList().run()
          },
          {
            title: 'Quote',
            icon: Quote,
            active: editor.isActive('blockquote'),
            run: () => editor.chain().focus().toggleBlockquote().run()
          },
          {
            title: 'Code block',
            icon: SquareCode,
            active: editor.isActive('codeBlock'),
            run: () => editor.chain().focus().toggleCodeBlock().run()
          },
          {
            title: 'Divider',
            icon: Minus,
            active: false,
            run: () => editor.chain().focus().setHorizontalRule().run()
          }
        ],
        [
          {
            title: 'Undo',
            icon: Undo2,
            active: false,
            disabled: !editor.can().undo(),
            run: () => editor.chain().focus().undo().run()
          },
          {
            title: 'Redo',
            icon: Redo2,
            active: false,
            disabled: !editor.can().redo(),
            run: () => editor.chain().focus().redo().run()
          }
        ]
      ]
    : [];

  return (
    <div className="flex w-full flex-col">
      {label && <span className="mb-1.5 text-sm font-medium text-base-200">{label}</span>}
      <div
        className={cn(
          'overflow-hidden rounded-lg border bg-base-900/60 transition-colors focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/30',
          error ? 'border-red-400/60' : 'border-white/10'
        )}
      >
        <div
          role="toolbar"
          aria-label="Formatting"
          className="flex flex-wrap items-center gap-x-1 gap-y-1 border-b border-white/10 bg-base-800/60 p-1"
        >
          {groups.map((group, index) => (
            <div
              key={group[0].title}
              className={cn(
                'flex shrink-0 items-center gap-x-0.5',
                index > 0 && 'border-l border-white/10 pl-1'
              )}
            >
              {group.map(({ title, icon: Icon, active, run, ...rest }) => (
                <button
                  key={title}
                  type="button"
                  title={title}
                  aria-label={title}
                  aria-pressed={active}
                  disabled={'disabled' in rest ? rest.disabled : false}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={run}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-md text-base-300 transition-colors outline-none hover:bg-white/10 hover:text-base-100 focus-visible:ring-2 focus-visible:ring-indigo-400/70 disabled:pointer-events-none disabled:opacity-35',
                    active && 'bg-indigo-500/25 text-indigo-200 hover:bg-indigo-500/30'
                  )}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          ))}
        </div>
        <EditorContent editor={editor} />
      </div>
      <div className="flex justify-between gap-x-2">
        <span className="min-h-5 text-xs leading-5 text-red-400">{error ?? ''}</span>
        {maxLength !== undefined && (
          <span
            className={cn(
              'mt-0.5 shrink-0 text-xs',
              value.length > maxLength ? 'text-red-400' : 'text-base-400'
            )}
          >
            {value.length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export { RichTextEditor };
