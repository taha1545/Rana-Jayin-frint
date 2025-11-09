'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Store, Phone, Lock, File, MapPin,
    Eye, EyeOff, Wrench, Truck, Battery, LifeBuoy, Fuel, ShieldCheck, Car, Zap
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import MapPickerModal from './MapPickerModal';

export default function MemberSignupForm({ onSubmit, error }) {
    const { t } = useTranslation();
    const [data, setData] = useState({
        name: '',
        storeName: '',
        phone: '',
        password: '',
        confirmPassword: '',
        certificate: null,
        storeImages: [],
        location: '',
        serviceType: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [memberStep, setMemberStep] = useState(1);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [selectedCoords, setSelectedCoords] = useState(null);
    const [loading, setLoading] = useState(false);

    const services = [
        { icon: <Wrench className="w-6 h-6 text-primary" />, key: "onSiteRepair", label: t('services.onSiteRepair') },
        { icon: <Truck className="w-6 h-6 text-primary" />, key: "towingService", label: t('services.towingService') },
        { icon: <Battery className="w-6 h-6 text-primary" />, key: "batteryBoost", label: t('services.batteryBoost') },
        { icon: <LifeBuoy className="w-6 h-6 text-primary" />, key: "emergencySupport", label: t('services.emergencySupport') },
        { icon: <Fuel className="w-6 h-6 text-primary" />, key: "fuelDelivery", label: t('services.fuelDelivery') },
        { icon: <ShieldCheck className="w-6 h-6 text-primary" />, key: "safetyCheck", label: t('services.safetyCheck') },
        { icon: <Car className="w-6 h-6 text-primary" />, key: "accidentAssistance", label: t('services.accidentAssistance') },
        { icon: <Zap className="w-6 h-6 text-primary" />, key: "quickResponse", label: t('services.quickResponse') },
    ];

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setData(prev => ({
            ...prev,
            [name]: files
                ? name === 'storeImages'
                    ? Array.from(files)
                    : files[0]
                : value
        }));

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

    const validateStep1 = () => {
        if (data.password !== data.confirmPassword) return t('auth.errors.passwordsMismatch');
        if (passwordStrength < 3) return t('auth.errors.weakPassword');
        if (!data.name) return t('auth.errors.nameRequired');
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (memberStep === 1) {
            const stepError = validateStep1();
            if (stepError) {
                console.error('Validation Error:', stepError);
                return alert(stepError);
            }
            setMemberStep(2);
            return;
        }

        if (!data.storeName) {
            const errMsg = t('auth.errors.storeNameRequired');
            console.error('Validation Error:', errMsg);
            return alert(errMsg);
        }

        if (!data.serviceType) {
            const errMsg = t('auth.errors.selectServiceType');
            console.error('Validation Error:', errMsg);
            return alert(errMsg);
        }

        try {
            setLoading(true);

            const payload = {
                name: data.name,
                phone: data.phone,
                password: data.password,
                storeName: data.storeName,
                type: data.serviceType,
                latitude: selectedCoords ? selectedCoords.lat : null,
                longitude: selectedCoords ? selectedCoords.lng : null,
                certificate: data.certificate,
                storeImages: data.storeImages,
            };

            const result = await onSubmit(payload);

        } catch (err) {
            console.error('Signup Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return 'bg-red-500';
        if (passwordStrength <= 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const renderFileInput = (name, label, multiple = false, accept = '*/*') => (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-muted-foreground">{label}</label>
            <label
                htmlFor={name}
                className="flex items-center justify-center w-full h-12 border border-dashed border-muted rounded-lg cursor-pointer hover:border-secondary transition-colors"
            >
                <File className="mr-2 w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                    {multiple ? t('auth.selectMultipleFiles') : t('auth.selectFile')}
                </span>
                <input
                    id={name}
                    name={name}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleChange}
                    className="hidden"
                />
            </label>
            {data[name] && (
                <div className="mt-1 text-xs text-muted-foreground">
                    {multiple ? `${data[name].length} ${t('auth.filesSelected')}` : data[name].name}
                </div>
            )}
        </div>
    );

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* STEP 1 */}
                {memberStep === 1 && (
                    <>
                        <Input
                            icon={<Store />}
                            name="name"
                            placeholder={t('auth.fullName')}
                            value={data.name}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            icon={<Phone />}
                            name="phone"
                            type="tel"
                            placeholder={t('auth.phone')}
                            value={data.phone}
                            onChange={handleChange}
                            required
                        />

                        {/* Password */}
                        <div className="relative">
                            <Input
                                icon={<Lock />}
                                type={showPassword ? 'text' : 'password'}
                                placeholder={t('auth.password')}
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                required
                                className="pr-10"
                            />
                            <div
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </div>
                        </div>

                        {data.password && (
                            <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-muted rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">
                                    {passwordStrength <= 2
                                        ? t('auth.passwordStrength.weak')
                                        : passwordStrength <= 3
                                            ? t('auth.passwordStrength.medium')
                                            : t('auth.passwordStrength.strong')}
                                </span>
                            </div>
                        )}

                        {/* Confirm Password */}
                        <div className="relative">
                            <Input
                                icon={<Lock />}
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder={t('auth.confirmPassword')}
                                name="confirmPassword"
                                value={data.confirmPassword}
                                onChange={handleChange}
                                required
                                className="pr-10"
                            />
                            <div
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff /> : <Eye />}
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full h-11">
                            {loading ? t('common.loading') : t('auth.next')}
                        </Button>
                    </>
                )}

                {/* STEP 2 */}
                {memberStep === 2 && (
                    <div className="space-y-6">
                        {/* Store Name */}
                        <Input
                            icon={<Store />}
                            name="storeName"
                            placeholder={t('auth.storeName')}
                            value={data.storeName}
                            onChange={handleChange}
                            required
                        />

                        {/* Service Type */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-muted-foreground m-2">
                                {t('auth.serviceType')}
                            </label>
                            <div className="relative">
                                <select
                                    name="serviceType"
                                    value={data.serviceType}
                                    onChange={(e) => setData(prev => ({ ...prev, serviceType: e.target.value }))}
                                    className="w-full appearance-none rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                                    required
                                >
                                    <option value="" className="text-muted-foreground">{t('auth.selectServiceType')}</option>
                                    {services.map(service => (
                                        <option key={service.key} value={service.key} className="text-foreground">
                                            {service.label}
                                        </option>
                                    ))}
                                </select>

                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg className="h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Location Picker */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-muted-foreground">
                                {t('auth.location')}
                            </label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    icon={<MapPin />}
                                    name="location"
                                    type="text"
                                    value={selectedCoords ? `${selectedCoords.lat.toFixed(5)}, ${selectedCoords.lng.toFixed(5)}` : ''}
                                    readOnly
                                    placeholder={t('auth.selectLocation')}
                                    className="flex-1"
                                    required
                                />
                                <Button type="button" size="sm" onClick={() => setIsMapOpen(true)}>
                                    {t('auth.pickOnMap')}
                                </Button>
                            </div>
                        </div>

                        {/* File Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderFileInput('storeImages', t('auth.storeImages'), true, 'image/*')}
                            {renderFileInput('certificate', t('auth.certificate'), false, 'image/*,application/pdf')}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-4">
                            <Button type="button" variant="outline" onClick={() => setMemberStep(1)}>
                                {t('common.back')}
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? t('common.loading') : t('auth.signup')}
                            </Button>
                        </div>
                    </div>
                )}
            </form>

            {isMapOpen && (
                <MapPickerModal
                    onClose={() => setIsMapOpen(false)}
                    onSelect={(coords) => {
                        setSelectedCoords(coords);
                        setIsMapOpen(false);
                    }}
                />
            )}
        </>
    );
}
