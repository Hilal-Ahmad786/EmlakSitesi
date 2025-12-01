'use client';

import { useTranslations } from 'next-intl';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: 'Sarah Johnson',
        location: 'London, UK',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop',
        text: 'Maison d\'Orient made our dream of owning a home in Istanbul a reality. Their team was incredibly professional and guided us through every step of the process.'
    },
    {
        id: 2,
        name: 'Michael Chen',
        location: 'Singapore',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop',
        text: 'The level of service provided by the team was exceptional. They understood exactly what I was looking for and found the perfect investment property for me.'
    },
    {
        id: 3,
        name: 'Elena Petrova',
        location: 'Moscow, Russia',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop',
        text: 'I was impressed by their deep knowledge of the Istanbul real estate market. They helped me find a beautiful apartment in a historic neighborhood.'
    }
];

export function Testimonials() {
    const t = useTranslations('Company.testimonials');

    return (
        <section className="py-20 bg-primary-dark text-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl mb-4">{t('title')}</h2>
                    <p className="text-gray-300 max-w-2xl mx-auto">{t('subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <div key={index} className="bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                            <Quote className="text-accent-gold mb-6 opacity-50" size={40} />
                            <p className="text-gray-300 mb-6 italic leading-relaxed">"{item.text}"</p>
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-full bg-cover bg-center"
                                    style={{ backgroundImage: `url(${item.image})` }}
                                />
                                <div>
                                    <h4 className="font-serif text-lg">{item.name}</h4>
                                    <p className="text-sm text-accent-gold">{item.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
