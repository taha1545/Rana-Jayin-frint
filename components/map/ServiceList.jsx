"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { formatDistance } from "@/utils/mapHelpers";

export default function ServiceList({ services = [], selectedServiceId, onSelect }) {
  if (!Array.isArray(services) || services.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No services found matching your criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {services.map((service) => (
        <Card
          key={service.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
            selectedServiceId === service.id ? 'ring-2 ring-primary shadow-lg' : ''
          }`}
          onClick={() => onSelect?.(service)}
        >
          <CardContent className="p-4">
            <div className="flex space-x-3">
              <img
                src={service.storeImage || '/images/default-store.jpg'}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-secondary-foreground truncate">
                      {service.storeName}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {service.title}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                    service.status === 'available'
                      ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                      : 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                  }`}>
                    {service.status}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{service.rating}</span>
                    <span className="text-xs">({service.reviewCount})</span>
                  </div>
                  {service.distanceKm && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{formatDistance(service.distanceKm)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
