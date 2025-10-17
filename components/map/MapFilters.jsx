"use client";

import React from "react";

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
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search services, stores, providers..."
          className="w-full border border-border rounded-md text-sm p-2 bg-background text-foreground focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <select
          className="border border-border rounded-md text-sm p-2 bg-background text-foreground focus:ring-2 focus:ring-primary"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="tire-repair">Tire Repair</option>
          <option value="battery-boost">Battery Boost</option>
          <option value="towing">Towing</option>
          <option value="fuel-delivery">Fuel Delivery</option>
          <option value="emergency">Emergency</option>
        </select>

        <select
          className="border border-border rounded-md text-sm p-2 bg-background text-foreground focus:ring-2 focus:ring-primary"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="all">All Status</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-secondary-foreground">Radius (km)</label>
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
