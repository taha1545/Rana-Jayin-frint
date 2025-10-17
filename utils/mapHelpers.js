//
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// 
export const formatDistance = (distanceKm) => {
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(1)} km`;
};

// 
export const getServiceIcon = (type) => {
    const icons = {
        'tire-repair': '🔧',
        'battery-boost': '🔋',
        'towing': '🚛',
        'fuel-delivery': '⛽',
        'emergency': '🚨'
    };
    return icons[type] || '🛠️';
};

// 
export const getStatusColor = (status) => {
    const colors = {
        available: '#10B981',
        busy: '#F59E0B',
        offline: '#6B7280'
    };
    return colors[status] || '#6B7280';
};

export const getMemberStatusColor = (status) => {
    const colors = {
        online: '#3B82F6',
        busy: '#F59E0B',
        offline: '#6B7280'
    };
    return colors[status] || '#6B7280';
};

// 
export const getNearestServices = (services, userLocation, maxRadiusKm = 25, limit = 10) => {
    if (!userLocation) return services;

    const servicesWithDistance = services.map(service => {
        const [lat, lng] = service.location;
        const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            lat,
            lng
        );
        return { ...service, distanceKm: distance };
    });
    // 
    const availableServices = servicesWithDistance.filter(
        service => service.status === 'available' && service.distanceKm <= maxRadiusKm
    );
    // 
    return availableServices
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, limit);
};

// New flexible helpers (do not change existing behavior above)
export const attachDistance = (services, userLocation) => {
    if (!userLocation) return services;
    return services.map((service) => {
        if (!Array.isArray(service.location)) return service;
        const [lat, lng] = service.location;
        return {
            ...service,
            distanceKm: calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                lat,
                lng
            ),
        };
    });
};

export const filterByStatus = (services, status) => {
    if (!status) return services;
    return services.filter((s) => s.status === status);
};

export const filterByType = (services, type) => {
    if (!type) return services;
    return services.filter((s) => s.type === type);
};

export const filterByRadius = (services, maxRadiusKm = 25) => {
    if (!maxRadiusKm) return services;
    return services.filter((s) => typeof s.distanceKm === 'number' && s.distanceKm <= maxRadiusKm);
};

export const sortByDistance = (services) => {
    return [...services].sort((a, b) => {
        const da = typeof a.distanceKm === 'number' ? a.distanceKm : Number.POSITIVE_INFINITY;
        const db = typeof b.distanceKm === 'number' ? b.distanceKm : Number.POSITIVE_INFINITY;
        return da - db;
    });
};