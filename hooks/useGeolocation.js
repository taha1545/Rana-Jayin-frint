'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export const useGeolocation = (opts = {}) => {
    const defaultOptions = useMemo(
        () => ({
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
            ...opts,
        }),
        [] // ✅ only build once — no re-renders
    );

    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const watchIdRef = useRef(null);

    // Stable handlers (no external dependencies)
    const successHandler = useCallback((position) => {
        setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude ?? null,
            heading: position.coords.heading ?? null,
            speed: position.coords.speed ?? null,
            timestamp: position.timestamp,
        });
        setError(null);
        setLoading(false);
    }, []);

    const errorHandler = useCallback((err) => {
        let msg = 'Unable to retrieve your location';
        switch (err.code) {
            case err.PERMISSION_DENIED:
                msg = 'Location access denied. Please enable location services.';
                break;
            case err.POSITION_UNAVAILABLE:
                msg = 'Location information unavailable.';
                break;
            case err.TIMEOUT:
                msg = 'Location request timed out.';
                break;
            default:
                msg = err.message || msg;
                break;
        }
        setError(msg);
        setLoading(false);
    }, []);

    // Watch position once
    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setError('Geolocation not supported by your browser');
            setLoading(false);
            return;
        }

        setLoading(true);
        const id = navigator.geolocation.watchPosition(
            successHandler,
            errorHandler,
            defaultOptions
        );
        watchIdRef.current = id;

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
        };
        // ✅ Empty dependency array → run once
    }, []);

    // Manual refetch
    const refetch = useCallback(() => {
        if (!('geolocation' in navigator)) {
            setError('Geolocation not supported by your browser');
            setLoading(false);
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            successHandler,
            errorHandler,
            { ...defaultOptions, maximumAge: 0 }
        );
    }, [defaultOptions, successHandler, errorHandler]);

    const stopWatching = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    }, []);

    return { location, error, loading, refetch, stopWatching };
};
