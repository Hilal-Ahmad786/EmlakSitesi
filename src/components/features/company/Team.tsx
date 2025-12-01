'use client';

import { useTranslations } from 'next-intl';
import { Mail, Phone, Linkedin } from 'lucide-react';

const teamMembers = [
    {
        name: 'Ahmet Yılmaz',
        role: 'Founder & CEO',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop',
        email: 'ahmet@maisondorient.com',
        phone: '+90 555 123 4567'
    },
    {
        name: 'Elif Demir',
        role: 'Senior Real Estate Agent',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop',
        email: 'elif@maisondorient.com',
        phone: '+90 555 987 6543'
    },
    {
        name: 'Mehmet Kaya',
        role: 'Investment Consultant',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop',
        email: 'mehmet@maisondorient.com',
        phone: '+90 555 234 5678'
    },
    {
        name: 'Ayşe Çelik',
        role: 'Legal Advisor',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2661&auto=format&fit=crop',
        email: 'ayse@maisondorient.com',
        phone: '+90 555 876 5432'
    }
];

export function Team() {
    const t = useTranslations('Company.team');

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">{t('title')}</h2>
                    <p className="text-text-secondary max-w-2xl mx-auto">{t('subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                            <div className="h-80 overflow-hidden relative">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${member.image})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                                    <div className="flex gap-4 text-white">
                                        <a href={`mailto:${member.email}`} className="hover:text-accent-gold transition-colors"><Mail size={20} /></a>
                                        <a href={`tel:${member.phone}`} className="hover:text-accent-gold transition-colors"><Phone size={20} /></a>
                                        <a href="#" className="hover:text-accent-gold transition-colors"><Linkedin size={20} /></a>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="font-serif text-xl text-primary mb-1">{member.name}</h3>
                                <p className="text-accent-gold text-sm font-medium uppercase tracking-wide">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
