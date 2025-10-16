'use client';


import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Settings, Activity, Calendar, Bell } from 'lucide-react';

export default function MemberDashboard() {
  //
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(true);
  const [hasNewRequest, setHasNewRequest] = useState(true);
  //
  return (
    <main className="pt-24 pb-10 px-4 md:px-8 lg:px-16 bg-background text-foreground min-h-screen transition-colors duration-300">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6">{t('dashboard.title', { defaultValue: 'Member Dashboard' })}</h1>

      {/* Status Toggle */}
      <Card className="mb-8">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            {t('dashboard.status', { defaultValue: 'Your Status' })}
          </CardTitle>
          <div className="flex items-center gap-3">
            <span className={`text-sm ${isActive ? 'text-green-600' : 'text-red-500'}`}>
              {isActive ? t('dashboard.active', { defaultValue: 'Active' }) : t('dashboard.inactive', { defaultValue: 'Inactive' })}
            </span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardHeader>
      </Card>

      {/* Stats Section */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              {t('dashboard.totalServices', { defaultValue: 'Total Services Completed' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">42</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              {t('dashboard.subscriptionEnd', { defaultValue: 'Subscription Ends' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">31/12/2025</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              {t('dashboard.placeholder', { defaultValue: 'Other Statistic' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Coming soon...</p>
          </CardContent>
        </Card>
      </section>

      {/* Live Alert */}
      {hasNewRequest && (
        <Alert className="mb-8 border-l-4 border-primary bg-primary/5">
          <Bell className="h-5 w-5 text-primary" />
          <AlertTitle className="font-semibold">{t('dashboard.newRequest', { defaultValue: 'New Service Request!' })}</AlertTitle>
          <AlertDescription>
            {t('dashboard.newRequestMsg', { defaultValue: 'You have a new service request from a nearby client.' })}
          </AlertDescription>
        </Alert>
      )}

      {/* Settings Section */}
      <section>
        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              {t('dashboard.settings', { defaultValue: 'Account Settings' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t('dashboard.settingsDesc', {
                defaultValue: 'Update your profile information and account preferences.',
              })}
            </p>
            <Button variant="outline" className="mr-3">
              {t('dashboard.editProfile', { defaultValue: 'Edit Profile' })}
            </Button>
            <Button variant="default">
              {t('dashboard.changePassword', { defaultValue: 'Change Password' })}
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}


