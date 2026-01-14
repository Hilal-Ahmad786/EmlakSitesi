import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { CompareProvider } from '@/context/CompareContext';
import { AlertsProvider } from '@/context/AlertsContext';
import { AppointmentsProvider } from '@/context/AppointmentsContext';
import { SavedSearchProvider } from '@/context/SavedSearchContext';
import { RecentlyViewedProvider } from '@/context/RecentlyViewedContext';
import { AnalyticsProvider } from '@/context/AnalyticsContext';
import { CompareBar } from '@/components/features/tools/CompareBar';
import { WhatsAppButton } from '@/components/features/whatsapp/WhatsAppButton';
import { NewsletterPopup } from '@/components/features/newsletter/NewsletterPopup';
import { InstallPrompt, OfflineBanner, UpdatePrompt } from '@/components/pwa/InstallPrompt';
import { ChatWidget } from '@/components/features/chat/ChatWidget';
import "../globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maison d'Orient | Luxury Real Estate Istanbul",
  description: "Exclusive historic and waterfront properties in Istanbul.",
};

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased font-sans flex flex-col min-h-screen`}
      >
        <NextIntlClientProvider messages={messages}>
          <CurrencyProvider>
            <FavoritesProvider>
              <CompareProvider>
                <AlertsProvider>
                  <AppointmentsProvider>
                    <SavedSearchProvider>
                      <RecentlyViewedProvider>
                        <AnalyticsProvider>
                          <ConditionalLayout>
                            {children}
                          </ConditionalLayout>
                          <CompareBar />
                          {/* WhatsApp floating button */}
                          <WhatsAppButton
                            phoneNumber="+905324610574"
                            defaultMessage="Hello! I'm interested in your properties."
                            agentName="Property Advisor"
                            agentTitle="Online"
                          />
                          {/* Newsletter popup (shows after delay) */}
                          <NewsletterPopup delay={15000} showOnExitIntent={true} />
                          {/* PWA components */}
                          <InstallPrompt />
                          <OfflineBanner />
                          <UpdatePrompt />
                          {/* Live Chat Widget */}
                          <ChatWidget />
                        </AnalyticsProvider>
                      </RecentlyViewedProvider>
                    </SavedSearchProvider>
                  </AppointmentsProvider>
                </AlertsProvider>
              </CompareProvider>
            </FavoritesProvider>
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
