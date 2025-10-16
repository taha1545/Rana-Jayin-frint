'use client';

import { useState, useEffect, useRef } from 'react';
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
        setError('Passwords do not match');
        return false;
      }
      if (passwordStrength < 3) {
        setError(
          'Password is too weak. Please use at least 8 characters with uppercase, lowercase, and numbers.'
        );
        return false;
      }
    }

    if (formData.role === 'member' && memberStep === 2 && !formData.location) {
      setError('Please select your store location on the map.');
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
        if (formData.role === 'client') router.push('/client/dashboard');
        else router.push('/member/dashboard');
      } else {
        setError('An error occurred during signup. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <>
      <div className="relative min-h-screen bg-background flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-4 right-4">
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
              Create your account to get started
            </p>
          </div>

          {/* Role Selection */}
          <div className="bg-card rounded-lg p-2 shadow-sm border border-border">
            <p className="text-sm font-medium text-muted-foreground mb-3">I am a:</p>
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
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={
                          formData.role === 'member' ? t('auth.storeName') : t('auth.fullName')
                        }
                        className="pl-10"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={t('auth.phone')}
                        className="pl-10"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder={t('auth.password')}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-secondary-foreground"
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
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder={t('auth.confirmPassword')}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-secondary-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-11">
                      {loading ? 'Creating account...' : t('auth.next')}
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
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
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
                            className="pl-10"
                            required
                          />
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setIsMapOpen(true)}
                          className="whitespace-nowrap"
                        >
                          Pick on Map
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
                        Back
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
              ← Back to Home
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
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [tempCoords, setTempCoords] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (mapRef.current || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current).setView([36.7538, 3.0588], 6);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            map.setView([pos.coords.latitude, pos.coords.longitude], 12);
          },
          () => { }
        );
      }

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
        else markerRef.current = L.marker([lat, lng]).addTo(map);
        if (isMounted) setTempCoords({ lat, lng });
      });
    };

    init();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-3xl h-[70vh] p-4 relative">
        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.off();
              mapRef.current.remove();
              mapRef.current = null;
            }
            markerRef.current = null;
            onClose();
          }}
          className="absolute top-3 right-3 text-muted-foreground hover:text-secondary-foreground"
        >
          ✕
        </button>

        <div ref={mapContainerRef} className="w-full h-[85%] rounded-lg overflow-hidden" />

        <div className="flex justify-between items-center mt-3">
          <p className="text-sm text-muted-foreground">
            Click on the map to select your store location.
          </p>
          <Button
            type="button"
            disabled={!tempCoords}
            onClick={() => {
              if (tempCoords) onSelect(tempCoords);
            }}
          >
            Confirm Location
          </Button>
        </div>
      </div>
    </div>
  );
}
