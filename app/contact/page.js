import Contact from '@/components/Home/Contact';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Fotter';

export default function ContactPage() {
  return (<>
  <Navbar />
    <div className="pt-20">
      <Contact />
    </div>
    <Footer />
  </>);
}
