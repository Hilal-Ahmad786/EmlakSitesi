'use client';

import { use, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import {
    GeneralSettings,
    ContactSettings,
    SocialSettings,
    AnalyticsSettings,
    SettingsTabs,
} from '@/components/admin/settings/SettingsComponents';

// Default settings used as fallback when DB has no values yet
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

async function fetchSettingsByGroup(group: string): Promise<Record<string, any>> {
    try {
        const res = await fetch(`/api/admin/settings?group=${group}`, {
            credentials: 'include',
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (err) {
        console.error(`Failed to fetch ${group} settings:`, err);
    }
    return {};
}

async function saveSettings(settings: Record<string, any>): Promise<boolean> {
    try {
        const res = await fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(settings),
        });
        return res.ok;
    } catch (err) {
        console.error('Failed to save settings:', err);
        return false;
    }
}

function applyDbValues<T extends Record<string, any>>(
    defaults: T,
    dbValues: Record<string, any>,
    prefix: string
): T {
    const result = { ...defaults };
    for (const key of Object.keys(defaults)) {
        const dbKey = `${prefix}_${key}`;
        if (dbValues[dbKey] !== undefined) {
            (result as any)[key] = dbValues[dbKey];
        }
    }
    return result;
}

function toDbKeys(settings: Record<string, any>, prefix: string): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(settings)) {
        result[`${prefix}_${key}`] = value;
    }
    return result;
}

export default function SettingsPage(props: { params: Promise<{ locale: string }> }) {
    const params = use(props.params);
    const { locale } = params;
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabParam || 'general');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Settings state
    const [generalSettings, setGeneralSettings] = useState(defaultGeneralSettings);
    const [contactSettings, setContactSettings] = useState(defaultContactSettings);
    const [socialSettings, setSocialSettings] = useState(defaultSocialSettings);
    const [analyticsSettings, setAnalyticsSettings] = useState(defaultAnalyticsSettings);

    useEffect(() => {
        async function loadAllSettings() {
            setInitialLoading(true);
            const [generalDb, contactDb, socialDb, analyticsDb] = await Promise.all([
                fetchSettingsByGroup('general'),
                fetchSettingsByGroup('contact'),
                fetchSettingsByGroup('social'),
                fetchSettingsByGroup('analytics'),
            ]);

            setGeneralSettings(applyDbValues(defaultGeneralSettings, generalDb, 'general'));
            setContactSettings(applyDbValues(defaultContactSettings, contactDb, 'contact'));
            setSocialSettings(applyDbValues(defaultSocialSettings, socialDb, 'social'));
            setAnalyticsSettings(applyDbValues(defaultAnalyticsSettings, analyticsDb, 'analytics'));
            setInitialLoading(false);
        }
        loadAllSettings();
    }, []);

    const handleGeneralSubmit = async (data: typeof defaultGeneralSettings) => {
        setLoading(true);
        const ok = await saveSettings(toDbKeys(data, 'general'));
        if (ok) setGeneralSettings(data);
        setLoading(false);
    };

    const handleContactSubmit = async (data: typeof defaultContactSettings) => {
        setLoading(true);
        const ok = await saveSettings(toDbKeys(data, 'contact'));
        if (ok) setContactSettings(data);
        setLoading(false);
    };

    const handleSocialSubmit = async (data: typeof defaultSocialSettings) => {
        setLoading(true);
        const ok = await saveSettings(toDbKeys(data, 'social'));
        if (ok) setSocialSettings(data);
        setLoading(false);
    };

    const handleAnalyticsSubmit = async (data: typeof defaultAnalyticsSettings) => {
        setLoading(true);
        const ok = await saveSettings(toDbKeys(data, 'analytics'));
        if (ok) setAnalyticsSettings(data);
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
                        loading={loading || initialLoading}
                    />
                )}

                {activeTab === 'contact' && (
                    <ContactSettings
                        defaultValues={contactSettings}
                        onSubmit={handleContactSubmit}
                        loading={loading || initialLoading}
                    />
                )}

                {activeTab === 'social' && (
                    <SocialSettings
                        defaultValues={socialSettings}
                        onSubmit={handleSocialSubmit}
                        loading={loading || initialLoading}
                    />
                )}

                {activeTab === 'analytics' && (
                    <AnalyticsSettings
                        defaultValues={analyticsSettings}
                        onSubmit={handleAnalyticsSubmit}
                        loading={loading || initialLoading}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
