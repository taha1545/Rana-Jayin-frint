'use client';

import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Activity,
  Calendar,
  Settings,
  Bell,
  User,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Camera,
} from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Lazy-load map
const MapComponent = dynamic(() => import('@/components/map/MapComponent'), { ssr: false });

export default function MemberDashboard() {
  const { t } = useTranslation();

  const [isActive, setIsActive] = useState(true);
  const [page, setPage] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Rana Jayin Garage',
    ownerName: 'Taha Mansouri',
    email: 'rana@example.com',
    phone: '+213 555 123 456',
    storeName: 'Rana Car Wash & Tow',
    images: [],
    position: { lat: 36.75, lng: 3.05 },
  });

  const mockRequests = [
    { id: 1, client: 'Ahmed', phone: '+213 770 111 222', status: 'Completed', location: { lat: 36.76, lng: 3.07 } },
    { id: 2, client: 'Sara', phone: '+213 770 333 444', status: 'Pending', location: { lat: 36.74, lng: 3.04 } },
    { id: 3, client: 'Yacine', phone: '+213 770 555 666', status: 'In Progress', location: { lat: 36.77, lng: 3.06 } },
  ];

  const stats = [
    {
      icon: <Activity className="w-5 h-5 text-primary" />,
      title: t('dashboard.totalServices', { defaultValue: 'Total Services Completed' }),
      value: '42',
    },
    {
      icon: <Calendar className="w-5 h-5 text-primary" />,
      title: t('dashboard.subscriptionEnd', { defaultValue: 'Subscription Ends' }),
      value: '31/12/2025',
    },
    {
      icon: <Settings className="w-5 h-5 text-primary" />,
      title: t('dashboard.otherStat', { defaultValue: 'Average Rating' }),
      value: '4.8 ★',
    },
  ];

  const handleStatusToggle = (checked) => {
    setIsActive(checked);
    console.log('Status:', checked ? 'Active' : 'Inactive');
  };

  const handleSaveProfile = () => {
    setEditing(false);
    console.log('Saved profile:', profile);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setProfile((prev) => ({
      ...prev,
      images: [...prev.images, ...files.map((file) => URL.createObjectURL(file))],
    }));
  };

  const handleShowMap = (client) => {
    setSelectedClient(client);
    setShowMap(true);
  };

  return (
    <main className="pt-24 pb-16 px-4 md:px-8 lg:px-16 bg-background text-foreground min-h-screen space-y-12 transition-all duration-300">
      {/* HEADER SECTION */}
      <motion.section
        className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl border shadow-sm bg-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{profile.ownerName}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <Badge variant={isActive ? 'success' : 'destructive'}>
              {isActive ? t('dashboard.active', { defaultValue: 'Active' }) : t('dashboard.inactive', { defaultValue: 'Inactive' })}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Label className="text-sm">{t('dashboard.status', { defaultValue: 'Status' })}</Label>
          <Switch checked={isActive} onCheckedChange={handleStatusToggle} />
        </div>
      </motion.section>

      {/* STATS SECTION */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((item, i) => (
          <motion.div key={i} whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {item.icon}
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{item.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* REQUESTS TABLE */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          {t('dashboard.requests', { defaultValue: 'Recent Requests' })}
        </h2>

        <Card className="overflow-hidden">
          <CardContent className="pt-6">
            <Table>
              <TableCaption>
                {t('dashboard.latestRequests', { defaultValue: 'Latest service requests' })}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.client}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {req.phone}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          req.status === 'Completed'
                            ? 'success'
                            : req.status === 'Pending'
                              ? 'secondary'
                              : 'default'
                        }
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleShowMap(req)}>
                        <MapPin className="w-4 h-4 mr-1" /> View on Map
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                {t('pagination.prev', { defaultValue: 'Previous' })}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>
                {t('pagination.next', { defaultValue: 'Next' })}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SETTINGS SECTION */}
      <section>
        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              {t('dashboard.settings', { defaultValue: 'Account Settings' })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {editing ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Name</Label>
                    <Input value={profile.ownerName} onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })} />
                  </div>
                  <div>
                    <Label>Store Name</Label>
                    <Input value={profile.storeName} onChange={(e) => setProfile({ ...profile, storeName: e.target.value })} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>

                {/* IMAGES */}
                <div>
                  <Label>Store Images</Label>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {profile.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="store"
                        className="w-20 h-20 rounded-md object-cover border"
                      />
                    ))}
                    <label className="w-20 h-20 flex items-center justify-center border rounded-md cursor-pointer hover:bg-muted transition">
                      <Camera className="w-5 h-5 text-muted-foreground" />
                      <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSaveProfile}>
                    <Save className="w-4 h-4 mr-1" /> Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your store and personal information.
                </p>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {profile.ownerName}</p>
                  <p><strong>Store:</strong> {profile.storeName}</p>
                  <p><strong>Phone:</strong> {profile.phone}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                </div>
                <Button className="mt-4" onClick={() => setEditing(true)}>
                  <Edit className="w-4 h-4 mr-1" /> Edit Profile
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </section>

      {/* MAP DIALOG */}
      <Dialog open={showMap} onOpenChange={setShowMap}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedClient?.client}'s Location</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="h-72">
              <MapComponent position={selectedClient.location} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
