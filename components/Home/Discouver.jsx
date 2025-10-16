'use client';

import Image from "next/image";
import { useTranslation } from '@/hooks/useTranslation';
import iphone from "@/public/iPhone.svg";

export default function Discover() {
    //
    const { t } = useTranslation();
    //
    return (
        <section className="w-full flex flex-col items-center py-24 px-[4%] bg-background">
            {/*  Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-secondary-foreground text-center mb-16">
                {t('discover.title') || 'Discover our app'}
            </h2>

            {/* Main  */}
            <div className="w-full max-w-7xl bg-gradient-to-r from-primary to-primary/80 rounded-3xl overflow-hidden py-16 px-10 md:px-16 flex flex-col lg:flex-row items-center justify-between text-primary-foreground shadow-xl">
                {/* Left Content */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg space-y-6">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                        {t('discover.heading') || 'Ready To Get Started?'}
                    </h1>
                    <p className="text-lg text-primary-foreground/90">
                        {t('discover.description') ||
                            'Risus Habitant Leo Egestas Mauris Diam Eget Morbi Tempus Vulputate.'}
                    </p>

                    <div className="flex gap-4 pt-4">
                        <a href="#" className="transition transform hover:scale-105">
                            <Image
                                src="/Playstore.svg"
                                alt="Get it on Google Play"
                                width={45}
                                height={45}
                                className="rounded-lg"
                            />
                        </a>
                        <a href="#" className="transition transform hover:scale-105">
                            <Image
                                src="/Apple.svg"
                                alt="Download on the App Store"
                                width={45}
                                height={45}
                                className="rounded-lg"
                            />
                        </a>
                    </div>
                </div>

                {/* Image */}
                <div className="relative mt-16 lg:mt-0">
                    <div className="relative w-[250px] sm:w-[280px] md:w-[320px] lg:w-[400px] ">
                        <Image
                            src={iphone}
                            alt="iPhone mockup"
                            className="drop-shadow-2xl transform lg:translate-x-10"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
