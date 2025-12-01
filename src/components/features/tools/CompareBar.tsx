'use client';

import { useCompare } from '@/context/CompareContext';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CompareBar() {
    const { compareList, clearCompare, removeFromCompare } = useCompare();
    const t = useTranslations('Tools.compare');

    if (compareList.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-2xl z-50 p-4"
            >
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-primary">
                            {compareList.length} / 3 Selected
                        </span>
                        <button
                            onClick={clearCompare}
                            className="text-sm text-gray-500 hover:text-red-500 underline"
                        >
                            {t('clear')}
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/compare">
                            <Button className="flex items-center gap-2">
                                {t('view')}
                                <ArrowRight size={16} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
