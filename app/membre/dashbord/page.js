
'use client';

import MemberDashboard from '@/components/dashboard/MemberDashboard';
import Footer from '@/components/Fotter';
import Navbar from '@/components/Navbar';

export default function membre() {

    // fetch membre and check if membre susbctiption is active
    // if not active redirect to /pricing page or login
    //create cookie that take membre token
    

    return (
        <>
            <Navbar />
            <div className="pt-16">
                <MemberDashboard />
            </div>
            <Footer />
        </>
    );
}

