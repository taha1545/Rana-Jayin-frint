'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Phone, Lock, User, Car } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import AuthServices from '@/services/AuthServices';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageToggle from '@/components/ui/LanguageToggle';

export default function LoginPage() {

  // 
  const { t } = useTranslation();
  const router = useRouter();
  const [formData, setFormData] = useState({ phone: '', password: '', role: 'client' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  //   
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };
  const handleRoleChange = (role) => setFormData((prev) => ({ ...prev, role }));
  const validate = () => {
    const errors = {};
    if (!formData.phone.trim()) errors.phone = t('auth.errors.phoneRequired');
    else if (!/^\d{8,15}$/.test(formData.phone)) errors.phone = t('auth.errors.phoneInvalid');
    if (!formData.password.trim()) errors.password = t('auth.errors.passwordRequired');
    return errors;
  };

  // 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setLoading(true);
    try {
      const result = await AuthServices.login(formData);
      // 
      if (result?.success) {
        const token = result.data.token;
        const user = result.data.user;
        if (token && user) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          //
          const oneMonth = 30 * 24 * 60 * 60;
          document.cookie = `access_token=${token}; path=/; secure; samesite=strict; max-age=${oneMonth}`;
        }
        //
        if (formData.role === 'client') router.push('/');
        else router.push('/membre/dashbord');
        //
      } else {
        setError(t('auth.errors.invalidCredentials'));
      }
    } catch (err) {
      const apiError = t('auth.errors.generic');
      setError(apiError);
    }
    finally {
      setLoading(false);
    }
  };

  // render ui
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      {/* Language Toggle */}
      <div className="absolute top-4 ltr:right-4 rtl:left-4">
        <LanguageToggle />
      </div>

      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-3 mb-3">
            <Image src="/logo.svg" alt="Logo" width={250} height={150} />
          </Link>
          <h2 className="text-2xl font-bold text-secondary-foreground">{t('auth.login')}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t('auth.signInSubtitle')}</p>
        </div>

        {/* Role Selection */}
        <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
          <p className="text-sm font-medium text-muted-foreground mb-2">{t('auth.iAm')}</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { role: 'client', icon: User, label: t('auth.role.client') },
              { role: 'member', icon: Car, label: t('auth.role.member') },
            ].map(({ role, icon: Icon, label }) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleChange(role)}
                className={`p-3 rounded-lg border-2 transition-colors duration-200 ${formData.role === role
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:bg-muted'
                  }`}
              >
                <Icon className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold text-secondary-foreground">
              {t('auth.login')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Phone */}
              <div className="relative">
                <Phone className="absolute left-3 rtl:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t('auth.phone')}
                  className="pl-10 rtl:pl-3 rtl:pr-10 text-start"
                  required
                />
              </div>
              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 rtl:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t('auth.password')}
                  className="pl-10 pr-10 rtl:pl-3 rtl:pr-10 rtl:text-end"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 rtl:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-secondary-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Submit */}
              <Button type="submit" disabled={loading} className="w-full h-11">
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
            {/* Signup */}
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
