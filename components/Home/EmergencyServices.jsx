'use client';

import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

export default function EmergencyServices() {
    const { t } = useTranslation();

    const services = [
        {
            key: 'ambulance',
            img: '/embilance.png',
            borderColor: 'border-destructive',
        },
        {
            key: 'gendarmerie',
            img: '/gendarme.png',
            borderColor: 'border-accent',
        },
        {
            key: 'civilProtection',
            img: '/himaya.png',
            borderColor: 'border-destructive',
        },
        {
            key: 'police',
            img: '/police.png',
            borderColor: 'border-primary',
        },
    ];

    return (
        <section className="bg-background text-foreground dark:bg-background dark:text-foreground py-16 transition-colors duration-300">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-primary">
                    {t('emergencyServices.title')}
                </h1>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="bg-card rounded-2xl shadow-md p-6 flex flex-col items-center text-center 
                       hover:scale-105 transition-transform duration-300 border border-border"
                    >
                        {/* Image inside rounded frame */}
                        <div
                            className={`w-24 h-24 bg-card rounded-full flex items-center justify-center mb-4 border-4 ${service.borderColor}`}
                        >
                            <Image
                                src={service.img}
                                alt={service.key}
                                width={70}
                                height={70}
                                className="object-contain rounded-full"
                            />
                        </div>

                        {/* Text content */}
                        <h2 className="font-semibold text-lg text-secondary-foreground">
                            {t(`emergencyServices.${service.key}.title`)}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-2">
                            {t(`emergencyServices.${service.key}.description`)}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
