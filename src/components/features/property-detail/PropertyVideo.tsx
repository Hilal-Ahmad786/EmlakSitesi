'use client';

import { useTranslations } from 'next-intl';
import { Play } from 'lucide-react';

interface PropertyVideoProps {
    videoUrl?: string;
    coverImage: string;
}

export function PropertyVideo({ videoUrl, coverImage }: PropertyVideoProps) {
    const t = useTranslations('PropertyDetail.video');

    if (!videoUrl) return null;

    return (
        <div className="mt-12">
            <h2 className="font-serif text-2xl text-primary mb-6">{t('title')}</h2>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black group cursor-pointer">
                {/* In a real implementation, this would be an iframe or video tag */}
                {/* For now, we'll simulate a video player with a cover image and play button */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-60 transition-opacity"
                    style={{ backgroundImage: `url(${coverImage})` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center pl-1 text-primary shadow-lg">
                            <Play size={24} fill="currentColor" />
                        </div>
                    </div>
                </div>

                {/* Embed Placeholder (Hidden for now, would be toggled on click) */}
                <iframe
                    className="hidden absolute inset-0 w-full h-full"
                    src={videoUrl}
                    title="Property Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
