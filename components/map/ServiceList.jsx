"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Phone } from "lucide-react";
import { formatDistance } from "@/utils/mapHelpers";

export default function ServiceList({ services = [], selectedServiceId, onSelect, onCall, onWhatsApp, onDirections }) {
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
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${selectedServiceId === service.id ? 'ring-2 ring-primary' : ''}`}
          onClick={() => onSelect?.(service)}
        >
          <CardContent className="p-4">
            <div className="flex space-x-3">
              <img
                src={service.storeImage || '/images/default-store.jpg'}
                alt={service.storeName}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0">
                    <h4 className="font-medium text-secondary-foreground truncate">
                      {service.storeName}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {service.title}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${service.status === 'available'
                    ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                    : 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                    }`}>
                    {service.status}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{service.rating}</span>
                    <span>({service.reviewCount})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{service.distanceKm ? formatDistance(service.distanceKm) : 'Nearby'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    By: {service.member?.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCall?.(service.phone);
                      }}
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDirections?.(service);
                      }}
                    >
                      🧭 Directions
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onWhatsApp?.(service);
                      }}
                    >
                      💬 WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
