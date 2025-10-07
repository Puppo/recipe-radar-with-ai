import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { tv } from 'tailwind-variants';
import type { ChatMessage as ChatMessageType } from '../Chat';

const chatMessage = tv({
  slots: {
    wrapper: 'flex',
    bubble: 'max-w-[80%] rounded-lg px-4 py-2 break-words',
    text: 'text-sm',
    time: 'mt-1 text-xs opacity-70'
  },
  variants: {
    messageType: {
      user: {
        wrapper: 'justify-end',
        bubble: 'bg-blue-600 text-white'
      },
      assistant: {
        wrapper: 'justify-start',
        bubble: 'bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
      }
    }
  }
});

interface ChatMessageProps {
  readonly message: ChatMessageType;
}

// Convert Markdown to sanitized HTML
const convertMarkdownToHtml = (markdown: string): string => {
  const rawHtml = marked.parse(markdown, { async: false }) as string;
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export function ChatMessage({ message }: ChatMessageProps) {
  const { wrapper, bubble, text, time } = chatMessage({ messageType: message.type });

  if (!message.text) return null;

  return (
    <div className={wrapper()}>
      <div className={bubble()}>
        <div 
          className={`${text()} chat-message-content`}
          dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(message.text) }}
        />
        <p className={time()}>{formatTime(message.timestamp)}</p>
      </div>
    </div>
  );
}
