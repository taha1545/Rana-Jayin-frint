'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Error({ error, reset }) {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-md p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{t('errors.page.title')}</h2>
        <p className="text-muted-foreground mb-2">
          {error.message || t('errors.page.defaultMessage')}
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          {t('errors.page.retry')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {t('errors.actions.tryAgain')}
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            {t('errors.actions.goHome')}
          </Button>
        </div>
        <div className="mt-6 text-sm text-muted-foreground">
          <button 
            onClick={() => router.push('/contact')}
            className="text-primary hover:underline"
          >
            {t('errors.actions.contactSupport')}
          </button>
        </div>
      </div>
    </div>
  );
}