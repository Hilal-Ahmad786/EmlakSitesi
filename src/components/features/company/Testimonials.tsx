'use client';

import { useTranslations } from 'next-intl';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Sarah Johnson',
        location: 'London, UK',
        text: 'Maison d\'Orient made buying our dream home in Istanbul incredibly easy. Their team was professional, knowledgeable, and supported us every step of the way.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop'
    },
    {
        name: 'Michael Chen',
        location: 'Singapore',
        text: 'I was impressed by their deep understanding of the market and their ability to find properties that perfectly matched my investment criteria. Highly recommended.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop'
    },
    {
        name: 'Elena Petrova',
        location: 'Moscow, Russia',
        text: 'The level of service provided by Maison d\'Orient is unmatched. They handled all the legal aspects seamlessly, making the process stress-free.',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2576&auto=format&fit=crop'
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
