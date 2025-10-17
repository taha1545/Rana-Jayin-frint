'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Camera, Edit, Save, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsSection({
    profile,
    editing,
    setEditing,
    handleSaveProfile,
    handleImageUpload,
    setProfile,
    t,
}) {
    const [tempProfile, setTempProfile] = useState(profile);
    // 
    const handleSave = () => {
        if (!tempProfile.ownerName || !tempProfile.storeName || !tempProfile.phone) {
            return;
        }
        setProfile(tempProfile);
        handleSaveProfile();
    };
    // 
    const handleCancel = () => {
        setTempProfile(profile);
        setEditing(false);
    };
    // 
    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files || []);
        const newImages = files.map((file) => URL.createObjectURL(file));
        setTempProfile((prev) => ({
            ...prev,
            images: [...(prev.images || []), ...newImages],
        }));
        handleImageUpload(e);
    };

    return (
        <section className="mt-10">
            <Card className="border border-border shadow-sm hover:shadow-md transition-all">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Settings className="w-5 h-5 text-primary" />
                        {t('dashboard.settings', { defaultValue: 'Account Settings' })}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <AnimatePresence mode="wait">
                        {editing ? (
                            <motion.div
                                key="edit-mode"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-6"
                            >
                                {/* Editable fields */}
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            {t('form.name', { defaultValue: 'Name' })}
                                        </Label>
                                        <Input
                                            id="name"
                                            value={tempProfile.ownerName}
                                            onChange={(e) =>
                                                setTempProfile({ ...tempProfile, ownerName: e.target.value })
                                            }
                                            placeholder={t('form.namePlaceholder', { defaultValue: 'Enter your name' })}
                                            className="h-10 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="store" className="text-sm font-medium">
                                            {t('form.storeName', { defaultValue: 'Store Name' })}
                                        </Label>
                                        <Input
                                            id="store"
                                            value={tempProfile.storeName}
                                            onChange={(e) =>
                                                setTempProfile({ ...tempProfile, storeName: e.target.value })
                                            }
                                            placeholder={t('form.storePlaceholder', { defaultValue: 'Enter store name' })}
                                            className="h-10 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-medium">
                                            {t('form.phone', { defaultValue: 'Phone' })}
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={tempProfile.phone}
                                            onChange={(e) =>
                                                setTempProfile({ ...tempProfile, phone: e.target.value })
                                            }
                                            placeholder="+213 555 123 456"
                                            className="h-10 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="password" className="text-sm font-medium">
                                            {t('form.password', { defaultValue: 'Password' })}
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-10 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                                        />
                                    </div>
                                </div>
                                {/* Image upload */}
                                <div>
                                    <Label>{t('form.storeImages', { defaultValue: 'Store Images' })}</Label>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-3">
                                        {tempProfile.images && tempProfile.images.length > 0 ? (
                                            tempProfile.images.map((img, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="relative"
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`store-${idx}`}
                                                        className="w-full h-24 sm:h-28 object-cover rounded-lg border"
                                                    />
                                                </motion.div>
                                            ))
                                        ) : (
                                            <p className="col-span-full text-sm text-muted-foreground">
                                                {t('form.noImages', { defaultValue: 'No images uploaded yet.' })}
                                            </p>
                                        )}
                                        <label className="w-full h-24 sm:h-28 flex flex-col items-center justify-center rounded-lg border border-dashed cursor-pointer hover:bg-muted/40 transition">
                                            <Camera className="w-6 h-6 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground mt-1">
                                                {t('actions.upload', { defaultValue: 'Upload' })}
                                            </span>
                                            <input type="file" multiple className="hidden" onChange={handleImageSelect} />
                                        </label>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button onClick={handleSave} className="flex items-center gap-1">
                                        <Save className="w-4 h-4" />
                                        {t('actions.save', { defaultValue: 'Save Changes' })}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                        className="flex items-center gap-1"
                                    >
                                        <X className="w-4 h-4" />
                                        {t('actions.cancel', { defaultValue: 'Cancel' })}
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="view-mode"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-4"
                            >
                                <p className="text-sm text-muted-foreground">
                                    {t('dashboard.manageInfo', {
                                        defaultValue: 'Manage your store and personal information.',
                                    })}
                                </p>

                                <div className="grid gap-2 text-sm space-y-3 ">
                                    <p>
                                        <strong>{t('form.name', { defaultValue: 'Name' })}:</strong> {profile.ownerName}
                                    </p>
                                    <p>
                                        <strong>{t('form.storeName', { defaultValue: 'Store' })}:</strong> {profile.storeName}
                                    </p>
                                    <p>
                                        <strong>{t('form.phone', { defaultValue: 'Phone' })}:</strong> {profile.phone}
                                    </p>
                                    <p>
                                        <strong>{t('form.email', { defaultValue: 'Email' })}:</strong> {profile.email}
                                    </p>
                                </div>

                                {/* Images */}
                                {profile.images?.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-3">
                                        {profile.images.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`store-${idx}`}
                                                className="w-full h-24 sm:h-28 object-cover rounded-lg border"
                                            />
                                        ))}
                                    </div>
                                )}

                                <Button className="mt-12 flex items-center gap-1" onClick={() => setEditing(true)}>
                                    <Edit className="w-4 h-4" />
                                    {t('actions.editProfile', { defaultValue: 'Edit Profile' })}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </section>
    );
}
