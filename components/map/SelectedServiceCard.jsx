"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  Phone,
  X,
  Navigation,
  ShoppingCart,
  Clock,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import RequestServices from "@/services/RequestServices";

export default function SelectedServiceCard({
  service,
  token,
  onCall,
  onDirections,
  onClose,
}) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const { user, loadingUser, error } = useUser(token);

  if (!service) return null;

  const store = service;
  const owner = store.member || {};
  const images =
    store.images?.length > 0
      ? store.images
      : [store.storeImage || "/images/default-store.jpg"];
  const reviews = store.reviews || [];

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  // 
  const handleOrder = async () => {
    if (loadingUser) {
      alert("Checking your session, please wait...");
      return;
    }

    if (!token) {
      alert("You need to log in first.");
      router.push("/auth/login");
      return;
    }

    if (!user || error) {
      alert("Invalid or expired session. Please log in again.");
      router.push("/auth/login");
      return;
    }

    setLoadingOrder(true);

    try {
      const payload = {
        storeId: store.id,
        clientId: user.id,
        serviceType: store.serviceType,
        latitude: store.location?.[0],
        longitude: store.location?.[1],
      };
      console.log(payload)

      const res = await RequestServices.createRequest(payload, token);

      if (res?.success) {
        router.push(`/request/${res.data.id}`);
      } else {
        alert("Failed to create request. Please try again.");
      }
    } catch (err) {
      console.error("Error creating request:", err);
      alert("An error occurred while creating your request.");
    } finally {
      setLoadingOrder(false);
    }
  };

  return (
    <Card className="border-2 border-primary shadow-xl flex flex-col h-full">
      {/* Header */}
      <CardHeader className="relative pb-3">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 text-muted-foreground hover:text-secondary-foreground bg-white dark:bg-gray-800 rounded-full p-1 shadow-md transition-all hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>
        <CardTitle className="text-xl font-bold text-secondary-foreground pr-10">
          {store.storeName || "Unknown Store"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {store.title || store.type || "Service"}
        </p>
      </CardHeader>

      {/* Scrollable content */}
      <CardContent className="flex-1 overflow-y-auto space-y-4 pb-4">
        {/* Image gallery */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={images[currentImageIndex]}
            alt={`${store.storeName} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              >
                →
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex
                      ? "bg-white w-4"
                      : "bg-white/50"
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Rating & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-lg">{store.rating || 0}</span>
            <span className="text-sm text-muted-foreground">
              ({reviews.length} reviews)
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${store.status === "available"
              ? "text-green-700 bg-green-100 dark:bg-green-900/30"
              : "text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30"
              }`}
          >
            {store.status === "available" ? "Available" : "Busy"}
          </span>
        </div>

        {/* Store Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {owner.name && (
            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 mt-0.5 flex-shrink-0">👤</div>
              <div>
                <p className="font-medium text-muted-foreground">Provider</p>
                <p className="text-secondary-foreground">{owner.name}</p>
              </div>
            </div>
          )}

          {owner.phone && (
            <div className="flex items-start space-x-2">
              <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
              <div>
                <p className="font-medium text-muted-foreground">Phone</p>
                <p className="text-secondary-foreground">{owner.phone}</p>
              </div>
            </div>
          )}

          {store.priceRange && (
            <div className="flex items-start space-x-2 col-span-2">
              <DollarSign className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
              <div>
                <p className="font-medium text-muted-foreground">
                  Price Range
                </p>
                <p className="text-secondary-foreground">{store.priceRange}</p>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
            <div>
              <p className="font-medium text-muted-foreground">Distance</p>
              <p className="text-secondary-foreground">
                {store.distanceKm?.toFixed(1)} km
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {store.description && (
          <div className="pt-2">
            <p className="font-medium text-muted-foreground mb-1">About</p>
            <p className="text-sm text-secondary-foreground leading-relaxed">
              {store.description}
            </p>
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="pt-2">
            <p className="font-medium text-muted-foreground mb-1">Reviews</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{rev.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      by {rev.client?.name || "Anonymous"}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-foreground">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Bottom Buttons */}
      <div className="p-4 border-t border-border bg-background space-y-2">
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={handleOrder}
          size="lg"
          disabled={loadingOrder || loadingUser}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {loadingOrder ? "Ordering..." : "Order Now"}
        </Button>
        <Button
          className="w-full h-12 text-base font-semibold"
          variant="secondary"
          onClick={onDirections}
          size="lg"
        >
          <Navigation className="w-5 h-5 mr-2" /> Get Directions
        </Button>
        <Button
          className="w-full h-12 text-base font-semibold"
          variant="outline"
          onClick={onCall}
          size="lg"
        >
          <Phone className="w-5 h-5 mr-2" /> Call Now
        </Button>
      </div>
    </Card>
  );
}
