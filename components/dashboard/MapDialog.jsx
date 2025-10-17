'use client';

import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const MapComponent = dynamic(() => import('@/components/map/MapComponent'), { ssr: false });

export default function MapDialog({ showMap, setShowMap, selectedClient }) {
    return (
        <Dialog open={showMap} onOpenChange={setShowMap}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{selectedClient?.client}'s Location</DialogTitle>
                </DialogHeader>
                {selectedClient && (
                    <div className="h-80">
                        <MapComponent
                            services={[]}
                            members={[{
                                id: selectedClient.id ?? 'client',
                                name: selectedClient.client,
                                status: 'online',
                                location: [selectedClient.location?.lat, selectedClient.location?.lng],
                            }]}
                            focusTarget={{ type: 'member', id: selectedClient.id ?? 'client', location: { lat: selectedClient.location?.lat, lng: selectedClient.location?.lng } }}
                            onMarkerClick={() => { }}
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
