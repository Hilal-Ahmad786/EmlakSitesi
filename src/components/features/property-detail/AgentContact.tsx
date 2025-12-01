'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Phone, Mail, User } from 'lucide-react';

export function AgentContact() {
    const t = useTranslations('PropertyDetail.agent');

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border sticky top-24">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
                        alt="Agent"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h3 className="font-serif text-lg font-bold text-primary">Burak Yılmaz</h3>
                    <p className="text-sm text-text-secondary">Senior Real Estate Agent</p>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                <Button variant="outline" className="w-full gap-2">
                    <Phone size={16} />
                    +90 532 123 45 67
                </Button>
                <Button variant="outline" className="w-full gap-2">
                    <Mail size={16} />
                    Email Agent
                </Button>
            </div>

            <div className="border-t border-border pt-6">
                <h4 className="font-medium mb-4">{t('title')}</h4>
                <form className="space-y-4">
                    <Input placeholder={t('name')} icon={<User size={16} />} />
                    <Input placeholder={t('email')} icon={<Mail size={16} />} />
                    <Input placeholder={t('phone')} icon={<Phone size={16} />} />
                    <textarea
                        className="w-full min-h-[100px] rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        placeholder={t('message')}
                    />
                    <Button className="w-full">
                        {t('send')}
                    </Button>
                </form>
            </div>
        </div>
    );
}
