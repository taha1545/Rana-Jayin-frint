'use client';

import Image from "next/image";
import { useTranslation } from '@/hooks/useTranslation';
import iphone from "@/public/iPhone.svg";

export default function Discover() {
    const { t } = useTranslation();

    return (
        <section className="w-full flex flex-col items-center  py-16 md:py-24 px-[4%] bg-background">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-secondary-foreground text-center mb-16">
                {t('discover.title') || 'Discover our app'}
            </h2>

            {/* Main */}
            <div className="w-full max-w-7xl bg-gradient-to-r from-primary to-primary/80 rounded-3xl overflow-hidden py-16 px-8 md:px-16 flex flex-col-reverse lg:flex-row items-center justify-between text-primary-foreground shadow-2xl">

                {/* Left Content */}
                <div className="flex flex-col items-center lg:items-start rtl:lg:items-start text-center lg:text-left rtl:lg:text-right max-w-lg space-y-6 mt-12 lg:mt-0">
                    <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                        {t('discover.heading') || 'Ready To Get Started?'}
                    </h1>
                    <p className="text-lg text-primary-foreground/90">
                        {t('discover.description') ||
                            'Risus Habitant Leo Egestas Mauris Diam Eget Morbi Tempus Vulputate.'}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4 flex-wrap justify-center lg:justify-start rtl:lg:justify-end">
                        {/* Google Play */}
                        <a
                            href="#"
                            className="flex items-center gap-3 bg-black text-white px-5 py-3 rounded-xl transition-all hover:scale-105 hover:shadow-xl"
                        >
                            <Image
                                src="/Playstore.svg"
                                alt="Google Play icon"
                                width={24}
                                height={24}
                            />
                            <div className="flex flex-col text-left rtl:text-right leading-tight">
                                <span className="text-sm font-semibold">{t('discover.getOnPlayStore')}</span>
                            </div>
                        </a>

                        {/* Apple Store */}
                        <a
                            href="#"
                            className="flex items-center gap-3 bg-black text-white px-5 py-3 rounded-xl transition-all hover:scale-105 hover:shadow-xl"
                        >
                            <svg
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                            </svg>
                            <div className="flex flex-col text-left rtl:text-right leading-tight">
                                <span className="text-sm font-semibold">{t('discover.downloadOnAppStore')}</span>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Right (iPhone Image) */}
                <div className="relative flex justify-center lg:justify-end">
                    <div className="relative w-[240px] sm:w-[300px] md:w-[340px] lg:w-[450px]">
                        <Image
                            src={iphone}
                            alt="iPhone mockup"
                            className="drop-shadow-2xl lg:translate-x-8"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
