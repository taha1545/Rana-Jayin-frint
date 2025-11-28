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
    Droplets,
    Key,
    Cog
} from "lucide-react";

export default function Services() {
    const { t } = useTranslation();
    const router = useRouter();

    const services = [
        { icon: <LifeBuoy className="w-10 h-10 text-red-500" />, key: "emergencySupport", emergency: true },
        { icon: <Car className="w-10 h-10 text-purple-500" />, key: "accidentAssistance" },
        { icon: <Cog className="w-10 h-10 text-gray-400" />, key: "mechanic" },
        { icon: <Wrench className="w-10 h-10 text-blue-500" />, key: "onSiteRepair" },
        { icon: <Truck className="w-10 h-10 text-yellow-500" />, key: "towingService" },
        { icon: <Cog className="w-10 h-10 text-gray-500" />, key: "carPartsSell" },
        { icon: <Battery className="w-10 h-10 text-green-500" />, key: "batteryBoost" },
        { icon: <Fuel className="w-10 h-10 text-orange-500" />, key: "fuelDelivery" },
        { icon: <Zap className="w-10 h-10 text-indigo-500" />, key: "quickResponse", emergency: true },
        { icon: <ShieldCheck className="w-10 h-10 text-teal-500" />, key: "safetyCheck" },
        { icon: <Droplets className="w-10 h-10 text-cyan-500" />, key: "carWash" },
        { icon: <Key className="w-10 h-10 text-pink-500" />, key: "carRent" },
    ];

    const handleClick = (service) => {
        if (service.emergency) {
            document.getElementById("emergency-services")?.scrollIntoView({ behavior: "smooth" });
        } else {
            router.push(`/map?type=${service.key}`);
        }
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

                {/* All Services Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.key}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Card
                                onClick={() => handleClick(service)}
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
