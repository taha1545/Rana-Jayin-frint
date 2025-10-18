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
const SAMPLE_MEMBERS = [
  {
    id: 1,
    name: 'Ali Ahmed',
    status: 'online',
    rating: 4.9,
    completedJobs: 124,
    location: [36.7525, 3.0419],
    avatar: '/images/ali-ahmed.jpg',
    services: ['tire-repair', 'battery-boost']
  },
  {
    id: 2,
    name: 'Karim Ben',
    status: 'online',
    rating: 4.7,
    completedJobs: 89,
    location: [36.7645, 3.0527],
    avatar: '/images/karim-ben.jpg',
    services: ['battery-boost', 'towing']
  }
];
// main
export default function MapPage() {
  const { t } = useTranslation();
  
  // sidebar state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('available');
  const [radiusKm, setRadiusKm] = useState(25);
  const [selectedService, setSelectedService] = useState(null);

  // geolocation
  const { location: userPosition, error: locationError, loading: locationLoading, refetch: refetchLocation } = useGeolocation();

  // apply filters + distance
  const filteredServices = useMemo(() => {
    let list = [...SAMPLE_SERVICES];

    // basic text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((s) =>
        s.title.toLowerCase().includes(q) ||
        s.storeName.toLowerCase().includes(q) ||
        (s.member?.name || '').toLowerCase().includes(q)
      );
    }

    // type filter
    if (filterType !== 'all') {
      list = filterByType(list, filterType);
    }

    // status filter (default available)
    if (filterStatus !== 'all') {
      list = filterByStatus(list, filterStatus);
    }

    // distance enrichment + nearest within radius
    if (userPosition) {
      list = attachDistance(list, userPosition);
      list = filterByRadius(list, radiusKm);
      list = sortByDistance(list);
    }

    return list;
  }, [searchQuery, filterType, filterStatus, radiusKm, userPosition]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleOrder = (service) => {
    const message = `Hello, I'd like to order your ${service.title} service from ${service.storeName}.`;
    window.open(`https://wa.me/${service.phone.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDirections = (service) => {
    if (!service?.location) return;
    const [lat, lng] = service.location;
    const origin = userPosition ? `&origin=${userPosition.latitude},${userPosition.longitude}` : '';
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}${origin}`;
    window.open(url, '_blank');
  };
  //
  return (
    <div className="min-h-screen m-3 bg-background">
      {/* Main Content */}
      <div className="flex h-[calc(100vh-120px)]">
        <div className="flex-1 relative">
          <MapComponent
            services={filteredServices}
            members={SAMPLE_MEMBERS}
            userPosition={userPosition}
            onMarkerClick={handleServiceSelect}
            focusTarget={selectedService ? { type: 'service', id: selectedService.id, location: selectedService.location } : null}
          />
        </div>

        {/* Sidebar Section */}
        <aside className="w-full md:w-96 bg-background border-l border-border overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Filters */}
            <h3 className="text-lg font-semibold text-secondary-foreground">{t('map.filters')}</h3>
            <MapFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterType={filterType}
              setFilterType={setFilterType}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              radiusKm={radiusKm}
              setRadiusKm={setRadiusKm}
            />

            {/* Location Status */}
            <Card className={locationError ? "border-red-200 bg-red-50 dark:bg-red-900/20" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  {locationLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      <span className="text-sm">{t('map.gettingYourLocation')}</span>
                    </>
                  ) : locationError ? (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">
                          {t('map.locationAccessRequired')}
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                          {locationError}
                        </p>
                        <Button
                          size="sm"
                          className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                          onClick={refetchLocation}
                        >
                          <Navigation className="w-3 h-3 mr-1" />
                          {t('map.enableLocation')}
                        </Button>
                      </div>
                    </>
                  ) : userPosition ? (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          {t('map.locationActive')}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-300">
                          {t('map.showingNearestServices')}
                        </p>
                      </div>
                    </>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Car className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t('map.services')}</p>
                      <p className="text-xl font-bold text-secondary-foreground">{filteredServices.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t('map.providers')}</p>
                      <p className="text-xl font-bold text-secondary-foreground">{SAMPLE_MEMBERS.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Services List */}
            <section>
              <h3 className="text-lg font-semibold text-secondary-foreground mb-3">
                {userPosition ? t('map.nearestServices') : t('map.availableServices')}
              </h3>
              <ServiceList
                services={filteredServices}
                selectedServiceId={selectedService?.id}
                onSelect={handleServiceSelect}
                onCall={handleCall}
                onWhatsApp={handleOrder}
                onDirections={handleDirections}
              />
            </section>

            {/* Selected Service Details */}
            {selectedService && (
              <SelectedServiceCard
                service={selectedService}
                onCall={() => handleCall(selectedService.phone)}
                onOrder={() => handleOrder(selectedService)}
                onDirections={() => handleDirections(selectedService)}
                onClose={() => setSelectedService(null)}
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}