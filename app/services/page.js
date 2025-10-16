import Services from '@/components/Services';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Fotter';

export default function ServicesPage() {
    return (<>
        <Navbar />
        <div className="pt-20">
            <Services />
        </div>
        <Footer />
    </>);
}
