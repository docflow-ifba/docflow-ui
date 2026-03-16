import DOMPurify from 'dompurify';
import { marked } from 'marked';

marked.use({
  async: false,
  breaks: false,
  extensions: null,
  gfm: true,
  hooks: null,
  pedantic: false,
  silent: false,
  tokenizer: null,
  walkTokens: null,
});

export default function MarkdownRenderer({ markdown }: { markdown: string }) {
  const rawHtml = marked(markdown) as string;
  const sanitizedHtml = DOMPurify.sanitize(rawHtml);

  return <div className="prose" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
