'use client';

import { User, Car } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function RoleSelector({ onSelect }) {
    const { t } = useTranslation();
    const roles = [
        { key: 'client', icon: User, label: t('auth.role.client') },
        { key: 'member', icon: Car, label: t('auth.role.member') },
    ];

    return (
        <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
            <p className="text-sm font-medium text-muted-foreground mb-2">{t('auth.iAm')}</p>
            <div className="grid grid-cols-2 gap-3">
                {roles.map(({ key, icon: Icon, label }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => onSelect(key)}
                        className="p-3 rounded-lg border-2 border-border hover:bg-muted transition-colors duration-200"
                    >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-sm font-medium">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
