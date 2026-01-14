'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Phone, Mail, User, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { captureLeadFromForm } from '@/lib/crm';

interface AgentContactProps {
    propertyId?: string;
    propertyTitle?: string;
    agentName?: string;
    agentTitle?: string;
    agentImage?: string;
    agentPhone?: string;
    agentEmail?: string;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
}

export function AgentContact({
    propertyId,
    propertyTitle,
    agentName = 'Burak Yılmaz',
    agentTitle = 'Senior Real Estate Agent',
    agentImage = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop',
    agentPhone = '+90 532 461 05 74',
    agentEmail = 'info@maison-dorient.com',
}: AgentContactProps) {
    const t = useTranslations('PropertyDetail.agent');
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = t('errors.nameRequired');
        }

        if (!formData.email.trim()) {
            newErrors.email = t('errors.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('errors.emailInvalid');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof FormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            // Split name into first and last name
            const nameParts = formData.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            await captureLeadFromForm({
                email: formData.email,
                firstName,
                lastName,
                phone: formData.phone || undefined,
                message: propertyTitle
                    ? `Property Inquiry: ${propertyTitle}\n\n${formData.message}`
                    : formData.message,
                propertyId,
                source: 'property_inquiry',
            });

            setSubmitStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePhoneClick = () => {
        window.location.href = `tel:${agentPhone.replace(/\s/g, '')}`;
    };

    const handleEmailClick = () => {
        const subject = propertyTitle
            ? encodeURIComponent(`Inquiry about: ${propertyTitle}`)
            : encodeURIComponent('Property Inquiry');
        window.location.href = `mailto:${agentEmail}?subject=${subject}`;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border sticky top-24">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                    <img
                        src={agentImage}
                        alt={agentName}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h3 className="font-serif text-lg font-bold text-primary">{agentName}</h3>
                    <p className="text-sm text-text-secondary">{agentTitle}</p>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                <Button variant="outline" className="w-full gap-2" onClick={handlePhoneClick}>
                    <Phone size={16} />
                    {agentPhone}
                </Button>
                <Button variant="outline" className="w-full gap-2" onClick={handleEmailClick}>
                    <Mail size={16} />
                    Email Agent
                </Button>
            </div>

            <div className="border-t border-border pt-6">
                <h4 className="font-medium mb-4">{t('title')}</h4>

                {/* Success Message */}
                {submitStatus === 'success' && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                        <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                        <p className="text-sm text-green-700">{t('success')}</p>
                    </div>
                )}

                {/* Error Message */}
                {submitStatus === 'error' && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                        <p className="text-sm text-red-700">{t('error')}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            placeholder={t('name')}
                            icon={<User size={16} />}
                            value={formData.name}
                            onChange={handleInputChange('name')}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                        )}
                    </div>
                    <div>
                        <Input
                            placeholder={t('email')}
                            icon={<Mail size={16} />}
                            value={formData.email}
                            onChange={handleInputChange('email')}
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                        )}
                    </div>
                    <Input
                        placeholder={t('phone')}
                        icon={<Phone size={16} />}
                        value={formData.phone}
                        onChange={handleInputChange('phone')}
                    />
                    <textarea
                        className="w-full min-h-[100px] rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        placeholder={t('message')}
                        value={formData.message}
                        onChange={handleInputChange('message')}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('sending')}
                            </>
                        ) : (
                            t('send')
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
