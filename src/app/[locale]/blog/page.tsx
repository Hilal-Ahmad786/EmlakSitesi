'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Calendar, ArrowRight } from 'lucide-react';

// Mock Data
const posts = [
    {
        id: '1',
        slug: 'istanbul-real-estate-market-outlook-2024',
        title: 'Istanbul Real Estate Market Outlook 2024',
        excerpt: 'An in-depth analysis of property trends, pricing, and investment opportunities in Istanbul for the upcoming year.',
        date: 'Dec 1, 2023',
        image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2660&auto=format&fit=crop',
        category: 'Market Analysis'
    },
    {
        id: '2',
        slug: 'guide-to-turkish-citizenship-by-investment',
        title: 'Complete Guide to Turkish Citizenship by Investment',
        excerpt: 'Everything you need to know about the Citizenship by Investment program, requirements, and application process.',
        date: 'Nov 15, 2023',
        image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2598&auto=format&fit=crop',
        category: 'Legal'
    },
    {
        id: '3',
        slug: 'best-neighborhoods-for-families-in-istanbul',
        title: 'Best Neighborhoods for Families in Istanbul',
        excerpt: 'Discover the most family-friendly districts featuring top schools, parks, and safe communities.',
        date: 'Oct 28, 2023',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2700&auto=format&fit=crop',
        category: 'Lifestyle'
    }
];

export default function BlogPage() {
    const t = useTranslations('Blog');

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-primary-dark text-white py-20 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">{t('title')}</h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group bg-white rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-all"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${post.image})` }}
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold text-primary uppercase tracking-wider">
                                    {post.category}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-2 text-text-secondary text-sm mb-3">
                                    <Calendar size={14} />
                                    <span>{t('published', { date: post.date })}</span>
                                </div>

                                <h3 className="font-serif text-xl text-primary mb-3 group-hover:text-accent-gold transition-colors">
                                    {post.title}
                                </h3>

                                <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                                    {t('readMore')}
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
