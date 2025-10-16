
'use client';

import MemberDashboard from '@/components/dashboard/MemberDashboard';
import Navbar from '@/components/Navbar';

export default function membre() {

    return (
        <>
            <Navbar />
            <div className="pt-16">
                <MemberDashboard />
            </div>
        </>
    );
}

