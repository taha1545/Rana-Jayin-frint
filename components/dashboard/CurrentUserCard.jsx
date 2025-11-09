'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, User, Clock, BatteryCharging } from 'lucide-react';

// 
const UserLocationMap = dynamic(() => import('./UserLocationMap'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-muted">
            Loading map...
        </div>
    )
});

export default function CurrentUserCard({ userData, t }) {
    if (!userData) return null;

    const { client, request } = userData;
    if (!client || !request) return null;

    return (
        <Card className="rounded-2xl border border-muted shadow-sm overflow-hidden">
            {/* Client Info */}
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
                        request.status === 'completed'
                            ? 'success'
                            : request.status === 'pending'
                                ? 'warning'
                                : 'default'
                    }
                    className="px-3 py-1 text-xs rounded-md"
                >
                    {request.status}
                </Badge>
            </CardHeader>

            {/* Request & Map */}
            <CardContent className="p-0">
                <div className="p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BatteryCharging className="w-4 h-4" />
                        <span>Service: {request.serviceType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Created At: {request.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>
                            Lat: {request.latitude.toFixed(6)}, Lng: {request.longitude.toFixed(6)}
                        </span>
                    </div>
                </div>

                <div className="h-[250px] w-full relative">
                    <UserLocationMap position={{ lat: request.latitude, lng: request.longitude }} />
                    <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded-md text-xs flex items-center gap-1 shadow-sm">
                        <MapPin className="w-3 h-3" />
                        <span>{request.latitude.toFixed(6)}, {request.longitude.toFixed(6)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
