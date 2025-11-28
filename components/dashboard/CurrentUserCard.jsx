'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, User, Clock, BatteryCharging, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

const UserLocationMap = dynamic(() => import('./UserLocationMap'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-muted">Loading map...</div>
    ),
});

export default function CurrentUserCard({ userData, t, onStatusUpdate }) {
    if (!userData) return null;

    const { client, request } = userData;
    if (!client || !request) return null;

    const [updating, setUpdating] = useState(false);

    const handleAccept = async () => {
        setUpdating(true);
        try { await onStatusUpdate(request.id, 'accepted'); }
        finally { setUpdating(false); }
    };

    const handleComplete = async () => {
        setUpdating(true);
        try { await onStatusUpdate(request.id, 'completed'); }
        finally { setUpdating(false); }
    };

    return (
        <Card className="rounded-2xl border border-muted shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-4 px-[5%] border-b">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold">{client.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{client.phone}</span>
                        </div>
                    </div>
                </div>

                <Badge
                    variant={
                        request.status === 'completed' ? 'success' :
                            request.status === 'accepted' ? 'primary' :
                                request.status === 'pending' ? 'warning' : 'default'
                    }
                    className="px-3 py-1 text-xs rounded-md"
                >
                    {request.status}
                </Badge>
            </CardHeader>

            <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BatteryCharging className="w-4 h-4" />
                    <span>Service: {request.serviceType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Created At: {request.createdAt}</span>
                </div>

                <div className="h-[250px] w-full relative mt-2">
                    <UserLocationMap position={{ lat: request.latitude, lng: request.longitude }} />
                    <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded-md text-xs flex items-center gap-1 shadow-sm">
                        <MapPin className="w-3 h-3" />
                        <span>{request.latitude.toFixed(6)}, {request.longitude.toFixed(6)}</span>
                    </div>
                </div>

                {request.status !== 'completed' && (
                    <div className="mt-4 flex gap-2">
                        {request.status === 'pending' && (
                            <Button variant="primary" onClick={handleAccept} disabled={updating}>
                                {updating ? 'Processing...' : 'Accept Request'}
                            </Button>
                        )}
                        {request.status === 'accepted' && (
                            <Button variant="success" onClick={handleComplete} disabled={updating}>
                                {updating ? 'Processing...' : 'Complete Request'}
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
