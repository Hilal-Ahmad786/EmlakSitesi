'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: 'Can foreigners buy property in Turkey?',
        answer: 'Yes, foreigners can buy property in Turkey. There are some restrictions in military zones and rural areas, but in general, most residential and commercial properties are available for foreign ownership.'
    },
    {
        question: 'Does buying property grant Turkish citizenship?',
        answer: 'Yes, purchasing property worth at least $400,000 USD allows you to apply for Turkish citizenship for yourself and your family. The property must be held for at least 3 years.'
    },
    {
        question: 'What are the additional costs of buying property?',
        answer: 'Additional costs typically include title deed transfer tax (4%), VAT (1-18%, often exempt for foreigners), stamp duty, notary fees, and agent commission. We recommend budgeting an additional 5-7% of the property price.'
    },
    {
        question: 'How long does the buying process take?',
        answer: 'The process usually takes 2-4 weeks from signing the sales contract to receiving the title deed (Tapu), assuming all documents are in order and funds are ready.'
    },
    {
        question: 'Do I need a lawyer?',
        answer: 'While not legally required, we highly recommend hiring an independent lawyer to conduct due diligence, check the title deed, and ensure your interests are protected throughout the transaction.'
    }
];

export function FAQ() {
    const t = useTranslations('Company.faq');
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-20 bg-background-alt">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">{t('title')}</h2>
                    <p className="text-text-secondary max-w-2xl mx-auto">{t('subtitle')}</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg border border-border overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-medium text-primary text-lg">{item.question}</span>
                                {openIndex === index ? (
                                    <Minus className="text-accent-gold flex-shrink-0" />
                                ) : (
                                    <Plus className="text-accent-gold flex-shrink-0" />
                                )}
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-text-secondary leading-relaxed border-t border-border pt-4">
                                            {item.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
