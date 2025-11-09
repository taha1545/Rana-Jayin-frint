'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from '@/hooks/useTranslation';

export default function TermsAgreement({ onAgree }) {
    const { t } = useTranslation();
    const [agreed, setAgreed] = useState(false);

    const handleChange = (val) => {
        setAgreed(val);
        onAgree?.(val); 
    };

    return (
        <div className="flex items-start space-x-2">
            <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={handleChange}
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
                {t('auth.termsText')}{' '}
                <a
                    href="/terms"
                    target="_blank"
                    className="text-primary underline"
                >
                    {t('auth.viewTerms')}
                </a>
            </label>
        </div>
    );
}
