'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Share2, Copy, Check, Facebook, Twitter, Phone } from 'lucide-react';
import { usePathname } from '@/i18n/routing';

interface ShareButtonsProps {
    title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
    const t = useTranslations('PropertyDetail.share');
    const pathname = usePathname();
    const [copied, setCopied] = useState(false);

    // In a real app, we'd get the full URL. For now, we'll construct it.
    const getUrl = () => {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}${pathname}`;
        }
        return '';
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getUrl());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${getUrl()}`)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getUrl())}`
    };

    return (
        <div className="border-t border-border pt-8 mt-8">
            <h3 className="font-serif text-xl text-primary mb-4 flex items-center gap-2">
                <Share2 size={20} />
                {t('title')}
            </h3>
            <div className="flex flex-wrap gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="flex items-center gap-2"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? t('copied') : t('copy')}
                </Button>

                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 hover:bg-[#25D366] hover:text-white hover:border-[#25D366]">
                        <Phone size={16} className="rotate-90" /> {/* Using Phone as placeholder for WhatsApp if specific icon unavailable */}
                        {t('whatsapp')}
                    </Button>
                </a>

                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]">
                        <Facebook size={16} />
                        {t('facebook')}
                    </Button>
                </a>

                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]">
                        <Twitter size={16} />
                        {t('twitter')}
                    </Button>
                </a>
            </div>
        </div>
    );
}
