'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, User } from 'lucide-react';

// 
const MapComponent = dynamic(() => import('@/components/map/MapComponent'), { ssr: false });

export default function CurrentUserCard({ user, t }) {
    //
    if (!user) return null;
    //
    return (
        <Card className="rounded-2xl border border-muted shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-4 px-[5%] border-b">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold">{user.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{user.phone}</span>
                        </div>
                    </div>
                </div>

                <Badge
                    variant={
                        user.status === 'Active'
                            ? 'success'
                            : user.status === 'Offline'
                                ? 'secondary'
                                : 'default'
                    }
                    className="px-3 py-1 text-xs rounded-md"
                >
                    {user.status === 'Active'
                        ? t('dashboard.active')
                        : user.status === 'Offline'
                            ? t('dashboard.offline')
                            : t('dashboard.unknown')}
                </Badge>
            </CardHeader>

            <CardContent className="p-0">
                <div className="h-[250px] w-full">
                    <MapComponent position={user.location} />
                </div>
            </CardContent>
        </Card>
    );
}
