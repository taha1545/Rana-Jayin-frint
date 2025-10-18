"use client";

import React from "react";
import { useTranslation } from '@/hooks/useTranslation';

export default function MapFilters({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  radiusKm,
  setRadiusKm,
}) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('map.searchPlaceholder')}
          className="w-full border border-border rounded-md text-sm p-2 bg-background text-foreground focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <select
          className="border border-border rounded-md text-sm p-2 bg-background text-foreground focus:ring-2 focus:ring-primary"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">{t('map.allTypes')}</option>
          <option value="tire-repair">{t('map.tireRepair')}</option>
          <option value="battery-boost">{t('map.batteryBoost')}</option>
          <option value="towing">{t('map.towing')}</option>
          <option value="fuel-delivery">{t('map.fuelDelivery')}</option>
          <option value="emergency">{t('map.emergency')}</option>
        </select>

        <select
          className="border border-border rounded-md text-sm p-2 bg-background text-foreground focus:ring-2 focus:ring-primary"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="available">{t('map.available')}</option>
          <option value="busy">{t('map.busy')}</option>
          <option value="all">{t('map.allStatus')}</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-secondary-foreground">{t('map.radiusKm')}</label>
        <input
          type="number"
          min={1}
          max={200}
          step={1}
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value) || 1)}
          className="mt-1 w-full border border-border rounded-md text-sm p-2 bg-background text-foreground focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  );
}
