import { ReferencesList } from '@/components/features/company/ReferencesList';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "References | Maison d'Orient",
    description: "Read what our clients and partners say about their experience with Maison d'Orient.",
};

export default function ReferencesPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Simple Text Hero */}
            <div className="bg-primary py-20 text-center text-white">
                <div className="container mx-auto px-4">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">References</h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90">
                        Trusted by major corporations and diplomatic missions.
                    </p>
                </div>
            </div>

            <ReferencesList />
        </div>
    );
}
