'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useGeolocation } from '@/hooks/useGeolocation';
import { attachDistance, sortByDistance } from '@/utils/mapHelpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MapFilters from '@/components/map/MapFilters';
import ServiceList from '@/components/map/ServiceList';
import SelectedServiceCard from '@/components/map/SelectedServiceCard';
import { AlertCircle, Navigation } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useSearchParams } from 'next/navigation';
import StoreServices from '@/services/StoreServices';

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
  ),
});

export default function MapPage() {
  const { t } = useTranslation();
  const [filterType, setFilterType] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  const {
    location: userPosition,
    error: locationError,
    loading: locationLoading,
    refetch: refetchLocation,
  } = useGeolocation();

  useEffect(() => {
    const urlType = searchParams.get('type');
    if (urlType) {
      setFilterType(urlType);
    }
  }, [searchParams]);


  // 
  useEffect(() => {
    const fetchStores = async () => {
      if (!userPosition) return;
      setLoadingServices(true);
      setError(null);

      try {
        const res = await StoreServices.getNearbyStores(
          userPosition.latitude,
          userPosition.longitude
        );

        // Map stores
        const mapped = res.data.map((item) => {
          const s = item.store?.store || {};
          const owner = s.owner || {};
          const images = (s.images || []).filter(img => img.isAllowed === true);

          return {
            id: s.id,
            title: item.serviceType || 'Unknown Service',
            type: s.type,
            car: s.car,
            status: s.isActive ? 'available' : 'busy',
            rating: item.store?.averageRating || 0,
            reviewCount: s.reviews?.length || 0,
            location: [s.latitude || 0, s.longitude || 0],
            phone: owner.phone || 'N/A',
            storeName: s.name || 'Unnamed Store',
            member: {
              id: owner.id,
              name: owner.name,
              phone: owner.phone,
              role: owner.role,
            },
            description: s.description || 'No description available.',
            priceRange: s.priceRange || 'N/A',
            storeImage: images.length > 0
              ? `/${images[0].imageUrl}`
              : '/images/default-store.jpg',
            images: images.length > 0
              ? images.map((img) => `/${img.imageUrl}`)
              : [s.certificate || '/images/default-store.jpg'],
            distanceKm: parseFloat(item.distance) || 0,
            reviews: s.reviews?.map(r => ({
              id: r.id,
              rating: r.rating,
              comment: r.comment,
              client: r.client ? { id: r.client.id, name: r.client.name } : null,
            })) || [],
          };
        });

        // ✅ Deduplicate services by ID
        const uniqueServices = Array.from(new Map(mapped.map(s => [s.id, s])).values());
        setServices(uniqueServices);

      } catch (err) {
        console.error('❌ Error fetching nearby stores:', err);
        setError( 'no nearby services found || لم يتم العثور على متجر');
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchStores();
  }, [userPosition]);

  // 📍 Filtered and deduplicated services
  const filteredServices = useMemo(() => {
    let list = [...services];

    if (filterType !== 'all') {
      list = list.filter((s) => s.type === filterType);
    }

    // Deduplicate again after filtering to be safe
    list = Array.from(new Map(list.map(s => [s.id, s])).values());

    if (userPosition) {
      list = attachDistance(list, userPosition);
      list = sortByDistance(list);
    }

    return list;
  }, [filterType, services, userPosition]);

  // 🚗 Open Google Maps directions
  const handleDirections = (service) => {
    if (!service?.location) return;
    const [lat, lng] = service.location;
    const origin = userPosition
      ? `&origin=${userPosition.latitude},${userPosition.longitude}`
      : '';
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}${origin}`,
      '_blank'
    );
  };

  // ☎️ Call the store
  const handleCall = (phoneNumber) => {
    if (!phoneNumber) return;
    window.open(`tel:${phoneNumber}`, '_self');
  };

  return (
    <div className="min-h-screen bg-background flex flex-row h-screen mb-12">
      {/* 🗺️ Map section */}
      <div className="relative flex-1 min-h-[400px] sm:min-h-[600px]">
        <MapComponent
          services={filteredServices}
          userPosition={userPosition}
          onMarkerClick={setSelectedService}
          focusTarget={
            selectedService
              ? { id: selectedService.id, location: selectedService.location }
              : null
          }
        />
      </div>

      {/* 📋 Sidebar */}
      <aside className="w-full sm:w-[380px] md:w-[420px] lg:w-[480px] xl:w-[520px] bg-background border-l border-border overflow-y-auto flex flex-col">
        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 flex-1 flex flex-col">
          {/* Filters */}
          <div>
            <h3 className="text-xl font-bold mb-3">
              {t('map.title') || 'Find Services'}
            </h3>
            <MapFilters filterType={filterType} setFilterType={setFilterType} />
          </div>

          {/* Location Status */}
          {(locationLoading || locationError || userPosition) && (
            <Card
              className={
                locationError
                  ? 'border-red-200 bg-red-100'
                  : 'border-green-200 bg-green-100'
              }
            >
              <CardContent className="p-3 flex items-center space-x-2">
                {locationLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">Getting location...</span>
                  </>
                ) : locationError ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-medium text-red-800">
                      Location access required
                    </span>
                    <Button size="sm" onClick={refetchLocation}>
                      <Navigation className="w-3 h-3" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium text-green-800">
                      Location active
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Service List */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {t('map.nearestServices') || 'Nearest Services'}
            </h3>
            <span className="text-sm font-medium bg-muted px-3 py-1 rounded-full">
              {filteredServices.length}{' '}
              {filteredServices.length === 1 ? 'service' : 'services'}
            </span>
          </div>

          {error ? (
            <div className="text-red-600 text-sm font-medium text-center p-3 bg-red-50 rounded-lg">
              {error}
            </div>
          ) : loadingServices ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Loading services...
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              No services found nearby.
            </div>
          ) : (
            <ServiceList
              services={filteredServices}
              selectedServiceId={selectedService?.id}
              onSelect={setSelectedService}
            />
          )}
        </div>
      </aside>

      {/* 🪧 Selected Service Overlay */}
      {selectedService && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedService(null)}
          />
          <div className="fixed inset-x-4 sm:right-6 sm:left-auto top-6 bottom-6 sm:w-[400px] z-50">
            <SelectedServiceCard
              service={selectedService}
              onCall={() => handleCall(selectedService.phone)}
              token={localStorage.getItem('token')}
              onDirections={() => handleDirections(selectedService)}
              onClose={() => setSelectedService(null)}
            />
          </div>
        </>
      )}
    </div>
  );
}
