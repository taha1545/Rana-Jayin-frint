'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useGeolocation } from '@/hooks/useGeolocation';
import { attachDistance, filterByRadius, filterByStatus, filterByType, sortByDistance, formatDistance } from '@/utils/mapHelpers';
import { MapPin, Users, Car, Phone, Star, Navigation, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MapFilters from '@/components/map/MapFilters';
import ServiceList from '@/components/map/ServiceList';
import SelectedServiceCard from '@/components/map/SelectedServiceCard';
import { useTranslation } from '@/hooks/useTranslation';

//
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
      </div>
    </div>
  )
});
// 
const SAMPLE_SERVICES = [
  {
    id: 1,
    title: 'Emergency Tire Repair',
    storeName: 'AutoFix Pro',
    type: 'tire-repair',
    status: 'available',
    rating: 4.8,
    reviewCount: 124,
    location: [36.7525, 3.0419],
    phone: '+213555123456',
    storeImage: '/images/autofix-pro.jpg',
    member: {
      name: 'Ali Ahmed',
      completedJobs: 124,
      rating: 4.9
    },
    services: ['tire-repair', 'battery-boost'],
    description: '24/7 emergency tire repair services with mobile support',
    openingHours: '24/7',
    priceRange: '$$'
  },
  {
    id: 2,
    title: 'Battery Boost Service',
    storeName: 'PowerUp Auto',
    type: 'battery-boost',
    status: 'available',
    rating: 4.6,
    reviewCount: 89,
    location: [36.7645, 3.0527],
    phone: '+213555123457',
    storeImage: '/images/powerup-auto.jpg',
    member: {
      name: 'Karim Ben',
      completedJobs: 89,
      rating: 4.7
    },
    services: ['battery-boost', 'towing'],
    description: 'Quick battery jump-start and replacement services',
    openingHours: '6:00 AM - 10:00 PM',
    priceRange: '$$'
  },
  {
    id: 3,
    title: '24/7 Towing Service',
    storeName: 'Quick Tow',
    type: 'towing',
    status: 'busy',
    rating: 4.9,
    reviewCount: 203,
    location: [36.7589, 3.0472],
    phone: '+213555123458',
    storeImage: '/images/quick-tow.jpg',
    member: {
      name: 'Mohammed Said',
      completedJobs: 203,
      rating: 4.9
    },
    services: ['towing', 'emergency'],
    description: 'Heavy duty towing and recovery services',
    openingHours: '24/7',
    priceRange: '$$$'
  }
];
// 
export default function MapPage() {
  //
  const { t } = useTranslation();
  // 
  const [filterType, setFilterType] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  //
  const { location: userPosition, error: locationError, loading: locationLoading, refetch: refetchLocation } = useGeolocation();
  // 
  const filteredServices = useMemo(() => {
    let list = [...SAMPLE_SERVICES];
    // 
    if (filterType !== 'all') {
      list = filterByType(list, filterType);
    }
    // 
    list = filterByStatus(list, 'available');
    // 
    if (userPosition) {
      list = attachDistance(list, userPosition);
      list = sortByDistance(list);
    }
    return list;
  }, [filterType, userPosition]);
  //
  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };
  //
  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };
  //
  const handleOrder = (service) => {
    return;
  };
  //
  const handleDirections = (service) => {
    if (!service?.location) return;
    const [lat, lng] = service.location;
    const origin = userPosition ? `&origin=${userPosition.latitude},${userPosition.longitude}` : '';
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}${origin}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-row h-screen">
        {/* Map Section - Always on left */}
        <div className="relative flex-1 h-full">
          <MapComponent
            services={filteredServices}
            userPosition={userPosition}
            onMarkerClick={handleServiceSelect}
            focusTarget={selectedService ? { type: 'service', id: selectedService.id, location: selectedService.location } : null}
          />
        </div>
        {/* Sidebar Section - Always on right */}
        <aside className="w-full sm:w-[380px] md:w-[420px] lg:w-[480px] xl:w-[520px] bg-background border-l border-border overflow-y-auto flex flex-col">
          <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 flex-1 flex flex-col">

            {/* Filters Section */}
            <div>
              <h3 className="text-xl font-bold text-secondary-foreground mb-3">
                {t('map.title') || 'Find Services'}
              </h3>
              <MapFilters
                filterType={filterType}
                setFilterType={setFilterType}
              />
            </div>

            {/* Location  */}
            {(locationLoading || locationError || userPosition) && (
              <Card className={locationError ? "border-red-200 bg-red-50 dark:bg-red-900/20" : "border-green-200 bg-green-50 dark:bg-green-900/20"}>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    {locationLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span className="text-sm">{t('map.gettingYourLocation') || 'Getting location...'}</span>
                      </>
                    ) : locationError ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-red-800 dark:text-red-200 truncate">
                            {t('map.locationAccessRequired') || 'Location access required'}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0"
                          onClick={refetchLocation}
                        >
                          <Navigation className="w-3 h-3" />
                        </Button>
                      </>
                    ) : userPosition ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          {t('map.locationActive') || 'Location active'}
                        </p>
                      </>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services  */}
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-semibold text-secondary-foreground">
                {userPosition ? t('map.nearestServices') || 'Nearest Services' : t('map.availableServices') || 'Available Services'}
              </h3>
              <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'}
              </span>
            </div>

            {/* Services List */}
            <div className="flex-1 overflow-y-auto -mx-4 px-4 lg:-mx-6 lg:px-6">
              <ServiceList
                services={filteredServices}
                selectedServiceId={selectedService?.id}
                onSelect={handleServiceSelect}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Selected Service Card - Fixed overlay on all devices */}
      {selectedService && (
        <>
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedService(null)}
          />

          {/* Selected Service Card - Centered on all screens */}
          <div className="fixed inset-x-4 sm:right-6 sm:left-auto top-6 bottom-6 sm:w-[400px] md:w-[450px] lg:w-[480px] xl:w-[520px] z-50">
            <SelectedServiceCard
              service={selectedService}
              onCall={() => handleCall(selectedService.phone)}
              onOrder={() => handleOrder(selectedService)}
              onDirections={() => handleDirections(selectedService)}
              onClose={() => setSelectedService(null)}
            />
          </div>
        </>
      )}
    </div>
  );
}