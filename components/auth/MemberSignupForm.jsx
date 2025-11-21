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
import TermsAgreement from './TermsAgreement'; 

export default function MemberSignupForm({ onSubmit, error }) {
    const { t } = useTranslation();

    const [data, setData] = useState({
        name: '',
        phone: '',
        password: '',
        confirmPassword: '',
        storeName: '',
        serviceType: [],
        car: { model: '', plateNumber: '', color: '' },
        certificate: null,
        storeImages: [],
        sensitiveDocs: { criminalRecord: null, storeRegistration: null }
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [memberStep, setMemberStep] = useState(1);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [selectedCoords, setSelectedCoords] = useState(null);
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false); 

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

        if (name === 'certificate' || name === 'storeImages' || name === 'criminalRecord' || name === 'storeRegistration') {
            if (name === 'storeImages') setData(prev => ({ ...prev, storeImages: Array.from(files) }));
            else if (name === 'certificate') setData(prev => ({ ...prev, certificate: files[0] || null }));
            else setData(prev => ({ ...prev, sensitiveDocs: { ...prev.sensitiveDocs, [name]: files[0] || null } }));
            return;
        }

        setData(prev => name in prev.car
            ? { ...prev, car: { ...prev.car, [name]: value } }
            : { ...prev, [name]: value }
        );

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

    const toggleService = (key) => {
        setData(prev => {
            const selected = prev.serviceType.includes(key)
                ? prev.serviceType.filter(s => s !== key)
                : [...prev.serviceType, key];
            return { ...prev, serviceType: selected };
        });
    };

    const validateStep1 = () => {
        if (data.password !== data.confirmPassword) return t('auth.errors.passwordsMismatch');
        if (passwordStrength < 3) return t('auth.errors.weakPassword');
        if (!data.name) return t('auth.errors.nameRequired');
        if (!data.phone) return t('auth.errors.phoneRequired');
        return null;
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return 'bg-red-500';
        if (passwordStrength <= 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (memberStep === 1) {
            const stepError = validateStep1();
            if (stepError) return alert(stepError);
            setMemberStep(2);
            return;
        }
        if (memberStep === 2) {
            if (!data.storeName) return alert(t('auth.errors.storeNameRequired'));
            if (!data.serviceType.length) return alert(t('auth.errors.selectServiceType'));
            setMemberStep(3);
            return;
        }
        if (memberStep === 3) {
            if (!agreed) return alert(t('auth.mustAgreeTerms')); 
            try {
                setLoading(true);
                await onSubmit({
                    ...data,
                    latitude: selectedCoords?.lat,
                    longitude: selectedCoords?.lng
                });
            } catch (err) {
                console.error('Backend Error:', err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const renderFileInput = (name, label, multiple = false, accept = '*/*') => (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-muted-foreground">{label}</label>
            <label htmlFor={name} className="flex items-center justify-center w-full h-12 border border-dashed border-muted rounded-lg cursor-pointer hover:border-secondary transition-colors">
                <File className="mr-2 w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{multiple ? t('auth.selectMultipleFiles') : t('auth.selectFile')}</span>
                <input id={name} name={name} type="file" accept={accept} multiple={multiple} onChange={handleChange} className="hidden" />
            </label>
            {name === 'storeImages' && data.storeImages.length > 0 && (
                <div className="mt-1 text-xs text-muted-foreground space-y-1">
                    {data.storeImages.map((file, idx) => <div key={idx}>{file.name}</div>)}
                </div>
            )}
            {['certificate', 'criminalRecord', 'storeRegistration'].includes(name) && data.sensitiveDocs[name] && (
                <div className="mt-1 text-xs text-muted-foreground">{data.sensitiveDocs[name]?.name || data[name]?.name}</div>
            )}
        </div>
    );

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

                {/* STEP 1 */}
                {memberStep === 1 && (
                    <>
                        <Input icon={<Store />} name="name" placeholder={t('auth.fullName')} value={data.name} onChange={handleChange} required />
                        <Input icon={<Phone />} name="phone" type="tel" placeholder={t('auth.phone')} value={data.phone} onChange={handleChange}  required />
                        <div className="relative">
                            <Input icon={<Lock />} type={showPassword ? 'text' : 'password'} placeholder={t('auth.password')} name="password" value={data.password} onChange={handleChange} required className="pr-10" />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</div>
                        </div>
                        {data.password && (
                            <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-muted rounded-full h-2">
                                    <div className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`} style={{ width: `${(passwordStrength / 5) * 100}%` }}></div>
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">{passwordStrength <= 2 ? t('auth.passwordStrength.weak') : passwordStrength <= 3 ? t('auth.passwordStrength.medium') : t('auth.passwordStrength.strong')}</span>
                            </div>
                        )}
                        <div className="relative">
                            <Input icon={<Lock />} type={showConfirmPassword ? 'text' : 'password'} placeholder={t('auth.confirmPassword')} name="confirmPassword" value={data.confirmPassword} onChange={handleChange} required className="pr-10" />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff /> : <Eye />}</div>
                        </div>
                        <Button type="submit" disabled={loading} className="w-full h-11">{loading ? t('common.loading') : t('auth.next')}</Button>
                    </>
                )}

                {/* STEP 2 */}
                {memberStep === 2 && (
                    <div className="space-y-6">
                        <Input icon={<Store />} name="storeName" placeholder={t('auth.storeName')} value={data.storeName} onChange={handleChange} required />

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-muted-foreground">{t('auth.carData')}</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <Input placeholder={t('auth.carModel')} name="model" value={data.car.model} onChange={handleChange} />
                                <Input placeholder={t('auth.carPlate')} name="plateNumber" value={data.car.plateNumber} onChange={handleChange} />
                                <Input placeholder={t('auth.carColor')} name="color" value={data.car.color} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-muted-foreground m-2">{t('auth.serviceType')}</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {services.map(service => (
                                    <div key={service.key} onClick={() => toggleService(service.key)} className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${data.serviceType.includes(service.key) ? 'border-primary bg-primary/10' : 'border-muted'}`}>
                                        {service.icon}
                                        <span className="text-xs mt-1 text-center">{service.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button type="button" variant="outline" onClick={() => setMemberStep(1)}>{t('common.back')}</Button>
                            <Button type="submit" disabled={loading}>{t('auth.next')}</Button>
                        </div>
                    </div>
                )}

                {/* STEP 3 */}
                {memberStep === 3 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {renderFileInput('certificate', t('auth.certificate'), false, 'image/*,application/pdf')}
                                {renderFileInput('storeImages', t('auth.storeImages'), true, 'image/*')}
                            </div>
                            <div className="space-y-4">
                                {renderFileInput('criminalRecord', t('auth.criminalRecord'), false, 'image/*,application/pdf')}
                                {renderFileInput('storeRegistration', t('auth.storeRegistration'), false, 'image/*,application/pdf')}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-muted-foreground">{t('auth.location')}</label>
                            <div className="flex gap-2 items-center">
                                <Input icon={<MapPin />} type="text" value={selectedCoords ? `${selectedCoords.lat.toFixed(5)}, ${selectedCoords.lng.toFixed(5)}` : ''} readOnly placeholder={t('auth.selectLocation')} className="flex-1" />
                                <Button type="button" size="sm" onClick={() => setIsMapOpen(true)}>{t('auth.pickOnMap')}</Button>
                            </div>
                        </div>

                        {/* terms agrment */}
                        <TermsAgreement onAgree={(value) => setAgreed(value)} />

                        <div className="flex justify-between pt-4">
                            <Button type="button" variant="outline" onClick={() => setMemberStep(2)}>{t('common.back')}</Button>
                            <Button type="submit" disabled={loading}>{loading ? t('common.loading') : t('auth.signup')}</Button>
                        </div>
                    </div>
                )}
            </form>

            {isMapOpen && <MapPickerModal onClose={() => setIsMapOpen(false)} onSelect={(coords) => { setSelectedCoords(coords); setIsMapOpen(false); }} />}
        </>
    );
}
