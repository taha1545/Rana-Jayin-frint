"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Phone, X, Navigation, ShoppingCart, MapPin, Clock, DollarSign } from "lucide-react";
import { formatDistance } from "@/utils/mapHelpers";

export default function SelectedServiceCard({ service, onCall, onOrder, onDirections, onClose }) {
  //
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  //
  if (!service) return null;
  // 
  const images = service.images || [service.storeImage || '/images/default-store.jpg'];
  //
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  //
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Card className="border-2 border-primary shadow-xl flex flex-col h-full">
      {/* Header with close button */}
      <CardHeader className="relative pb-3">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 text-muted-foreground hover:text-secondary-foreground bg-white dark:bg-gray-800 rounded-full p-1 shadow-md transition-all hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>
        <CardTitle className="text-xl font-bold text-secondary-foreground pr-10">
          {service.storeName}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{service.title}</p>
      </CardHeader>

      {/* Scrollable content area */}
      <CardContent className="flex-1 overflow-y-auto space-y-4 pb-4">
        {/* Image Gallery */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={images[currentImageIndex]}
            alt={`${service.storeName} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
              >
                →
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Status and Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-lg">{service.rating}</span>
            <span className="text-sm text-muted-foreground">({service.reviewCount} reviews)</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${service.status === 'available'
            ? 'text-green-700 bg-green-100 dark:bg-green-900/30'
            : 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30'
            }`}>
            {service.status?.charAt(0).toUpperCase() + service.status?.slice(1)}
          </span>
        </div>

        {/* Store Information Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <Phone className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
            <div>
              <p className="font-medium text-muted-foreground">Phone</p>
              <p className="font-mono text-secondary-foreground">{service.phone}</p>
            </div>
          </div>

          {service.member?.name && (
            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 mt-0.5 text-primary flex-shrink-0">👤</div>
              <div>
                <p className="font-medium text-muted-foreground">Provider</p>
                <p className="text-secondary-foreground">{service.member.name}</p>
              </div>
            </div>
          )}

          {service.member?.completedJobs && (
            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 mt-0.5 text-primary flex-shrink-0">✓</div>
              <div>
                <p className="font-medium text-muted-foreground">Jobs Done</p>
                <p className="text-secondary-foreground">{service.member.completedJobs}</p>
              </div>
            </div>
          )}

          {typeof service.distanceKm === 'number' && (
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-muted-foreground">Distance</p>
                <p className="text-secondary-foreground font-semibold">{formatDistance(service.distanceKm)}</p>
              </div>
            </div>
          )}

          {service.openingHours && (
            <div className="flex items-start space-x-2 col-span-2">
              <Clock className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-muted-foreground">Hours</p>
                <p className="text-secondary-foreground">{service.openingHours}</p>
              </div>
            </div>
          )}

          {service.priceRange && (
            <div className="flex items-start space-x-2 col-span-2">
              <DollarSign className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-muted-foreground">Price Range</p>
                <p className="text-secondary-foreground">{service.priceRange}</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {service.description && (
          <div className="pt-2">
            <p className="font-medium text-muted-foreground mb-1">About</p>
            <p className="text-sm text-secondary-foreground leading-relaxed">{service.description}</p>
          </div>
        )}
      </CardContent>

      {/* Fixed Action Buttons at Bottom */}
      <div className="p-4 border-t border-border bg-background space-y-2">
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={onOrder}
          size="lg"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Order Now
        </Button>
        <Button
          className="w-full h-12 text-base font-semibold"
          variant="secondary"
          onClick={onDirections}
          size="lg"
        >
          <Navigation className="w-5 h-5 mr-2" />
          Get Directions
        </Button>
        <Button
          className="w-full h-12 text-base font-semibold"
          variant="outline"
          onClick={onCall}
          size="lg"
        >
          <Phone className="w-5 h-5 mr-2" />
          Call Now
        </Button>
      </div>
    </Card>
  );
}
