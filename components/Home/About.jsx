'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Clock, Shield, MapPin, Users } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();

  const features = [
    {
      name: t('about.features.speed.name'),
      description: t('about.features.speed.description'),
      icon: Clock,
    },
    {
      name: t('about.features.safety.name'),
      description: t('about.features.safety.description'),
      icon: Shield,
    },
    {
      name: t('about.features.coverage.name'),
      description: t('about.features.coverage.description'),
      icon: MapPin,
    },
    {
      name: t('about.features.team.name'),
      description: t('about.features.team.description'),
      icon: Users,
    },
  ];

  return (
    <section className="bg-background text-foreground dark:bg-background dark:text-foreground py-24 sm:py-32 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Title Section */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-muted-foreground ">
            {t('about.subtitle')}
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-primary dark:text-primary sm:text-5xl">
            {t('about.title')}
          </p>
          <p className="mt-6 text-lg text-muted-foreground">
            {t('about.description')}
          </p>
        </div>

        {/* Features Section */}
        <div className="mx-auto mt-12 max-w-2xl lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold text-secondary-foreground dark:text-white">
                  <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-primary shadow-md">
                    <feature.icon aria-hidden="true" className="size-6 text-primary-foreground" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base text-muted-foreground">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
