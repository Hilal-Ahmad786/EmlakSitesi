'use client';

import { Reference } from '@/data/references';
import { Quote } from 'lucide-react';

interface ReferenceCardProps {
    reference: Reference;
    onClick?: () => void;
}

export function ReferenceCard({ reference, onClick }: ReferenceCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            <div
                className="flex items-center justify-center h-40 mb-6 bg-gray-50 rounded-md p-4 cursor-pointer group overflow-hidden"
                onClick={onClick}
                title="Click to enlarge"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={reference.logo}
                    alt={`${reference.name} logo`}
                    className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                />
            </div>

            <div className="flex-grow">
                <Quote className="text-accent-gold mb-3 opacity-30" size={24} />
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                    "{reference.description}"
                </p>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-auto">
                <h4 className="font-serif text-primary font-medium text-center">
                    {reference.name}
                </h4>
            </div>
        </div>
    );
}
