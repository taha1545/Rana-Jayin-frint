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