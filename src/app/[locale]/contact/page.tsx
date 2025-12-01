'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
    const t = useTranslations('Contact');

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-primary-dark text-white py-20 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">{t('title')}</h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
                            <h3 className="font-serif text-2xl text-primary mb-6">Maison d&apos;Orient</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-background-alt rounded-full text-accent-gold">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-primary mb-1">{t('info.address')}</h4>
                                        <p className="text-text-secondary">
                                            Bebek, Cevdet Paşa Cd. No: 123<br />
                                            34342 Beşiktaş/İstanbul, Turkey
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-background-alt rounded-full text-accent-gold">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-primary mb-1">{t('info.phone')}</h4>
                                        <p className="text-text-secondary">+90 212 123 45 67</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-background-alt rounded-full text-accent-gold">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-primary mb-1">{t('info.email')}</h4>
                                        <p className="text-text-secondary">info@maisondorient.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-background-alt rounded-full text-accent-gold">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-primary mb-1">{t('info.hours')}</h4>
                                        <p className="text-text-secondary">
                                            Mon - Fri: 09:00 - 18:00<br />
                                            Sat: 10:00 - 15:00
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="h-[300px] bg-gray-200 rounded-lg overflow-hidden relative">
                            <div
                                className="absolute inset-0 bg-cover bg-center grayscale"
                                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2598&auto=format&fit=crop)' }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                <Button variant="secondary">View on Google Maps</Button>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
                        <h3 className="font-serif text-2xl text-primary mb-6">{t('form.send')}</h3>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label={t('form.name')} placeholder="John Doe" />
                                <Input label={t('form.phone')} placeholder="+90 555 123 45 67" />
                            </div>
                            <Input label={t('form.email')} type="email" placeholder="john@example.com" />
                            <Input label={t('form.subject')} placeholder="Property Inquiry" />

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    {t('form.message')}
                                </label>
                                <textarea
                                    className="w-full min-h-[150px] rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <Button size="lg" className="w-full">
                                {t('form.send')}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
