
import { useTranslations } from 'next-intl';
import { Team } from '@/components/features/company/Team';
import { Testimonials } from '@/components/features/company/Testimonials';
import { FAQ } from '@/components/features/company/FAQ';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "About Us | Maison d'Orient",
    description: "Learn about Maison d'Orient, Istanbul's premier luxury real estate agency. Meet our expert team and discover our mission.",
};

export default function AboutPage() {
    const t = useTranslations('Company.about');

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <div className="relative h-[50vh] min-h-[400px] mt-[120px]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2670&auto=format&fit=crop)' }}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center text-center">
                    <div className="container px-4">
                        <h1 className="font-serif text-4xl md:text-6xl text-white mb-6">{t('title')}</h1>
                        <p className="text-xl text-gray-200 max-w-2xl mx-auto font-light">{t('subtitle')}</p>
                    </div>
                </div>
            </div>

            {/* Story & Mission */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="font-serif text-3xl text-primary mb-6">{t('story')}</h2>
                            <div className="prose prose-lg text-text-secondary">
                                <p>
                                    Founded in 2010, Maison d'Orient began with a simple vision: to bridge the gap between international investors and the vibrant Istanbul real estate market. We understood that buying property abroad is not just a transaction, but a life-changing decision.
                                </p>
                                <p>
                                    Over the years, we have grown into a premier luxury real estate agency, known for our integrity, market expertise, and personalized service. We have helped hundreds of families find their dream homes and investors build profitable portfolios in Turkey.
                                </p>
                            </div>
                        </div>
                        <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2573&auto=format&fit=crop)' }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-20">
                        <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl order-2 md:order-1">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2632&auto=format&fit=crop)' }}
                            />
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="font-serif text-3xl text-primary mb-6">{t('mission')}</h2>
                            <div className="prose prose-lg text-text-secondary">
                                <p>
                                    Our mission is to provide an exceptional real estate experience defined by transparency, trust, and excellence. We strive to be more than just agents; we are your partners in navigating the complex landscape of the Turkish property market.
                                </p>
                                <p>
                                    We are committed to showcasing the finest properties Istanbul has to offer, while ensuring that every client receives tailored advice and comprehensive support, from the initial search to the final title deed transfer and beyond.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Team />
            <Testimonials />
            <FAQ />
        </div>
    );
}
