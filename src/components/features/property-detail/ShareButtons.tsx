'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import {
  Share2,
  Copy,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  MessageCircle,
  X,
  QrCode,
  ExternalLink,
  Printer,
} from 'lucide-react';
import { usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface ShareButtonsProps {
  title: string;
  description?: string;
  image?: string;
  price?: string;
  compact?: boolean;
}

export function ShareButtons({
  title,
  description,
  image,
  price,
  compact = false,
}: ShareButtonsProps) {
  const t = useTranslations('PropertyDetail.share');
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const getUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${pathname}`;
    }
    return '';
  };

  const shareText = `${title}${price ? ` - ${price}` : ''}`;
  const fullShareText = description
    ? `${shareText}\n\n${description}`
    : shareText;

  // Generate QR code using a simple API
  useEffect(() => {
    if (showQR && typeof window !== 'undefined') {
      const url = getUrl();
      // Using QR Server API for simplicity
      setQrDataUrl(
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
      );
    }
  }, [showQR, pathname]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: fullShareText,
          url: getUrl(),
        });
      } catch (err) {
        // User cancelled or share failed
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      setShowModal(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${fullShareText}\n${getUrl()}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}&quote=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(getUrl())}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${fullShareText}\n\n${getUrl()}`)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(getUrl())}&media=${encodeURIComponent(image || '')}&description=${encodeURIComponent(shareText)}`,
  };

  const socialButtons = [
    {
      id: 'whatsapp',
      icon: MessageCircle,
      label: 'WhatsApp',
      href: shareLinks.whatsapp,
      color: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]',
    },
    {
      id: 'facebook',
      icon: Facebook,
      label: 'Facebook',
      href: shareLinks.facebook,
      color: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
    },
    {
      id: 'twitter',
      icon: Twitter,
      label: 'X',
      href: shareLinks.twitter,
      color: 'hover:bg-black hover:text-white hover:border-black',
    },
    {
      id: 'linkedin',
      icon: Linkedin,
      label: 'LinkedIn',
      href: shareLinks.linkedin,
      color: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]',
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      href: shareLinks.email,
      color: 'hover:bg-gray-700 hover:text-white hover:border-gray-700',
    },
  ];

  // Compact version (for floating buttons)
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleNativeShare}
          className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
          title={t('title')}
        >
          <Share2 size={20} />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="border-t border-border pt-8 mt-8">
        <h3 className="font-serif text-xl text-primary mb-4 flex items-center gap-2">
          <Share2 size={20} />
          {t('title')}
        </h3>

        <div className="flex flex-wrap gap-3">
          {/* Copy Link Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check size={16} className="text-green-500" />
                {t('copied')}
              </>
            ) : (
              <>
                <Copy size={16} />
                {t('copy')}
              </>
            )}
          </Button>

          {/* Social Share Buttons */}
          {socialButtons.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className={cn('flex items-center gap-2', social.color)}
                >
                  <Icon size={16} />
                  {social.label}
                </Button>
              </a>
            );
          })}

          {/* QR Code Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQR(true)}
            className="flex items-center gap-2"
          >
            <QrCode size={16} />
            {t('qrCode')}
          </Button>

          {/* Print Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer size={16} />
            {t('print')}
          </Button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{t('qrCode')}</h3>
              <button
                onClick={() => setShowQR(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-48 h-48 border border-border rounded-lg"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-lg animate-pulse" />
              )}

              <p className="text-sm text-gray-500 mt-4 text-center">
                {t('qrCodeDesc')}
              </p>

              <div className="flex gap-2 mt-4 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleCopy}
                >
                  <Copy size={14} className="mr-1" />
                  {t('copy')}
                </Button>
                {qrDataUrl && (
                  <a
                    href={qrDataUrl}
                    download={`qr-${title.replace(/\s+/g, '-')}.png`}
                    className="flex-1"
                  >
                    <Button variant="primary" size="sm" className="w-full">
                      <ExternalLink size={14} className="mr-1" />
                      {t('download')}
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal (fallback for browsers without native share) */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 text-lg">
                {t('shareProperty')}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Property Preview */}
            {image && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-32 object-cover"
                />
              </div>
            )}

            <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
            {price && (
              <p className="text-accent-gold font-semibold mb-4">{price}</p>
            )}

            {/* Share Options Grid */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {socialButtons.slice(0, 4).map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        social.id === 'whatsapp' && 'bg-[#25D366] text-white',
                        social.id === 'facebook' && 'bg-[#1877F2] text-white',
                        social.id === 'twitter' && 'bg-black text-white',
                        social.id === 'linkedin' && 'bg-[#0A66C2] text-white'
                      )}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="text-xs text-gray-600">{social.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Copy Link */}
            <div className="flex gap-2">
              <input
                type="text"
                value={getUrl()}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-gray-50 truncate"
              />
              <Button size="sm" onClick={handleCopy}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
