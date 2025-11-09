'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import AuthServices from '@/services/AuthServices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageToggle from '@/components/ui/LanguageToggle';
import RoleSelector from '@/components/auth/RoleSelector';
import ClientSignupForm from '@/components/auth/ClientSignupForm';
import MemberSignupForm from '@/components/auth/MemberSignupForm';

export default function SignupPage() {
  //
  const { t } = useTranslation();
  const router = useRouter();
  const [role, setRole] = useState('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  //
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
  };
  //
  const handleSignup = async (data) => {
    setError('');
    setLoading(true);

    try {
      const response =
        role === 'client'
          ? await AuthServices.signupClient(data)
          : await AuthServices.signupMembre(data);

      if (response?.success) {
        const token = response.data.token;
        const user = response.data.user;

        if (token && user) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          const oneMonth = 30 * 24 * 60 * 60;
          document.cookie = `access_token=${token}; path=/; secure; samesite=strict; max-age=${oneMonth}`;
        }

        if (role === 'client') router.push('/');
        else router.push('/membre/dashbord');
      } else {
        setError(t('auth.errors.generic'));
      }
    } catch {
      setError(t('auth.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 ltr:right-4 rtl:left-4">
        <LanguageToggle />
      </div>

      <div className="max-w-md w-full space-y-6">
        {/* Logo and Titles */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-3 mb-3">
            <Image src="/logo.svg" alt="Logo" width={250} height={150} />
          </Link>
          <h2 className="text-2xl font-bold text-secondary-foreground">
            {t('auth.createAccount')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('auth.createAccountSubtitle')}
          </p>
        </div>

        {/* Role Selector */}
        <RoleSelector role={role} onSelect={handleRoleSelect} />

        {/* Signup Form */}
        <Card className="shadow-lg mt-4">
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold text-secondary-foreground">
              {role === 'client'
                ? t('auth.createAccount')
                : t('auth.createAccount')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {role === 'client' ? (
              <ClientSignupForm loading={loading} onSubmit={handleSignup} error={error} />
            ) : (
              <MemberSignupForm loading={loading} onSubmit={handleSignup} error={error} />
            )}
          </CardContent>
        </Card>

        {/* Already have account */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
