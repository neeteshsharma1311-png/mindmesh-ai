import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, X, MessageSquare, Plus, Trash2 } from 'lucide-react';
import { useConversations, useMessages, useCreateConversation, useDeleteConversation, useSendMessage, ChatMessage } from '@/hooks/useChat';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VoiceInput } from '@/components/VoiceInput';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatInterface = ({ isOpen, onClose }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState('');
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: conversations = [] } = useConversations();
  const { data: messages = [] } = useMessages(activeConversation);
  const createConversation = useCreateConversation();
  const deleteConversation = useDeleteConversation();
  const { sendMessage, isStreaming } = useSendMessage();

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, streamingContent]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleCreateConversation = async () => {
    const conv = await createConversation.mutateAsync('New Conversation');
    setActiveConversation(conv.id);
    setLocalMessages([]);
    setStreamingContent('');
  };

  const handleDeleteConversation = async (id: string) => {
    await deleteConversation.mutateAsync(id);
    if (activeConversation === id) {
      setActiveConversation(null);
      setLocalMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    let convId = activeConversation;

    if (!convId) {
      const conv = await createConversation.mutateAsync('New Conversation');
      convId = conv.id;
      setActiveConversation(convId);
    }

    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: convId,
      user_id: '',
      role: 'user',
      content: input.trim(),
      created_at: new Date().toISOString(),
    };

    setLocalMessages(prev => [...prev, userMessage]);
    setInput('');
    setStreamingContent('');

    await sendMessage(
      convId,
      input.trim(),
      localMessages,
      (delta) => setStreamingContent(prev => prev + delta),
      (fullContent) => {
        setLocalMessages(prev => [
          ...prev,
          {
            id: `temp-assistant-${Date.now()}`,
            conversation_id: convId!,
            user_id: '',
            role: 'assistant',
            content: fullContent,
            created_at: new Date().toISOString(),
          }
        ]);
        setStreamingContent('');
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-24 right-6 w-[420px] h-[600px] glass-card rounded-2xl shadow-2xl border border-primary/20 flex flex-col z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">MindMesh AI</h3>
              <p className="text-xs text-muted-foreground">Your cognitive assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Conversations Sidebar */}
          <div className="w-16 border-r border-border bg-muted/20 p-2 flex flex-col gap-2">
            <button
              onClick={handleCreateConversation}
              className="w-full aspect-square rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              title="New conversation"
            >
              <Plus className="w-5 h-5 text-primary" />
            </button>
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {conversations.slice(0, 10).map((conv) => (
                  <div key={conv.id} className="relative group">
                    <button
                      onClick={() => setActiveConversation(conv.id)}
                      className={cn(
                        "w-full aspect-square rounded-lg flex items-center justify-center transition-colors",
                        activeConversation === conv.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/30 hover:bg-muted/50 text-muted-foreground"
                      )}
                      title={conv.title}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteConversation(conv.id)}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {localMessages.length === 0 && !streamingContent && (
                  <div className="text-center py-8">
                    <Bot className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground text-sm">
                      Hi! I'm your cognitive assistant. Ask me anything about productivity, goals, or wellness.
                    </p>
                  </div>
                )}
                
                {localMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] px-4 py-2 rounded-2xl text-sm",
                        message.role === 'user'
                          ? "bg-primary text-primary-foreground rounded-tr-md"
                          : "bg-muted rounded-tl-md"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Streaming Response */}
                {streamingContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="max-w-[75%] px-4 py-2 rounded-2xl rounded-tl-md bg-muted text-sm">
                      <p className="whitespace-pre-wrap">{streamingContent}</p>
                      <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-0.5" />
                    </div>
                  </motion.div>
                )}

                {isStreaming && !streamingContent && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-muted">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  rows={1}
                  className="flex-1 px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
                  disabled={isStreaming}
                />
                <VoiceInput 
                  onTranscript={(text) => {
                    setInput(prev => prev + (prev ? ' ' : '') + text);
                  }}
                  isProcessing={isStreaming}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isStreaming}
                  className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isStreaming ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
