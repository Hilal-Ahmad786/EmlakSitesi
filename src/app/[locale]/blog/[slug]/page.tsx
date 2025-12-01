'use client';

import { useTranslations } from 'next-intl';
import { Calendar, User, Tag } from 'lucide-react';

// Mock Data
const post = {
    title: 'Istanbul Real Estate Market Outlook 2024',
    date: 'Dec 1, 2023',
    author: 'Burak Yılmaz',
    category: 'Market Analysis',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2660&auto=format&fit=crop',
    content: `
    The Istanbul real estate market continues to show resilience and growth potential as we head into 2024. With its unique position bridging Europe and Asia, the city remains a top destination for international investors.

    ### Key Trends to Watch

    1. **Rise of Branded Residences:** Luxury branded residences are seeing increased demand, particularly in areas like Nişantaşı and the Bosphorus line. These properties offer not just a home, but a lifestyle with hotel-like amenities.

    2. **Urban Regeneration:** The government's focus on urban transformation projects in older districts is creating new investment hotspots. Areas like Fikirtepe and parts of Beyoğlu are undergoing significant revitalization.

    3. **Sustainable Living:** There is a growing preference for eco-friendly developments that offer green spaces and energy-efficient features.

    ### Investment Hotspots

    - **Bosphorus Line:** Always the pinnacle of luxury, properties here retain value exceptionally well.
    - **Financial District (Ataşehir/Ümraniye):** With the Istanbul Finance Center nearing full operation, demand for residential and commercial units in these areas is surging.
    
    ### Conclusion

    For investors looking for long-term capital appreciation and solid rental yields, Istanbul remains a compelling choice. However, navigating the market requires local expertise to identify the right opportunities.
  `
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const t = useTranslations('Blog');

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero */}
            <div className="relative h-[50vh] min-h-[400px]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.image})` }}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="container mx-auto px-4 text-center text-white">
                        <div className="inline-block bg-accent-gold px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-4">
                            {post.category}
                        </div>
                        <h1 className="font-serif text-4xl md:text-6xl font-light mb-6 max-w-4xl mx-auto">
                            {post.title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-sm md:text-base text-gray-200">
                            <div className="flex items-center gap-2">
                                <Calendar size={18} />
                                <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User size={18} />
                                <span>{post.author}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
                    <div className="prose prose-lg max-w-none text-text-secondary">
                        {/* Simple markdown rendering for demo */}
                        {post.content.split('\n').map((paragraph, idx) => {
                            if (paragraph.trim().startsWith('###')) {
                                return <h3 key={idx} className="font-serif text-2xl text-primary mt-8 mb-4">{paragraph.replace('###', '').trim()}</h3>;
                            }
                            return <p key={idx} className="mb-4">{paragraph}</p>;
                        })}
                    </div>

                    <div className="border-t border-border mt-12 pt-8 flex items-center gap-4">
                        <span className="font-medium text-primary">Tags:</span>
                        <div className="flex gap-2">
                            {['Investment', 'Market Trends', 'Istanbul'].map((tag) => (
                                <span key={tag} className="bg-background-alt px-3 py-1 rounded-full text-sm text-text-secondary flex items-center gap-1">
                                    <Tag size={14} />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
