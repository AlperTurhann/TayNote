// Tailwind's preflight resets headings, lists, etc., so the rich text needs explicit styles.
const RICH_TEXT_CLASS = [
  'break-words outline-none',
  '[&_p]:my-1 [&_p:empty]:min-h-5',
  '[&_h1]:mt-3 [&_h1]:mb-1 [&_h1]:text-3xl [&_h1]:leading-tight [&_h1]:font-bold',
  '[&_h2]:mt-3 [&_h2]:mb-1 [&_h2]:text-2xl [&_h2]:leading-tight [&_h2]:font-bold',
  '[&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-xl [&_h3]:leading-tight [&_h3]:font-semibold',
  '[&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-6',
  '[&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-6',
  '[&_li>p]:my-0',
  '[&_blockquote]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-base-400 [&_blockquote]:pl-3 [&_blockquote]:text-base-300 [&_blockquote]:italic',
  '[&_code]:rounded [&_code]:bg-black/30 [&_code]:px-1 [&_code]:font-mono [&_code]:text-sm',
  '[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-black/30 [&_pre]:p-3',
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
  '[&_a]:text-sky-400 [&_a]:underline',
  '[&_hr]:my-3 [&_hr]:border-base-400',
  '[&_strong]:font-bold [&_em]:italic [&_s]:line-through',
  '[&_p.is-editor-empty:first-child]:before:pointer-events-none [&_p.is-editor-empty:first-child]:before:float-left [&_p.is-editor-empty:first-child]:before:h-0 [&_p.is-editor-empty:first-child]:before:text-base-400 [&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]'
].join(' ');

export { RICH_TEXT_CLASS };
