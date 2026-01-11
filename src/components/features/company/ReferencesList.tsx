'use client';

import { references } from '@/data/references';
import { ReferenceCard } from './ReferenceCard';
import { useState } from 'react';
import { ImageModal } from '@/components/ui/ImageModal';

export function ReferencesList() {
    const [selectedReference, setSelectedReference] = useState<{ src: string, alt: string } | null>(null);

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {references.map((reference, index) => (
                        <ReferenceCard
                            key={index}
                            reference={reference}
                            onClick={() => setSelectedReference({
                                src: reference.logo,
                                alt: reference.name
                            })}
                        />
                    ))}
                </div>
            </div>

            <ImageModal
                isOpen={!!selectedReference}
                onClose={() => setSelectedReference(null)}
                imageSrc={selectedReference?.src || ''}
                altText={selectedReference?.alt || ''}
            />
        </section>
    );
}
