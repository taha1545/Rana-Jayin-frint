'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Camera, Trash2, Send, CheckCircle, XCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useGeolocation } from '@/hooks/useGeolocation';
import ContactServices from '@/services/ContactServices';

export default function Report() {
    const { t } = useTranslation();
    const fileRef = useRef(null);

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

    const { location: userPosition, error: locationError, loading: locationLoading } = useGeolocation();

    function openPicker() {
        fileRef.current?.click();
    }

    function onFileChange(e) {
        const f = e.target.files?.[0];
        if (!f) return;

        if (!ALLOWED.includes(f.type)) {
            setStatus({ type: 'error', text: t('report.errors.format') || 'Only JPG, PNG, WEBP allowed.' });
            return;
        }

        if (f.size > MAX_SIZE) {
            setStatus({ type: 'error', text: t('report.errors.size') || 'Image exceeds 10MB.' });
            return;
        }

        setFile(f);
        setPreview(URL.createObjectURL(f));
        setStatus(null);
    }

    function removeImage(e) {
        e?.stopPropagation();
        if (preview) URL.revokeObjectURL(preview);
        setFile(null);
        setPreview(null);
    }

    async function handleSubmit(e) {
        e?.preventDefault();
        setStatus(null);

        if (!file || !desc.trim()) {
            setStatus({ type: 'error', text: t('report.errors.fillAll') || 'Please provide image and description.' });
            return;
        }

        if (!userPosition) {
            setStatus({ type: 'error', text: locationError || 'Unable to get location. Please enable location services.' });
            return;
        }

        setLoading(true);

        try {
            await ContactServices.sendReport({
                description: desc,
                image: file,
                latitude: userPosition.latitude,
                longitude: userPosition.longitude,
            });

            setStatus({ type: 'success', text: t('report.submitted') || 'Report submitted successfully.' });
            setDesc('');
            removeImage();
        } catch (err) {
            setStatus({ type: 'error', text: err.message || t('errors.submitFailed') || 'Submission failed' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="w-full py-12 px-4 md:px-8 bg-background">
            <div className="max-w-6xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-secondary-foreground mb-2">
                        {t('report.sectionTitle') || 'Report an Issue'}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        {t('report.sectionSubtitle') || 'Help us improve the streets by submitting a report with image and description.'}
                    </p>
                </div>

                {/* Form + Image Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
                >
                    {/* Left: Form */}
                    <div className="bg-background p-8 rounded-2xl shadow-lg border border-border flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-secondary-foreground mb-4">
                                {t('report.title') || 'Report a street problem'}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                {t('report.subtitle') || 'Upload an image and short description to report an issue.'}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">
                                        {t('report.description') || 'Description'}
                                    </label>
                                    <Textarea
                                        placeholder={t('report.descriptionPlaceholder') || 'Where is the problem? What is wrong? Any reference point...'}
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        className="bg-background border border-border"
                                        rows={6}
                                        required
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">{desc.length} / 500</div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        type="submit"
                                        disabled={loading || locationLoading}
                                        className="flex-1 sm:flex-none w-full sm:w-auto"
                                    >
                                        {loading ? (
                                            <span className="inline-flex items-center gap-2">
                                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                                </svg>
                                                <span>{t('report.submitting') || 'Submitting...'}</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2">
                                                <Send className="w-4 h-4" />
                                                {t('report.submit') || 'Submit'}
                                            </span>
                                        )}
                                    </Button>
                                </div>

                                {status && (
                                    <div
                                        className={`mt-2 px-3 py-2 rounded-md text-sm ${status.type === 'success'
                                            ? 'bg-green-600/10 text-green-500 border border-green-600/10'
                                            : 'bg-red-600/10 text-red-500 border border-red-600/10'
                                            }`}
                                        role="status"
                                    >
                                        <div className="inline-flex items-center gap-2">
                                            {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                            <span>{status.text}</span>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Right: Image Card */}
                    <div
                        className="h-full min-h-[300px] lg:max-h-[400px] bg-card border border-dashed border-border rounded-2xl overflow-hidden relative flex items-center justify-center cursor-pointer shadow-lg"
                        onClick={openPicker}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') openPicker(); }}
                    >
                        {!preview ? (
                            <div className="text-center px-6">
                                <div className="mb-3 p-3 rounded-full bg-white/6 inline-flex">
                                    <Camera className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div className="text-sm font-medium text-secondary-foreground">
                                    {t('report.clickToUpload') || 'Click to upload image'}
                                </div>
                                <div className="text-xs text-muted-foreground/80 mt-1">
                                    {t('report.supported') || 'PNG, JPG, WEBP — up to 10MB'}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="absolute inset-0">
                                    <Image src={preview} alt="preview" fill style={{ objectFit: 'cover' }} />
                                    <div className="absolute inset-0 bg-black/20" />
                                </div>

                                <button
                                    onClick={(e) => removeImage(e)}
                                    className="absolute top-3 right-3 bg-white/90 rounded-full p-1 shadow hover:scale-105 transition"
                                    aria-label={t('report.removeImage') || 'Remove image'}
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            </>
                        )}

                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onFileChange}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
