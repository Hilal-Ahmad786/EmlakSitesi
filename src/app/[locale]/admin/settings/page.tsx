'use client';

import { use, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import {
    GeneralSettings,
    ContactSettings,
    SocialSettings,
    AnalyticsSettings,
    SettingsTabs,
} from '@/components/admin/settings/SettingsComponents';

// Default settings data
const defaultGeneralSettings = {
    siteName: "Maison d'Orient",
    siteDescription: 'Luxury Real Estate in Istanbul',
    siteUrl: 'https://maisondorient.com',
    logo: '/logo.png',
    favicon: '/favicon.ico',
    timezone: 'Europe/Istanbul',
    dateFormat: 'DD/MM/YYYY',
    currency: 'EUR',
    defaultLanguage: 'en',
    maintenanceMode: false,
};

const defaultContactSettings = {
    email: 'info@maisondorient.com',
    phone: '+90 532 461 0574',
    whatsapp: '+90 532 461 0574',
    address: 'Bebek Mahallesi, Cevdet Paşa Caddesi No: 45',
    city: 'Istanbul',
    country: 'Turkey',
    postalCode: '34342',
    googleMapsUrl: '',
    officeHours: 'Mon-Fri: 9:00 AM - 6:00 PM, Sat: 10:00 AM - 4:00 PM',
};

const defaultSocialSettings = {
    facebook: 'https://facebook.com/maisondorient',
    twitter: 'https://twitter.com/maisondorient',
    instagram: 'https://instagram.com/maisondorient',
    linkedin: 'https://linkedin.com/company/maisondorient',
    youtube: '',
    pinterest: '',
    tiktok: '',
};

const defaultAnalyticsSettings = {
    googleAnalyticsId: '',
    googleTagManagerId: '',
    facebookPixelId: '',
    hotjarId: '',
    enableTracking: true,
    cookieConsent: true,
};

export default function SettingsPage(props: { params: Promise<{ locale: string }> }) {
    const params = use(props.params);
    const { locale } = params;
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabParam || 'general');
    const [loading, setLoading] = useState(false);

    // Settings state
    const [generalSettings, setGeneralSettings] = useState(defaultGeneralSettings);
    const [contactSettings, setContactSettings] = useState(defaultContactSettings);
    const [socialSettings, setSocialSettings] = useState(defaultSocialSettings);
    const [analyticsSettings, setAnalyticsSettings] = useState(defaultAnalyticsSettings);

    const handleGeneralSubmit = async (data: typeof defaultGeneralSettings) => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setGeneralSettings(data);
        setLoading(false);
    };

    const handleContactSubmit = async (data: typeof defaultContactSettings) => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setContactSettings(data);
        setLoading(false);
    };

    const handleSocialSubmit = async (data: typeof defaultSocialSettings) => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setSocialSettings(data);
        setLoading(false);
    };

    const handleAnalyticsSubmit = async (data: typeof defaultAnalyticsSettings) => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setAnalyticsSettings(data);
        setLoading(false);
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        // Update URL without navigation
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.pushState({}, '', url);
    };

    return (
        <AdminLayout locale={locale}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your website configuration
                    </p>
                </div>

                <SettingsTabs activeTab={activeTab} onTabChange={handleTabChange} />

                {activeTab === 'general' && (
                    <GeneralSettings
                        defaultValues={generalSettings}
                        onSubmit={handleGeneralSubmit}
                        loading={loading}
                    />
                )}

                {activeTab === 'contact' && (
                    <ContactSettings
                        defaultValues={contactSettings}
                        onSubmit={handleContactSubmit}
                        loading={loading}
                    />
                )}

                {activeTab === 'social' && (
                    <SocialSettings
                        defaultValues={socialSettings}
                        onSubmit={handleSocialSubmit}
                        loading={loading}
                    />
                )}

                {activeTab === 'analytics' && (
                    <AnalyticsSettings
                        defaultValues={analyticsSettings}
                        onSubmit={handleAnalyticsSubmit}
                        loading={loading}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
