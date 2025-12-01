'use client';

import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
    const t = useTranslations('Static.privacy');

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-primary-dark text-white py-12 mb-12">
                <div className="container mx-auto px-4">
                    <h1 className="font-serif text-3xl md:text-4xl mb-2">{t('title')}</h1>
                    <p className="text-gray-400 text-sm">{t('lastUpdated', { date: 'December 1, 2023' })}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-border prose prose-lg max-w-none text-text-secondary">
                    <p>
                        At Maison d&apos;Orient, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                    </p>

                    <h3>Information We Collect</h3>
                    <p>
                        We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                    </p>
                    <ul>
                        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number.</li>
                        <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                    </ul>

                    <h3>Use of Your Information</h3>
                    <p>
                        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                    </p>
                    <ul>
                        <li>Assist law enforcement and respond to subpoena.</li>
                        <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
                        <li>Create and manage your account.</li>
                        <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
                        <li>Email you regarding your account or order.</li>
                    </ul>

                    <h3>Contact Us</h3>
                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us at:
                    </p>
                    <p>
                        <strong>Maison d&apos;Orient</strong><br />
                        Bebek, Cevdet Paşa Cd. No: 123<br />
                        34342 Beşiktaş/İstanbul, Turkey<br />
                        info@maisondorient.com
                    </p>
                </div>
            </div>
        </div>
    );
}
