'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import HeaderSection from './HeaderSection';
import StatsSection from './StatsSection';
import SettingsSection from './SettingsSection';
import CurrentUserCard from './CurrentUserCard';
import MapDialog from './MapDialog';
import MembreServices from '@/services/MembreServices';
import UserServices from '@/services/UserServices';
import { Activity, Calendar, Star, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

export default function MemberDashboard({ token }) {
  const { t } = useTranslation();
  const router = useRouter();

  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState([]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Current user info
      const memberRes = await UserServices.getCurrentUser(token);
      if (!memberRes?.success) throw new Error(t('errors.memberInfoFailed'));

      // Member store
      const storeRes = await MembreServices.getMemberStore(memberRes.data.id, token);
      if (!storeRes?.success) throw new Error(t('errors.storeInfoFailed'));
      const storeData = storeRes.data;
      setProfile(storeData);
      setIsActive(storeData.isActive);

      // Last request
      let lastRequest = null;
      try {
        const requestsRes = await MembreServices.getLastRequest(storeData.id, token);
        if (requestsRes?.success) lastRequest = requestsRes.data;
      } catch { }

      setCurrentUser(
        lastRequest
          ? { client: lastRequest.client, request: lastRequest.request }
          : null
      );

      // Store analytics
      const analyticsRes = await MembreServices.getAnalytics(storeData.id, token);
      const analytics = analyticsRes?.data || {};
      setStats([
        { icon: <Activity className="w-5 h-5 text-primary" />, title: t('dashboard.totalServices'), value: analytics.totalServicesCompleted || 0 },
        { icon: <Calendar className="w-5 h-5 text-primary" />, title: t('dashboard.subscriptionEnd'), value: analytics.subscriptionEnds || 'N/A' },
        { icon: <Star className="w-5 h-5 text-primary" />, title: t('dashboard.averageRating'), value: `${analytics.averageRating || 0} ★` },
      ]);

    } catch (err) {
      console.error(err);
      setError(err.message || t('errors.dashboardLoadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboardData(); }, [token]);

  const handleStatusToggle = async (checked) => {
    setIsActive(checked);
    try {
      const res = await MembreServices.toggleActive(profile.id, checked, token);
      if (!res?.success) throw new Error(t('errors.statusUpdateFailed'));
    } catch (err) {
      console.error(err);
      setIsActive(!checked);
      alert(t('errors.statusUpdateFailed'));
    }
  };

  const handleRequestStatusUpdate = async (requestId, status) => {
    if (!profile) return;
    try {
      const res = await MembreServices.updateRequestStatus(requestId, status, token);
      if (res?.success) {
        setCurrentUser(prev => ({
          ...prev,
          request: { ...prev.request, status }
        }));
      } else {
        alert(res?.message || 'Failed to update request status');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while updating request status');
    }
  };

  // Loading
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen text-muted-foreground">
      <Spinner className="mb-4" />
      <p>{t('common.loading')}</p>
    </div>
  );

  // Error
  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <Card className="max-w-md p-6 text-center border border-red-500 shadow-md rounded-md">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-red-500 mb-2">{t('errors.somethingWentWrong')}</h2>
        <p className="text-sm text-muted-foreground mb-4">{t('errors.tryAgainOrContact')}</p>
        <div className="flex justify-center gap-2">
          <button onClick={loadDashboardData} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">{t('actions.tryAgain')}</button>
          <button onClick={() => router.push('/')} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">{t('actions.goHome')}</button>
          <button onClick={() => router.push('/contact')} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">{t('actions.contactSupport')}</button>
        </div>
      </Card>
    </div>
  );

  return (
    <main className="pt-12 lg:pt-24 pb-16 px-4 md:px-8 lg:px-16 bg-background text-foreground min-h-screen space-y-12">
      <HeaderSection {...{ profile, isActive, handleStatusToggle, t }} />
      {currentUser && (
        <CurrentUserCard
          userData={currentUser}
          t={t}
          onStatusUpdate={handleRequestStatusUpdate}
        />
      )}
      <StatsSection stats={stats} />
      <SettingsSection
        memberData={profile?.member}
        storeData={profile}
        setMemberData={(updated) => setProfile(prev => ({ ...prev, member: updated }))}
        setStoreData={setProfile}
        t={t}
        updateMember={(data) => MembreServices.updateMember(data, token)}
        updateStore={(id, data) => MembreServices.updateStore(id, data, token)}
        addStoreImage={(id, file) => MembreServices.addStoreImage(id, file, token)}
        deleteStoreImage={(imageId) => MembreServices.deleteStoreImage(imageId, token)}
      />
      <MapDialog {...{ showMap: false, setShowMap: () => { }, selectedClient: null }} />
    </main>
  );
}
