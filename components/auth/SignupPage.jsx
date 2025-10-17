'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, User, Car, Phone, MapPin } from 'lucide-react';
import LanguageToggle from '@/components/ui/LanguageToggle';

export default function SignupPage() {
  //
  const { t } = useTranslation();
  const { signup } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    location: '',
    storeImages: [],
    certificateImage: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [memberStep, setMemberStep] = useState(1);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');

    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[a-z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
    setMemberStep(1);
  };

  const validateForm = () => {
    if (memberStep === 1) {
      if (formData.password !== formData.confirmPassword) {
        setError(t('auth.errors.passwordsMismatch'));
        return false;
      }
      if (passwordStrength < 3) {
        setError(t('auth.errors.weakPassword'));
        return false;
      }
    }

    if (formData.role === 'member' && memberStep === 2 && !formData.location) {
      setError(t('auth.errors.pickLocation'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (formData.role === 'member' && memberStep === 1) {
      setFormData((prev) => ({
        ...prev,
        password: '',
        confirmPassword: '',
        storeImages: [],
        certificateImage: null,
        location: '',
      }));
      setSelectedCoords(null);
      setMemberStep(2);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...signupData } = formData;
      const result = await signup(signupData);

      if (result.success) {
        if (formData.role === 'client') router.push('/');
        else router.push('/membre/dashbord');
      } else {
        setError(t('auth.errors.generic'));
      }
    } catch (err) {
      setError(t('auth.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return t('auth.passwordStrength.weak');
    if (passwordStrength <= 3) return t('auth.passwordStrength.medium');
    return t('auth.passwordStrength.strong');
  };

  return (
    <>
      <div className="relative min-h-screen bg-background flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-4 ltr:right-4 rtl:left-4 ">
          <LanguageToggle />
        </div>
        <div className="max-w-md w-full space-y-4">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center space-x-3 mb-2">
              <Image src="/logo.svg" alt="Logo" width={250} height={100} />
            </Link>
            <h2 className="text-2xl font-bold text-secondary-foreground">
              {t('auth.createAccount')}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('auth.createAccountSubtitle')}
            </p>
          </div>

          {/* Role Selection */}
          <div className="bg-card rounded-lg p-2 shadow-sm border border-border">
            <p className="text-sm font-medium text-muted-foreground mb-3">{t('auth.iAm')}</p>
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

          {/* Signup Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-xl font-semibold text-secondary-foreground">
                {t('auth.createAccount')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* STEP 1 */}
                {memberStep === 1 && (
                  <>
                    <div className="relative">
                      <User className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={
                          formData.role === 'member' ? t('auth.storeName') : t('auth.fullName')
                        }
                        className="pl-10 rtl:pl-3 rtl:pr-10"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={t('auth.phone')}
                        className="pl-10 rtl:pl-3 rtl:pr-10 rtl:text-end"
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
                        className="pl-10 pr-10 rtl:pl-3 rtl:pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute  left-3 rtl:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-secondary-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="relative">
                      <Input
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder={t('auth.confirmPassword')}
                        className="pl-10 pr-10 rtl:pl-3 rtl:pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-3 rtl:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-secondary-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-11">
                      {loading ? t('auth.creatingAccount') : t('auth.next')}
                    </Button>
                  </>
                )}

                {/* STEP 2 */}
                {formData.role === 'member' && memberStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-muted-foreground">
                        {t('auth.location')}
                      </label>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="relative flex-1">
                          <MapPin className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                          <Input
                            name="location"
                            type="text"
                            value={
                              selectedCoords
                                ? `${selectedCoords.lat.toFixed(5)}, ${selectedCoords.lng.toFixed(
                                  5
                                )}`
                                : ''
                            }
                            readOnly
                            placeholder={t('auth.selectLocation')}
                            className="pl-10 rtl:pl-3 rtl:pr-10"
                            required
                          />
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setIsMapOpen(true)}
                          className="whitespace-nowrap"
                        >
                          {t('auth.pickOnMap')}
                        </Button>
                      </div>
                    </div>

                    {/* Store Images */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-muted-foreground">
                        {t('auth.storeImages')}
                      </label>
                      <input
                        name="storeImages"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            storeImages: Array.from(e.target.files || []),
                          }))
                        }
                        className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                    </div>

                    {/* Certificate */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-muted-foreground">
                        {t('auth.certificate')}
                      </label>
                      <input
                        name="certificateImage"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            certificateImage: (e.target.files && e.target.files[0]) || null,
                          }))
                        }
                        className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={() => setMemberStep(1)}>
                        {t('common.back')}
                      </Button>
                      <Button type="submit">{t('auth.signup')}</Button>
                    </div>
                  </div>
                )}
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {t('auth.alreadyHaveAccount')}{' '}
                  <Link
                    href="/auth/login"
                    className="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
                  >
                    {t('auth.signIn')}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

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

      {isMapOpen && (
        <MapPickerModal
          onClose={() => setIsMapOpen(false)}
          onSelect={(coords) => {
            setSelectedCoords(coords);
            setFormData((prev) => ({
              ...prev,
              location: `${coords.lat},${coords.lng}`,
            }));
            setIsMapOpen(false);
          }}
        />
      )}
    </>
  );
}

function MapPickerModal({ onClose, onSelect }) {
  const [tempCoords, setTempCoords] = useState(null);
  const PickMap = dynamic(() => import('@/components/map/MapComponent'), { ssr: false });
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-3xl h-[70vh] p-4 relative">
        <button
          onClick={() => {
            onClose();
          }}
          className="absolute top-3 right-3 text-muted-foreground hover:text-secondary-foreground"
        >
          ✕
        </button>

        <div className="w-full h-[85%] rounded-lg overflow-hidden">
          <PickMap
            pickMode
            pickedLocation={tempCoords}
            onPickLocation={(coords) => setTempCoords(coords)}
          />
        </div>

        <div className="flex justify-between items-center mt-3">
          <p className="text-sm text-muted-foreground">
            {t('auth.mapClickInstruction')}
          </p>
          <Button
            type="button"
            disabled={!tempCoords}
            onClick={() => {
              if (tempCoords) onSelect(tempCoords);
            }}
          >
            {t('auth.confirmLocation')}
          </Button>
        </div>
      </div>
    </div>
  );
}
