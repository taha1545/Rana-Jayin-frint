"use client";

import React from "react";
import { useTranslation } from '@/hooks/useTranslation';

export default function MapFilters({
  filterType,
  setFilterType,
}) {
  const { t } = useTranslation();
  
  return (
    <div>
      <label className="block text-sm font-medium text-secondary-foreground mb-2">
        {t('map.subtitle') || 'Select Service Type'}
      </label>
      <select
        className="w-full border border-border rounded-lg text-sm p-3 bg-background text-foreground focus:ring-2 focus:ring-primary transition-all"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="all">{t('map.allTypes') || 'All Services'}</option>
        <option value="tire-repair">{t('map.tireRepair') || 'Tire Repair'}</option>
        <option value="battery-boost">{t('map.batteryBoost') || 'Battery Boost'}</option>
        <option value="towing">{t('map.towing') || 'Towing'}</option>
        <option value="fuel-delivery">{t('map.fuelDelivery') || 'Fuel Delivery'}</option>
        <option value="emergency">{t('map.emergency') || 'Emergency'}</option>
      </select>
    </div>
  );
}
