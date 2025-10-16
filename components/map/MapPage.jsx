'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getNearestServices, getServiceIcon, formatDistance } from '@/utils/mapHelpers';
import { Search, MapPin, Users, Car, Phone, Star, Navigation, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  //
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  // 
  const { location: userPosition, error: locationError, loading: locationLoading, refetch: refetchLocation } = useGeolocation();
  // 
  const filteredServices = useMemo(() => {
    let filtered = SAMPLE_SERVICES.filter(service => {
      const matchesSearch =
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.member.name.toLowerCase().includes(searchQuery.toLowerCase());
      //
      const matchesFilter =
        selectedFilter === 'all' ||
        service.type === selectedFilter ||
        service.status === selectedFilter;
      //
      return matchesSearch && matchesFilter;
    });
    // 
    if (userPosition) {
      filtered = getNearestServices(filtered, userPosition, 25, 10);
    }
    return filtered;
  }, [searchQuery, selectedFilter, userPosition]);
  // 
  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };
  // 
  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };
  // 
  const handleWhatsApp = (service) => {
    const message = `Hello, I'm interested in your ${service.title} service.`;
    window.open(`https://wa.me/${service.phone.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
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
          />
        </div>

        {/* Sidebar Section */}
        <aside className="w-full md:w-96 bg-background border-l border-border overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Filter Menu */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-secondary-foreground">Filters</h3>
              <select
                className="border border-border rounded-md text-sm p-2 bg-background text-foreground focus:ring-2 focus:ring-primary"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">All Services</option>
                <option value="tire-repair">Tire Repair</option>
                <option value="battery-boost">Battery Boost</option>
                <option value="towing">Towing</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
              </select>
            </div>
            {/* Location Status */}
            <Card className={locationError ? "border-red-200 bg-red-50 dark:bg-red-900/20" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  {locationLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      <span className="text-sm">Getting your location...</span>
                    </>
                  ) : locationError ? (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">
                          Location Access Required
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
                          Enable Location
                        </Button>
                      </div>
                    </>
                  ) : userPosition ? (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          Location Active
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-300">
                          Showing nearest services
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
                      <p className="text-sm font-medium text-muted-foreground">Services</p>
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
                      <p className="text-sm font-medium text-muted-foreground">Providers</p>
                      <p className="text-xl font-bold text-secondary-foreground">{SAMPLE_MEMBERS.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Services List */}
            <section>
              <h3 className="text-lg font-semibold text-secondary-foreground mb-3">
                {userPosition ? 'Nearest Services' : 'Available Services'}
              </h3>

              {filteredServices.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No services found matching your criteria.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredServices.map((service) => (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${selectedService?.id === service.id ? 'ring-2 ring-primary' : ''
                        }`}
                      onClick={() => handleServiceSelect(service)}
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
                                By: {service.member.name}
                              </p>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCall(service.phone);
                                }}
                              >
                                <Phone className="w-3 h-3 mr-1" />
                                Call
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Selected Service Details */}
            {selectedService && (
              <Card className="border-primary sticky bottom-4">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <img
                      src={selectedService.storeImage || '/images/default-store.jpg'}
                      alt={selectedService.storeName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <div className="truncate">{selectedService.storeName}</div>
                      <div className="text-sm font-normal text-muted-foreground truncate">
                        {selectedService.title}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Status</span>
                      <p className={`font-medium ${selectedService.status === 'available' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                        {selectedService.status.charAt(0).toUpperCase() + selectedService.status.slice(1)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Rating</span>
                      <p className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{selectedService.rating} ({selectedService.reviewCount})</span>
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Provider</span>
                      <p>{selectedService.member.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Completed Jobs</span>
                      <p>{selectedService.member.completedJobs}</p>
                    </div>
                    {selectedService.distanceKm && (
                      <div className="col-span-2">
                        <span className="font-medium text-muted-foreground">Distance</span>
                        <p>{formatDistance(selectedService.distanceKm)}</p>
                      </div>
                    )}
                    <div className="col-span-2">
                      <span className="font-medium text-muted-foreground">Phone</span>
                      <p className="font-mono">{selectedService.phone}</p>
                    </div>
                    {selectedService.description && (
                      <div className="col-span-2">
                        <span className="font-medium text-muted-foreground">Description</span>
                        <p className="text-sm">{selectedService.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => handleCall(selectedService.phone)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleWhatsApp(selectedService)}
                    >
                      💬 WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}