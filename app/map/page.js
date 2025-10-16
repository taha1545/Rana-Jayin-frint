import MapPage from '@/components/map/MapPage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Fotter';

export const metadata = {
  title: 'Service Map - Rana Jayeen',
  description: 'Interactive map showing available services and service providers',
};

export default function Map() {
  return (
    <>
      <Navbar />
      <div className="pt-24 m-0 ">
        <MapPage />
      </div>
      <Footer />
    </>
  );
}