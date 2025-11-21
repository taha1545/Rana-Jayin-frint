"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";

import {
    Wrench,
    Truck,
    Battery,
    LifeBuoy,
    Fuel,
    ShieldCheck,
    Car,
    Zap,
} from "lucide-react";

export default function Services() {
    const { t } = useTranslation();
    const router = useRouter();

    const services = [
        { icon: <Wrench className="w-10 h-10 text-primary" />, key: "onSiteRepair" },
        { icon: <Truck className="w-10 h-10 text-primary" />, key: "towingService" },
        { icon: <Battery className="w-10 h-10 text-primary" />, key: "batteryBoost" },
        { icon: <LifeBuoy className="w-10 h-10 text-primary" />, key: "emergencySupport" },
        { icon: <Fuel className="w-10 h-10 text-primary" />, key: "fuelDelivery" },
        { icon: <ShieldCheck className="w-10 h-10 text-primary" />, key: "safetyCheck" },
        { icon: <Car className="w-10 h-10 text-primary" />, key: "accidentAssistance" },
        { icon: <Zap className="w-10 h-10 text-primary" />, key: "quickResponse" },
    ];

    const handleClick = (key) => {
        router.push(`/map?type=${key}`);
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900 py-16 px-6">
            <div className="max-w-6xl mx-auto text-center">
                {/* Title */}
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {t("services.title")}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
                    {t("services.description")}
                </p>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.key}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Card
                                onClick={() => handleClick(service.key)}
                                className="cursor-pointer hover:shadow-xl dark:hover:shadow-blue-800 
                                           transition-all duration-300 h-full flex flex-col 
                                           justify-between rounded-2xl border border-gray-200 
                                           dark:border-gray-700"
                            >
                                <CardHeader className="flex flex-col items-center space-y-3 pt-6">
                                    {service.icon}
                                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {t(`services.list.${service.key}.title`)}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="px-4 pb-6">
                                    <CardDescription className="text-gray-600 dark:text-gray-400 text-center">
                                        {t(`services.list.${service.key}.description`)}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
