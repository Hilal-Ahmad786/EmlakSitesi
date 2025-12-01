'use client';

import { useTranslations } from 'next-intl';

export default function TermsPage() {
    const t = useTranslations('Static.terms');

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
                        These Terms of Service ("Terms") govern your access to and use of the Maison d&apos;Orient website. By accessing or using the Site, you agree to be bound by these Terms.
                    </p>

                    <h3>1. Use of the Site</h3>
                    <p>
                        You may use the Site only for lawful purposes and in accordance with these Terms. You agree not to use the Site:
                    </p>
                    <ul>
                        <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
                        <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter", "spam", or any other similar solicitation.</li>
                        <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
                    </ul>

                    <h3>2. Intellectual Property Rights</h3>
                    <p>
                        The Site and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by the Company, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                    </p>

                    <h3>3. Disclaimer of Warranties</h3>
                    <p>
                        Your use of the Site is at your own risk. The Site is provided on an "AS IS" and "AS AVAILABLE" basis, without any warranties of any kind, either express or implied. Neither the Company nor any person associated with the Company makes any warranty or representation with respect to the completeness, security, reliability, quality, accuracy, or availability of the Site.
                    </p>

                    <h3>4. Limitation of Liability</h3>
                    <p>
                        In no event will the Company, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the Site, any websites linked to it, any content on the Site or such other websites.
                    </p>
                </div>
            </div>
        </div>
    );
}
