'use client';

import { useState } from 'react';
import { Phone, Lock, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import TermsAgreement from './TermsAgreement';

export default function ClientSignupForm({ onSubmit, loading, error }) {
    const { t } = useTranslation();
    const [data, setData] = useState({ fullName: '', phone: '', password: '' });
    const [agreed, setAgreed] = useState(false); 

    const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!agreed) {
            return alert(t('auth.mustAgreeTerms')); 
        }
        onSubmit({
            name: data.fullName,
            phone: data.phone,
            password: data.password,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                    name="fullName"
                    placeholder={t('auth.fullName')}
                    value={data.fullName}
                    onChange={handleChange}
                    className="pl-10"
                    required
                />
            </div>

            <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                    name="phone"
                    type="tel"
                    placeholder={t('auth.phone')}
                    value={data.phone}
                    onChange={handleChange}
                    className="pl-10"
                    required
                />
            </div>

            <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                    name="password"
                    type="password"
                    placeholder={t('auth.password')}
                    value={data.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                />
            </div>

            {/* Pass the setter to TermsAgreement */}
            <TermsAgreement onAgree={(value) => setAgreed(value)} />

            <Button type="submit" disabled={loading} className="w-full h-11">
                {loading ? t('auth.creatingAccount') : t('auth.next')}
            </Button>
        </form>
    );
}
