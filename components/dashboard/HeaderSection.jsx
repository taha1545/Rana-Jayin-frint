'use client';

import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export default function HeaderSection({ profile, isActive, handleStatusToggle, t }) {
  return (
    <motion.section
      className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl border shadow-sm bg-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className='space-y-2'>
          <h2 className="text-xl font-semibold">{profile.storeName}</h2>
          <p className="text-sm text-muted-foreground">{profile.phone}</p>
          <Badge variant={isActive ? 'success' : 'destructive'}>
            {isActive ? t('dashboard.active', { defaultValue: 'Active' }) : t('dashboard.inactive', { defaultValue: 'Inactive' })}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Label className="text-sm">{t('dashboard.status', { defaultValue: 'Status' })}</Label>
        <Switch checked={isActive} onCheckedChange={handleStatusToggle} />
      </div>
    </motion.section>
  );
}
