'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MemberDashboard from '@/components/dashboard/MemberDashboard';
import Footer from '@/components/Fotter';
import Navbar from '@/components/Navbar';

export default function MembrePage() {
    const router = useRouter();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        if (!token) router.push('/auth/login');
    }, [token, router]);

    if (!token)
        return (
            <div className="flex items-center justify-center h-screen text-lg text-muted-foreground">
                Redirecting to login...
            </div>
        );

    return (
        <>
            <div className="pt-16">
                <Navbar />
                <MemberDashboard token={token} />
            </div>
            <Footer />
        </>
    );
}
