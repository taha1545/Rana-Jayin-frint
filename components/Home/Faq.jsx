"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslation } from '@/hooks/useTranslation';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);
    const { t } = useTranslation();

    const faqs = [
        {
            key: "services",
        },
        {
            key: "requestHelp",
        },
        {
            key: "availability",
        },
        {
            key: "becomeProvider",
        },
        {
            key: "pricing",
        },
        {
            key: "responseTime",
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-background py-16 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Title Section */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold text-secondary-foreground">
                        {t('faq.title')}
                    </h2>
                    <p className="text-muted-foreground mt-2 text-lg">
                        {t('faq.description')}
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-card rounded-2xl shadow-sm border border-border"
                        >
                            <button
                                className="flex justify-between items-center w-full p-5 text-left hover:bg-muted rounded-2xl transition-colors duration-200"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span className="font-medium text-secondary-foreground text-lg">
                                    {t(`faq.questions.${faq.key}.question`)}
                                </span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown className="w-6 h-6 text-muted-foreground" />
                                </motion.div>
                            </button>

                            <AnimatePresence initial={false}>
                                {openIndex === index && (
                                    <motion.div
                                        key="content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-5 pb-5 text-muted-foreground">
                                            {t(`faq.questions.${faq.key}.answer`)}
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
