'use client';

import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  //
  const { t } = useTranslation();
  //
  return (
    <section className="bg-background pt-12 lg:pt-28 transition-colors duration-300">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">

        {/* Text  */}
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-secondary-foreground">
            {t('hero.title')}
          </h1>

          <h2 className="max-w-2xl mb-6 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
            <span className="text-secondary-foreground">{t('hero.subtitle').split(' ')[0]}</span>
            <span className="text-primary"> {t('hero.subtitle').split(' ')[1]}</span>
          </h2>

          <p className="max-w-2xl mb-6 font-light text-muted-foreground lg:mb-8 md:text-lg lg:text-xl">
            {t('hero.description')}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-primary-foreground 
                rounded-lg bg-primary hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-colors duration-200"
            >
              {t('hero.requestHelp')}
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-secondary-foreground 
                border border-border rounded-lg hover:bg-muted focus:ring-4 focus:ring-muted transition-colors duration-200"
            >
              {t('hero.browseServices')}
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

        </div>

        {/* Image  */}
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <Image
            src="/hero-image.png"
            alt="Hero illustration"
            width={1200}
            height={900}
            priority
            className="w-full h-auto rounded-2xl shadow-lg object-cover dark:brightness-90"
          />
        </div>

      </div>
    </section>
  );
}
