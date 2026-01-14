'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FormData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    subject: string;
    message: string;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    message?: string;
}

export default function ContactPage() {
    const t = useTranslations('Contact');
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = t('form.errors.firstNameRequired');
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = t('form.errors.lastNameRequired');
        }

        if (!formData.email.trim()) {
            newErrors.email = t('form.errors.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('form.errors.emailInvalid');
        }

        if (!formData.message.trim()) {
            newErrors.message = t('form.errors.messageRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof FormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        // Clear error when user starts typing
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
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone || undefined,
                    subject: formData.subject,
                    message: formData.message,
                    source: 'contact_form',
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            setSubmitStatus('success');
            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                subject: '',
                message: '',
            });
        } catch {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                            Meşrutiyet Caddesi No: 79A<br />
                                            Beyoğlu / İSTANBUL
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-background-alt rounded-full text-accent-gold">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-primary mb-1">{t('info.phone')}</h4>
                                        <p className="text-text-secondary">
                                            +90 532 461 05 74<br />
                                            +90 212 245 15 16
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-background-alt rounded-full text-accent-gold">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-primary mb-1">{t('info.email')}</h4>
                                        <p className="text-text-secondary">info@maison-dorient.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-background-alt rounded-full text-accent-gold">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-primary mb-1">{t('info.hours')}</h4>
                                        <p className="text-text-secondary">
                                            Contact us for an appointment
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

                        {/* Success Message */}
                        {submitStatus === 'success' && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <p className="font-medium text-green-800">{t('form.success.title')}</p>
                                    <p className="text-sm text-green-700">{t('form.success.message')}</p>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {submitStatus === 'error' && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <p className="font-medium text-red-800">{t('form.error.title')}</p>
                                    <p className="text-sm text-red-700">{t('form.error.message')}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Input
                                        label={t('form.firstName')}
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={handleInputChange('firstName')}
                                        className={errors.firstName ? 'border-red-500' : ''}
                                    />
                                    {errors.firstName && (
                                        <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        label={t('form.lastName')}
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleInputChange('lastName')}
                                        className={errors.lastName ? 'border-red-500' : ''}
                                    />
                                    {errors.lastName && (
                                        <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Input
                                        label={t('form.email')}
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange('email')}
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                                    )}
                                </div>
                                <Input
                                    label={t('form.phone')}
                                    placeholder="+90 555 123 45 67"
                                    value={formData.phone}
                                    onChange={handleInputChange('phone')}
                                />
                            </div>
                            <Input
                                label={t('form.subject')}
                                placeholder="Property Inquiry"
                                value={formData.subject}
                                onChange={handleInputChange('subject')}
                            />

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    {t('form.message')}
                                </label>
                                <textarea
                                    className={`w-full min-h-[150px] rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                                        errors.message ? 'border-red-500' : 'border-border'
                                    }`}
                                    placeholder="How can we help you?"
                                    value={formData.message}
                                    onChange={handleInputChange('message')}
                                />
                                {errors.message && (
                                    <p className="text-sm text-red-600 mt-1">{errors.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t('form.sending')}
                                    </>
                                ) : (
                                    t('form.send')
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
