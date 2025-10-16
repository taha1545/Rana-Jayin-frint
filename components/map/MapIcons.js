export const createServiceIcon = (type, status, L) => {
    const colors = {
        available: '#10B981',
        busy: '#F59E0B',
        offline: '#6B7280'
    };

    const icons = {
        'tire-repair': '🔧',
        'battery-boost': '🔋',
        'towing': '🚛',
        'fuel-delivery': '⛽',
        'emergency': '🚨'
    };

    const color = colors[status] || '#6B7280';
    const icon = icons[type] || '🛠️';

    return L.divIcon({
        className: 'service-marker-icon',
        html: `
      <div style="
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        ${icon}
      </div>
    `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22]
    });
};

export const createMemberIcon = (status, L) => {
    const colors = {
        online: '#3B82F6',
        busy: '#F59E0B',
        offline: '#6B7280'
    };

    const color = colors[status] || '#6B7280';

    return L.divIcon({
        className: 'member-marker-icon',
        html: `
      <div style="
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        👤
      </div>
    `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -19]
    });
};