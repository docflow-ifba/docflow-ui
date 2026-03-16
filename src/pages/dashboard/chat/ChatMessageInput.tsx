import { Button } from '@/components/ui/button';
import { ChatInput } from '@/components/ui/chat/chat-input';
import MessageLoading from '@/components/ui/chat/message-loading';
import { CornerDownLeft } from 'lucide-react';

type ChatMessageInputProps = {
  formRef: React.RefObject<HTMLFormElement | null>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  setInput: (value: string) => void;
  isGenerating: boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  centered?: boolean;
};

const ChatMessageInput = ({
  formRef,
  onSubmit,
  input,
  setInput,
  isGenerating,
  onKeyDown,
  centered,
}: ChatMessageInputProps) => {
  return (
    <div
      className={`px-4 pb-4 ${
        centered ? 'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full' : ''
      }`}
    >
      {centered && <p className="text-center text-2xl font-semibold mb-3 text-gray-600">Como posso ajudar?</p>}
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
      >
        <ChatInput
          value={input}
          onKeyDown={onKeyDown}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte alguma coisa"
          className="rounded-lg bg-background border-0 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button type="submit" size="sm" className="ml-auto gap-1.5">
            {isGenerating ? (
              <MessageLoading />
            ) : (
              <>
                Enviar
                <CornerDownLeft className="size-3.5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatMessageInput;
