"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { ShieldCheck } from "lucide-react";

export default function Services() {
    const [showAll, setShowAll] = useState(false);
    const { t } = useTranslation();

    const services = [
        { icon: <ShieldCheck className="w-10 h-10 text-primary" />, key: "onSiteRepair" },
        { icon: <ShieldCheck className="w-10 h-10 text-primary" />, key: "towingService" },
        { icon: <ShieldCheck className="w-10 h-10 text-primary" />, key: "batteryBoost" },
        { icon: <ShieldCheck className="w-10 h-10 text-primary" />, key: "emergencySupport" },
        { icon: <ShieldCheck className="w-10 h-10 text-primary" />, key: "fuelDelivery" },
        { icon: <ShieldCheck className="w-10 h-10 text-primary" />, key: "safetyCheck" },
        { icon: <ShieldCheck className="w-10 h-10 text-primary" />, key: "accidentAssistance" },
        { icon: <ShieldCheck className="w-10 h-10 text-primary" />, key: "quickResponse" },
    ];

    const visibleServices = showAll ? services : services.slice(0, 4);

    return (
        <section className="bg-gray-50 dark:bg-gray-900 py-16 px-6">
            <div className="max-w-6xl mx-auto text-center">
                {/* Title Section */}
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {t("services.title")}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
                    {t("services.description")}
                </p>

                {/* Services Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                    <AnimatePresence>
                        {visibleServices.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Card className="hover:shadow-lg dark:hover:shadow-blue-900 transition-all duration-300 h-full flex flex-col justify-between rounded-2xl">
                                    <CardHeader className="flex flex-col items-center space-y-3">
                                        {service.icon}
                                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {t(`services.list.${service.key}.title`)}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-gray-600 dark:text-gray-400 text-center">
                                            {t(`services.list.${service.key}.description`)}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Show More Button */}
                <Button
                    variant="default"
                    className="px-6 py-2 text-lg font-medium rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? t("services.showLess") : t("services.showMore")}
                </Button>
            </div>
        </section>
    );
}
