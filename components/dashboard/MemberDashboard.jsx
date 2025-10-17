'use client';

import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import HeaderSection from './HeaderSection';
import StatsSection from './StatsSection';
import RequestsTable from './RequestsTable';
import SettingsSection from './SettingsSection';
import CurrentUserCard from './CurrentUserCard';
import MapDialog from './MapDialog';
import { Activity, Calendar, Settings, Star } from 'lucide-react';

export default function MemberDashboard() {
  //
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(true);
  const [page, setPage] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editing, setEditing] = useState(false);
  //
  const [profile, setProfile] = useState({
    name: 'Rana Jayin Garage',
    ownerName: 'Taha Mansouri',
    email: 'rana@example.com',
    phone: '+213 555 123 456',
    storeName: 'Rana Car Wash & Tow',
    images: [],
  });
  //
  const currentUser = {
    name: 'Taha Mansouri',
    phone: '+213 555 123 456',
    location: [35.207, -0.641],
    status: 'Active',
  };
  //
  const mockRequests = [
    { id: 1, client: 'Ahmed', phone: '+213 770 111 222', status: 'Completed', location: { lat: 36.76, lng: 3.07 } },
    { id: 2, client: 'Sara', phone: '+213 770 333 444', status: 'Pending', location: { lat: 36.74, lng: 3.04 } },
    { id: 3, client: 'Yacine', phone: '+213 770 555 666', status: 'In Progress', location: { lat: 36.77, lng: 3.06 } },
  ];
  //
  const stats = [
    { icon: <Activity className="w-5 h-5 text-primary" />, title: t('dashboard.totalServices', { defaultValue: 'Total Services Completed' }), value: '42' },
    { icon: <Calendar className="w-5 h-5 text-primary" />, title: t('dashboard.subscriptionEnd', { defaultValue: 'Subscription Ends' }), value: '31/12/2025' },
    { icon: <Star className="w-5 h-5 text-primary" />, title: t('dashboard.otherStat', { defaultValue: 'Average Rating' }), value: '4.8 ★' },
  ];
  //
  const handleStatusToggle = (checked) => setIsActive(checked);
  const handleSaveProfile = () => setEditing(false);
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setProfile((prev) => ({ ...prev, images: [...prev.images, ...files.map((f) => URL.createObjectURL(f))] }));
  };
  const handleShowMap = (client) => { setSelectedClient(client); setShowMap(true); };
  //
  return (
    <main className="pt-12 lg:pt-24 pb-16 px-4 md:px-8 lg:px-16 bg-background text-foreground min-h-screen space-y-12">
      <HeaderSection {...{ profile, isActive, handleStatusToggle, t }} />
      <CurrentUserCard user={currentUser} t={t} />
      <StatsSection stats={stats} />
      <RequestsTable {...{ mockRequests, t, page, setPage, handleShowMap }} />
      <SettingsSection {...{ profile, editing, setEditing, handleSaveProfile, handleImageUpload, setProfile, t }} />
      <MapDialog {...{ showMap, setShowMap, selectedClient }} />
    </main>
  );
}
