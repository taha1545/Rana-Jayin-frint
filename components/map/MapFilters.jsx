"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

const AllTypeServices = [
  { key: "all", label: "All Services" },
  { key: "onSiteRepair", label: "On-Site Repair" },
  { key: "towingService", label: "Towing Service" },
  { key: "batteryBoost", label: "Battery Boost" },
  { key: "emergencySupport", label: "Emergency Support" },
  { key: "fuelDelivery", label: "Fuel Delivery" },
  { key: "safetyCheck", label: "Safety Check" },
  { key: "accidentAssistance", label: "Accident Assistance" },
  { key: "quickResponse", label: "Quick Response" },
];

export default function MapFilters({ filterType, setFilterType }) {
  const { t } = useTranslation();

  return (
    <div>
      <label className="block text-sm font-medium text-secondary-foreground mb-2">
        {t("map.subtitle") || "Select Service Type"}
      </label>

      <select
        className="w-full border border-border rounded-lg text-sm p-3 bg-background text-foreground focus:ring-2 focus:ring-primary transition-all"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        {AllTypeServices.map((service) => (
          <option key={service.key} value={service.key}>
            {t(`map.${service.key}`) || service.label}
          </option>
        ))}
      </select>
    </div>
  );
}
