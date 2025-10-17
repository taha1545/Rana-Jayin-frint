"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Phone, X } from "lucide-react";
import { formatDistance } from "@/utils/mapHelpers";

export default function SelectedServiceCard({ service, onCall, onOrder, onDirections, onClose }) {
  if (!service) return null;
  return (
    <Card className="border-primary sticky bottom-4">
      <CardHeader className="relative">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-2 top-2 text-muted-foreground hover:text-secondary-foreground"
        >
          <X className="w-5 h-5" />
        </button>
        <CardTitle className="flex items-center space-x-3 pr-8">
          <img
            src={service.storeImage || '/images/default-store.jpg'}
            alt={service.storeName}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <div className="truncate text-base font-semibold">{service.storeName}</div>
            <div className="text-sm font-normal text-muted-foreground truncate">
              {service.title}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Status</span>
            <p className={`font-medium ${service.status === 'available' ? 'text-green-600' : 'text-yellow-600'}`}>
              {service.status?.charAt(0).toUpperCase() + service.status?.slice(1)}
            </p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Rating</span>
            <p className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{service.rating} ({service.reviewCount})</span>
            </p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Provider</span>
            <p>{service.member?.name}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Completed Jobs</span>
            <p>{service.member?.completedJobs}</p>
          </div>
          {typeof service.distanceKm === 'number' && (
            <div className="col-span-2">
              <span className="font-medium text-muted-foreground">Distance</span>
              <p>{formatDistance(service.distanceKm)}</p>
            </div>
          )}
          <div className="col-span-2">
            <span className="font-medium text-muted-foreground">Phone</span>
            <p className="font-mono">{service.phone}</p>
          </div>
          {service.description && (
            <div className="col-span-2">
              <span className="font-medium text-muted-foreground">Description</span>
              <p className="text-sm">{service.description}</p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border space-y-2">
          <Button className="w-full" onClick={onCall}>
            <Phone className="w-4 h-4 mr-2" />
            Call Now
          </Button>
          <Button className="w-full" variant="secondary" onClick={onDirections}>
            🧭 Directions
          </Button>
          <Button variant="outline" className="w-full" onClick={onOrder}>
            💬 WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
