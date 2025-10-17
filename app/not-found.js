'use client';

import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-md p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning/10 text-warning-foreground mb-4">
          <Search className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-2">{t('errors.notFound.title')}</h2>
        <p className="text-muted-foreground mb-6">
          {t('errors.notFound.message')}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          {t('errors.notFound.suggestions')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              {t('errors.actions.goHome')}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/services" className="flex items-center gap-2">
              {t('errors.actions.browseServices')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}