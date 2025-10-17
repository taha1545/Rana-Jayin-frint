'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Phone, Lock, User, Car } from 'lucide-react';
import LanguageToggle from '@/components/ui/LanguageToggle';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const router = useRouter();
  //
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    role: 'client'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.phone, formData.password, formData.role);

      if (result.success) {
        //
        if (formData.role === 'client') {
          router.push('/');
        } else {
          router.push('/membre/dashbord');
        }
      } else {
        setError(t('auth.errors.invalidCredentials'));
      }
    } catch (error) {
      setError(t('auth.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 ltr:right-4 rtl:left-4 ">
        <LanguageToggle />
      </div>
      <div className="max-w-md w-full space-y-4">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-3 mb-3">
            <Image src="/logo.svg" alt="Logo" width={250} height={150} />
          </Link>
          <h2 className="text-2xl font-bold text-secondary-foreground">
            {t('auth.login')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('auth.signInSubtitle')}
          </p>
        </div>

        {/* Role Selection */}
        <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {t('auth.iAm')}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleRoleChange('client')}
              className={`p-3 rounded-lg border-2 transition-colors duration-200 ${formData.role === 'client'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:bg-muted'
                }`}
            >
              <User className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">{t('auth.role.client')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('member')}
              className={`p-3 rounded-lg border-2 transition-colors duration-200 ${formData.role === 'member'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:bg-muted'
                }`}
            >
              <Car className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">{t('auth.role.member')}</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold text-secondary-foreground">
              {t('auth.login')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="relative">
                <Phone className="absolute  left-3  rtl:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t('auth.phone')}
                  className="pl-10 rtl:pl-3 rtl:pr-10 text-start  "
                  required
                />
              </div>

              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t('auth.password')}
                  className="pl-10 pr-10 rtl:pl-3 rtl:pr-10  rtl:text-end "
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 rtl:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-secondary-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                    {t('auth.signingIn')}
                  </div>
                ) : (
                  t('auth.login')
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t('auth.dontHaveAccount')}{' '}
                <Link
                  href="/auth/signup"
                  className="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  {t('auth.signup')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            {t('common.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}

