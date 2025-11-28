'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Camera, Edit, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsSection({
    memberData,
    storeData,
    setMemberData,
    setStoreData,
    t,
    updateMember,
    updateStore,
    addStoreImage,
    deleteStoreImage,
}) {
    const [editingMember, setEditingMember] = useState(false);
    const [editingStore, setEditingStore] = useState(false);
    const [tempMember, setTempMember] = useState(memberData);
    const [tempStore, setTempStore] = useState(storeData);

    const handleSaveMember = async () => {
        const res = await updateMember(tempMember);
        if (res.success) {
            setMemberData(tempMember);
            setEditingMember(false);
        } else alert(res.message || t('errors.updateFailed'));
    };

    const handleSaveStore = async () => {
        const { id, images, storeName, ...rest } = tempStore;

        const payload = {
            ...rest,
            name: storeName,
        };

        const res = await updateStore(id, payload);

        if (res.success) {
            setStoreData({
                ...tempStore,
                name: storeName,
            });
            setEditingStore(false);
        } else {
            alert(res.message || t('errors.updateFailed'));
        }
    };

    const handleImageSelect = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        for (const file of files) {
            if (!file) continue;

            try {
                const res = await addStoreImage(tempStore.id, file);
                if (res.success) {
                    setTempStore((prev) => ({
                        ...prev,
                        images: [...(prev.images || []), res.data],
                    }));
                } else {
                    alert(res.message || t('errors.uploadFailed'));
                }
            } catch (err) {
                console.error(err);
                alert(err.message || t('errors.uploadFailed'));
            }
        }
    };

    const handleDeleteImage = async (imageId) => {
        const res = await deleteStoreImage(imageId);
        if (res.success) {
            setTempStore((prev) => ({
                ...prev,
                images: prev.images.filter((img) => img.id !== imageId),
            }));
        } else alert(res.message || t('errors.deleteFailed'));
    };

    return (
        <section className="mt-10 px-4 sm:px-6 lg:px-8">
            <Card className="w-full border border-border shadow-sm hover:shadow-md transition-all">
                <CardHeader>
                    <CardTitle>{t('dashboard.storeAndMemberInfo')}</CardTitle>
                </CardHeader>

                {/* Main Content */}
                <CardContent className="space-y-8">

                    {/* MEMBER INFO */}
                    <div className="space-y-4 p-4 border-b border-border">
                        <h3 className="font-semibold">{t('dashboard.memberInfo')}</h3>

                        <AnimatePresence mode="wait">
                            {editingMember ? (
                                <motion.div
                                    key="edit-member"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    <div className="flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0 space-y-3">
                                        <div className="flex-1">
                                            <Label>{t('form.name')}</Label>
                                            <Input
                                                value={tempMember.name}
                                                onChange={(e) =>
                                                    setTempMember({ ...tempMember, name: e.target.value })
                                                }
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <Label>{t('form.phone')}</Label>
                                            <Input
                                                value={tempMember.phone}
                                                onChange={(e) =>
                                                    setTempMember({ ...tempMember, phone: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button onClick={handleSaveMember} className="flex items-center gap-1">
                                            <Save className="w-4 h-4" /> {t('actions.update')}
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="view-member"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-3"
                                >
                                    <p><strong>{t('form.name')}:</strong> {memberData.name}</p>
                                    <p><strong>{t('form.phone')}:</strong> {memberData.phone}</p>

                                    <Button
                                        onClick={() => setEditingMember(true)}
                                        className="mt-2 flex items-center gap-1"
                                    >
                                        <Edit className="w-4 h-4" /> {t('actions.edit')}
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* STORE INFO */}
                    <div className="space-y-4 p-4 border-b border-border">
                        <h3 className="font-semibold">{t('dashboard.storeInfo')}</h3>

                        <AnimatePresence mode="wait">
                            {editingStore ? (
                                <motion.div
                                    key="edit-store"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    <div className="flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0 space-y-3">
                                        <div className="flex-1">
                                            <Label>{t('form.storeName')}</Label>
                                            <Input
                                                value={tempStore.storeName}
                                                onChange={(e) =>
                                                    setTempStore({ ...tempStore, storeName: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0 space-y-3">
                                        <div className="flex-1">
                                            <Label>{t('form.priceRange')}</Label>
                                            <Input
                                                value={tempStore.priceRange}
                                                onChange={(e) =>
                                                    setTempStore({ ...tempStore, priceRange: e.target.value })
                                                }
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <Label>{t('form.isActive')}</Label>
                                            <Input value={tempStore.isActive ? 'Yes' : 'No'} readOnly />
                                        </div>
                                    </div>

                                    <div>
                                        <Label>{t('form.description')}</Label>
                                        <Input
                                            value={tempStore.description || ''}
                                            onChange={(e) =>
                                                setTempStore({ ...tempStore, description: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <Button onClick={handleSaveStore} className="flex items-center gap-1">
                                            <Save className="w-4 h-4" /> {t('actions.update')}
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="view-store"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-3"
                                >
                                    <p><strong>{t('form.storeName')}:</strong> {storeData.storeName}</p>
                                    <p><strong>{t('form.priceRange')}:</strong> {storeData.priceRange}</p>
                                    <p><strong>{t('form.isActive')}:</strong> {storeData.isActive ? 'Yes' : 'No'}</p>
                                    <p><strong>{t('form.description')}:</strong> {storeData.description || 'N/A'}</p>

                                    <Button
                                        onClick={() => setEditingStore(true)}
                                        className="mt-2 flex items-center gap-1"
                                    >
                                        <Edit className="w-4 h-4" /> {t('actions.edit')}
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* STORE IMAGES */}
                    <div className="space-y-4 p-4">
                        <h3 className="font-semibold">{t('dashboard.storeImages')}</h3>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {storeData.images?.map((img) => (
                                <div key={img.id} className="relative">
                                    <img
                                        src={`${(process.env.NEXT_PUBLIC_API_URL || process.env.API_URL)
                                            .replace(/\/api\/v1\/?$/, '')
                                            .replace(/\/$/, '')}/${img.imageUrl}`}
                                        alt={`store-${img.id}`}
                                        className="w-full h-24 sm:h-28 object-cover rounded-lg border"
                                    />

                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-1 right-1 w-6 h-6 p-0 flex items-center justify-center rounded-full"
                                        onClick={() => handleDeleteImage(img.id)}
                                    >
                                        X
                                    </Button>
                                </div>
                            ))}

                            {/* Add Image */}
                            <label className="flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-muted/30">
                                <Camera className="w-4 h-4" />
                                <input type="file" multiple className="hidden" onChange={handleImageSelect} />
                            </label>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </section>
    );
}
