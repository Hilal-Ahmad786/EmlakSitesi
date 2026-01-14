'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  phoneNumber: string;
  defaultMessage?: string;
  position?: 'bottom-right' | 'bottom-left';
  showWidget?: boolean;
  agentName?: string;
  agentTitle?: string;
  agentAvatar?: string;
  className?: string;
}

// WhatsApp floating button
export function WhatsAppButton({
  phoneNumber,
  defaultMessage = "Hello! I'm interested in your properties.",
  position = 'bottom-right',
  showWidget = true,
  agentName = 'Property Advisor',
  agentTitle = 'Online',
  agentAvatar,
  className,
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(defaultMessage);

  // Format phone number (remove all non-digits)
  const formattedPhone = phoneNumber.replace(/\D/g, '');

  const handleSend = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const handleDirectClick = () => {
    if (!showWidget) {
      const encodedMessage = encodeURIComponent(defaultMessage);
      window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, '_blank');
    } else {
      setIsOpen(!isOpen);
    }
  };

  const positionClasses = {
    'bottom-right': 'right-6 bottom-6',
    'bottom-left': 'left-6 bottom-6',
  };

  return (
    <div className={cn('fixed z-50', positionClasses[position], className)}>
      {/* Chat Widget */}
      {showWidget && isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up mb-4">
          {/* Header */}
          <div className="bg-green-500 p-4 text-white">
            <div className="flex items-center gap-3">
              {agentAvatar ? (
                <img
                  src={agentAvatar}
                  alt={agentName}
                  className="w-12 h-12 rounded-full border-2 border-white/20"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Phone size={24} />
                </div>
              )}
              <div>
                <p className="font-semibold">{agentName}</p>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  {agentTitle}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-auto p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-gray-50">
            {/* Welcome Message */}
            <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
              <p className="text-sm text-gray-600">
                Hi there!
                How can I help you today? Feel free to send us a message about any property inquiries.
              </p>
            </div>

            {/* Message Input */}
            <div className="bg-white rounded-lg border border-gray-200">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-3 text-sm resize-none focus:outline-none rounded-lg"
                rows={3}
              />
              <div className="flex justify-end p-2 border-t border-gray-100">
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                  Send
                </button>
              </div>
            </div>

            {/* WhatsApp Branding */}
            <p className="text-xs text-gray-400 text-center mt-3">
              Powered by WhatsApp Business
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleDirectClick}
        className={cn(
          'w-14 h-14 rounded-full bg-green-500 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl',
          isOpen && 'rotate-90'
        )}
        aria-label="Chat on WhatsApp"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Pulse animation */}
      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25" />
      )}
    </div>
  );
}

// Simple WhatsApp link component
interface WhatsAppLinkProps {
  phoneNumber: string;
  message?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function WhatsAppLink({
  phoneNumber,
  message = '',
  children,
  className,
  onClick,
}: WhatsAppLinkProps) {
  const formattedPhone = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ''}`;

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

// WhatsApp share button for properties
interface WhatsAppShareProps {
  propertyTitle: string;
  propertyUrl: string;
  phoneNumber?: string;
  variant?: 'icon' | 'button' | 'text';
  className?: string;
  onShare?: () => void;
}

export function WhatsAppShare({
  propertyTitle,
  propertyUrl,
  phoneNumber,
  variant = 'button',
  className,
  onShare,
}: WhatsAppShareProps) {
  const message = `Check out this property: ${propertyTitle}\n${propertyUrl}`;
  const encodedMessage = encodeURIComponent(message);

  // If phone number provided, share directly to that number
  // Otherwise, open WhatsApp share dialog
  const url = phoneNumber
    ? `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;

  const handleClick = () => {
    if (onShare) {
      onShare();
    }
    window.open(url, '_blank');
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors',
          className
        )}
        aria-label="Share on WhatsApp"
      >
        <MessageCircle size={18} />
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleClick}
        className={cn('text-green-600 hover:text-green-700 transition-colors', className)}
      >
        Share on WhatsApp
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors',
        className
      )}
    >
      <MessageCircle size={18} />
      <span>WhatsApp</span>
    </button>
  );
}

// Quick message templates
export const whatsappTemplates = {
  propertyInquiry: (propertyTitle: string, propertyId: string) =>
    `Hi, I'm interested in the property: ${propertyTitle} (ID: ${propertyId}). Could you provide more information?`,

  scheduleViewing: (propertyTitle: string) =>
    `Hello! I would like to schedule a viewing for: ${propertyTitle}. What times are available?`,

  priceInquiry: (propertyTitle: string) =>
    `Hi, I'm inquiring about the price and payment options for: ${propertyTitle}. Can you help?`,

  documentRequest: (propertyTitle: string) =>
    `Hello, I would like to request documents (floor plan, title deed) for: ${propertyTitle}. Thank you!`,

  generalInquiry: () =>
    `Hello! I'm looking for a property in Istanbul. Can you help me find the right one?`,

  investmentInquiry: () =>
    `Hi, I'm interested in investment properties in Turkey. Could you share some options?`,
};

export default WhatsAppButton;
