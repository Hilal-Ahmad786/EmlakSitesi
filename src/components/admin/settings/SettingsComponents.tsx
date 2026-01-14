'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Settings,
    Globe,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    BarChart3,
    Save,
    Check,
    AlertCircle,
    Building2,
    Clock,
    Languages,
    Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface GeneralSettingsData {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    logo: string;
    favicon: string;
    timezone: string;
    dateFormat: string;
    currency: string;
    defaultLanguage: string;
    maintenanceMode: boolean;
}

interface ContactSettingsData {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    googleMapsUrl: string;
    officeHours: string;
}

interface SocialSettingsData {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    pinterest: string;
    tiktok: string;
}

interface AnalyticsSettingsData {
    googleAnalyticsId: string;
    googleTagManagerId: string;
    facebookPixelId: string;
    hotjarId: string;
    enableTracking: boolean;
    cookieConsent: boolean;
}

interface SettingsFormProps<T> {
    defaultValues: T;
    onSubmit: (data: T) => void;
    loading?: boolean;
}

// Success Toast
function SuccessToast({ message }: { message: string }) {
    return (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom">
            <Check size={20} />
            <span>{message}</span>
        </div>
    );
}

// General Settings Component
export function GeneralSettings({
    defaultValues,
    onSubmit,
    loading,
}: SettingsFormProps<GeneralSettingsData>) {
    const [saved, setSaved] = useState(false);
    const { register, handleSubmit } = useForm<GeneralSettingsData>({
        defaultValues,
    });

    const handleFormSubmit = (data: GeneralSettingsData) => {
        onSubmit(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
                    <p className="text-sm text-gray-500">
                        Manage your website's basic configuration
                    </p>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                    <Save size={18} className="mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Site Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Globe className="h-5 w-5 text-gray-400" />
                        <h3 className="font-medium text-gray-900">Site Information</h3>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Site Name
                        </label>
                        <input
                            {...register('siteName')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Site Description
                        </label>
                        <textarea
                            {...register('siteDescription')}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Site URL
                        </label>
                        <input
                            {...register('siteUrl')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Branding */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Palette className="h-5 w-5 text-gray-400" />
                        <h3 className="font-medium text-gray-900">Branding</h3>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Logo URL
                        </label>
                        <input
                            {...register('logo')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Favicon URL
                        </label>
                        <input
                            {...register('favicon')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                {/* Localization */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Languages className="h-5 w-5 text-gray-400" />
                        <h3 className="font-medium text-gray-900">Localization</h3>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Default Language
                        </label>
                        <select
                            {...register('defaultLanguage')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="en">English</option>
                            <option value="tr">Turkish</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Timezone
                        </label>
                        <select
                            {...register('timezone')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="Europe/Istanbul">Europe/Istanbul (GMT+3)</option>
                            <option value="Europe/London">Europe/London (GMT+0)</option>
                            <option value="America/New_York">America/New York (GMT-5)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Currency
                        </label>
                        <select
                            {...register('currency')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="EUR">Euro (€)</option>
                            <option value="USD">US Dollar ($)</option>
                            <option value="TRY">Turkish Lira (₺)</option>
                            <option value="GBP">British Pound (£)</option>
                        </select>
                    </div>
                </div>

                {/* Maintenance */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Settings className="h-5 w-5 text-gray-400" />
                        <h3 className="font-medium text-gray-900">Maintenance</h3>
                    </div>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Maintenance Mode</p>
                            <p className="text-sm text-gray-500">
                                Enable to show maintenance page to visitors
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            {...register('maintenanceMode')}
                            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                    </label>
                </div>
            </div>

            {saved && <SuccessToast message="Settings saved successfully!" />}
        </form>
    );
}

// Contact Settings Component
export function ContactSettings({
    defaultValues,
    onSubmit,
    loading,
}: SettingsFormProps<ContactSettingsData>) {
    const [saved, setSaved] = useState(false);
    const { register, handleSubmit } = useForm<ContactSettingsData>({
        defaultValues,
    });

    const handleFormSubmit = (data: ContactSettingsData) => {
        onSubmit(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">Contact Settings</h2>
                    <p className="text-sm text-gray-500">
                        Manage your business contact information
                    </p>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                    <Save size={18} className="mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <h3 className="font-medium text-gray-900">Contact Information</h3>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            {...register('email')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            {...register('phone')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            WhatsApp Number
                        </label>
                        <input
                            {...register('whatsapp')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Office Hours
                        </label>
                        <input
                            {...register('officeHours')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Mon-Fri: 9:00 AM - 6:00 PM"
                        />
                    </div>
                </div>

                {/* Address */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <h3 className="font-medium text-gray-900">Office Address</h3>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address
                        </label>
                        <input
                            {...register('address')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City
                            </label>
                            <input
                                {...register('city')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Postal Code
                            </label>
                            <input
                                {...register('postalCode')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                        </label>
                        <input
                            {...register('country')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Google Maps Embed URL
                        </label>
                        <input
                            {...register('googleMapsUrl')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="https://www.google.com/maps/embed?..."
                        />
                    </div>
                </div>
            </div>

            {saved && <SuccessToast message="Contact settings saved!" />}
        </form>
    );
}

// Social Media Settings Component
export function SocialSettings({
    defaultValues,
    onSubmit,
    loading,
}: SettingsFormProps<SocialSettingsData>) {
    const [saved, setSaved] = useState(false);
    const { register, handleSubmit } = useForm<SocialSettingsData>({
        defaultValues,
    });

    const handleFormSubmit = (data: SocialSettingsData) => {
        onSubmit(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const socialLinks = [
        { name: 'facebook', icon: Facebook, label: 'Facebook', placeholder: 'https://facebook.com/...' },
        { name: 'twitter', icon: Twitter, label: 'Twitter / X', placeholder: 'https://twitter.com/...' },
        { name: 'instagram', icon: Instagram, label: 'Instagram', placeholder: 'https://instagram.com/...' },
        { name: 'linkedin', icon: Linkedin, label: 'LinkedIn', placeholder: 'https://linkedin.com/company/...' },
        { name: 'youtube', icon: Youtube, label: 'YouTube', placeholder: 'https://youtube.com/...' },
    ];

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">Social Media</h2>
                    <p className="text-sm text-gray-500">
                        Connect your social media accounts
                    </p>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                    <Save size={18} className="mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="space-y-4">
                    {socialLinks.map((social) => (
                        <div key={social.name} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                <social.icon size={20} />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {social.label}
                                </label>
                                <input
                                    {...register(social.name as keyof SocialSettingsData)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder={social.placeholder}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {saved && <SuccessToast message="Social media settings saved!" />}
        </form>
    );
}

// Analytics Settings Component
export function AnalyticsSettings({
    defaultValues,
    onSubmit,
    loading,
}: SettingsFormProps<AnalyticsSettingsData>) {
    const [saved, setSaved] = useState(false);
    const { register, handleSubmit, watch } = useForm<AnalyticsSettingsData>({
        defaultValues,
    });

    const enableTracking = watch('enableTracking');

    const handleFormSubmit = (data: AnalyticsSettingsData) => {
        onSubmit(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">Analytics & Tracking</h2>
                    <p className="text-sm text-gray-500">
                        Configure analytics and tracking integrations
                    </p>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                    <Save size={18} className="mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tracking Toggle */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
                    <label className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="font-medium text-gray-900">Enable Analytics Tracking</p>
                                <p className="text-sm text-gray-500">
                                    Track visitor behavior and website performance
                                </p>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            {...register('enableTracking')}
                            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                    </label>
                </div>

                {/* Google Analytics */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                    <h3 className="font-medium text-gray-900">Google Analytics</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Measurement ID
                        </label>
                        <input
                            {...register('googleAnalyticsId')}
                            disabled={!enableTracking}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="G-XXXXXXXXXX"
                        />
                    </div>
                </div>

                {/* Google Tag Manager */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                    <h3 className="font-medium text-gray-900">Google Tag Manager</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Container ID
                        </label>
                        <input
                            {...register('googleTagManagerId')}
                            disabled={!enableTracking}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="GTM-XXXXXXX"
                        />
                    </div>
                </div>

                {/* Facebook Pixel */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                    <h3 className="font-medium text-gray-900">Facebook Pixel</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pixel ID
                        </label>
                        <input
                            {...register('facebookPixelId')}
                            disabled={!enableTracking}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="XXXXXXXXXXXXXXX"
                        />
                    </div>
                </div>

                {/* Cookie Consent */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                    <h3 className="font-medium text-gray-900">Privacy</h3>
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Cookie Consent Banner</p>
                            <p className="text-sm text-gray-500">
                                Show cookie consent popup to visitors
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            {...register('cookieConsent')}
                            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                    </label>
                </div>
            </div>

            {saved && <SuccessToast message="Analytics settings saved!" />}
        </form>
    );
}

// Settings Tabs Component
export function SettingsTabs({
    activeTab,
    onTabChange,
}: {
    activeTab: string;
    onTabChange: (tab: string) => void;
}) {
    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'contact', label: 'Contact', icon: Phone },
        { id: 'social', label: 'Social Media', icon: Facebook },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ];

    return (
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            'flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                            activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        )}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}
