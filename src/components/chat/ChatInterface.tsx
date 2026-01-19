import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, X, MessageSquare, Plus, Trash2, History } from 'lucide-react';
import { useConversations, useMessages, useCreateConversation, useDeleteConversation, useSendMessage, ChatMessage } from '@/hooks/useChat';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useLanguage();

  const { data: conversations = [] } = useConversations();
  const { data: messages = [] } = useMessages(activeConversation);
  const createConversation = useCreateConversation();
  const deleteConversation = useDeleteConversation();
  const { sendMessage, isStreaming } = useSendMessage();

  // Load messages when conversation changes
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, streamingContent]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Auto-select most recent conversation on open
  useEffect(() => {
    if (isOpen && conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0].id);
    }
  }, [isOpen, conversations, activeConversation]);

  const handleCreateConversation = async () => {
    const conv = await createConversation.mutateAsync(t('chat.newConversation'));
    setActiveConversation(conv.id);
    setLocalMessages([]);
    setStreamingContent('');
    setShowHistory(false);
  };

  const handleDeleteConversation = async (id: string) => {
    await deleteConversation.mutateAsync(id);
    if (activeConversation === id) {
      setActiveConversation(null);
      setLocalMessages([]);
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    setShowHistory(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    let convId = activeConversation;

    if (!convId) {
      const conv = await createConversation.mutateAsync(input.trim().slice(0, 30) + '...');
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
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
              <p className="text-xs text-muted-foreground">
                {activeConversation ? conversations.find(c => c.id === activeConversation)?.title : t('chat.newConversation')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                showHistory ? "bg-primary/20 text-primary" : "hover:bg-muted"
              )}
              title={t('chat.history')}
            >
              <History className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Chat History Sidebar */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-r border-border bg-muted/20 overflow-hidden"
              >
                <div className="p-3 h-full flex flex-col">
                  <button
                    onClick={handleCreateConversation}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors mb-3"
                  >
                    <Plus className="w-4 h-4" />
                    {t('chat.newConversation')}
                  </button>
                  
                  <ScrollArea className="flex-1">
                    <div className="space-y-1">
                      {conversations.map((conv) => (
                        <div key={conv.id} className="relative group">
                          <button
                            onClick={() => handleSelectConversation(conv.id)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg transition-colors text-sm",
                              activeConversation === conv.id
                                ? "bg-primary/20 text-primary"
                                : "hover:bg-muted text-foreground"
                            )}
                          >
                            <p className="font-medium truncate">{conv.title}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(conv.updated_at)}</p>
                          </button>
                          <button
                            onClick={() => handleDeleteConversation(conv.id)}
                            className="absolute top-2 right-2 p-1 rounded bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
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
                  placeholder={t('chat.placeholder')}
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
