'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  User,
  Bot,
  Phone,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  agentName?: string;
  agentAvatar?: string;
  whatsappNumber?: string;
}

const quickReplies = [
  { id: 'viewing', text: 'Schedule a viewing' },
  { id: 'price', text: 'Ask about price' },
  { id: 'financing', text: 'Financing options' },
  { id: 'agent', text: 'Speak to an agent' },
];

export function ChatWidget({
  agentName = 'Maison Support',
  agentAvatar,
  whatsappNumber = '+905324610574',
}: ChatWidgetProps) {
  const t = useTranslations('Chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showPreChat, setShowPreChat] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (type: Message['type'], content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        type,
        content,
        timestamp: new Date(),
      },
    ]);
  };

  const simulateBotResponse = (userMessage: string) => {
    setIsTyping(true);

    setTimeout(() => {
      let response = t('defaultResponse');

      if (userMessage.toLowerCase().includes('price')) {
        response = t('priceResponse');
      } else if (userMessage.toLowerCase().includes('viewing') || userMessage.toLowerCase().includes('visit')) {
        response = t('viewingResponse');
      } else if (userMessage.toLowerCase().includes('agent') || userMessage.toLowerCase().includes('speak')) {
        response = t('agentResponse');
      } else if (userMessage.toLowerCase().includes('financing') || userMessage.toLowerCase().includes('mortgage')) {
        response = t('financingResponse');
      }

      addMessage('bot', response);
      setIsTyping(false);
    }, 1000);
  };

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo.name.trim() || !userInfo.email.trim()) return;

    setShowPreChat(false);
    addMessage('system', t('welcomeMessage', { name: userInfo.name }));
    addMessage('bot', t('initialMessage'));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const message = inputValue.trim();
    addMessage('user', message);
    setInputValue('');
    simulateBotResponse(message);
  };

  const handleQuickReply = (text: string) => {
    addMessage('user', text);
    simulateBotResponse(text);
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
      t('whatsappMessage')
    )}`;
    window.open(url, '_blank');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg transition-all duration-300',
          'bg-primary text-white hover:bg-primary-dark hover:scale-110',
          isOpen && 'scale-0 opacity-0'
        )}
      >
        <MessageCircle size={24} className="mx-auto" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          'fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none',
          isMinimized && 'h-16'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="flex items-center gap-3">
            {agentAvatar ? (
              <img
                src={agentAvatar}
                alt={agentName}
                className="w-10 h-10 rounded-full border-2 border-white/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={20} />
              </div>
            )}
            <div>
              <p className="font-semibold">{agentName}</p>
              <p className="text-xs text-white/70">{t('online')}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Minimize2 size={18} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Pre-Chat Form */}
            {showPreChat ? (
              <form onSubmit={handleStartChat} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('preChatTitle')}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {t('preChatSubtitle')}
                </p>

                <div className="space-y-4">
                  <Input
                    label={t('name')}
                    placeholder="John Doe"
                    value={userInfo.name}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, name: e.target.value })
                    }
                    required
                  />
                  <Input
                    label={t('email')}
                    type="email"
                    placeholder="john@example.com"
                    value={userInfo.email}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, email: e.target.value })
                    }
                    required
                  />

                  <Button type="submit" className="w-full">
                    {t('startChat')}
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-2 text-gray-500">
                        {t('or')}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-[#25D366] border-[#25D366] hover:bg-[#25D366] hover:text-white"
                    onClick={openWhatsApp}
                  >
                    <Phone size={18} className="mr-2 rotate-90" />
                    {t('chatOnWhatsApp')}
                  </Button>
                </div>
              </form>
            ) : (
              <>
                {/* Messages */}
                <div className="h-[300px] overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex',
                        message.type === 'user' ? 'justify-end' : 'justify-start',
                        message.type === 'system' && 'justify-center'
                      )}
                    >
                      {message.type === 'system' ? (
                        <p className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {message.content}
                        </p>
                      ) : (
                        <div
                          className={cn(
                            'max-w-[80%] rounded-2xl px-4 py-2',
                            message.type === 'user'
                              ? 'bg-primary text-white rounded-br-sm'
                              : 'bg-white text-gray-800 border border-border rounded-bl-sm shadow-sm'
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={cn(
                              'text-[10px] mt-1',
                              message.type === 'user'
                                ? 'text-white/60'
                                : 'text-gray-400'
                            )}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="bg-white rounded-2xl px-4 py-2 border border-border shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {messages.length === 2 && (
                  <div className="px-4 py-2 border-t border-border bg-white">
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply) => (
                        <button
                          key={reply.id}
                          onClick={() => handleQuickReply(reply.text)}
                          className="px-3 py-1.5 text-xs font-medium text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-colors"
                        >
                          {reply.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 p-4 border-t border-border bg-white"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t('typePlaceholder')}
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
