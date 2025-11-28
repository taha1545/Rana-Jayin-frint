"use client";

import Navbar from "@/components/Navbar";
import Header from "@/components/Home/Header";
import About from "@/components/Home/About";
import EmergencyServices from "@/components/Home/EmergencyServices";
import Footer from "@/components/Fotter";
import FAQ from "@/components/Home/Faq";
import Services from "@/components/Services";
import Discouver from "@/components/Home/Discouver";
import Contact from "@/components/Home/Contact";
import Report from "@/components/Home/Report";
import Chatbot from "@/components/ChatBot";


export default function Home() {

  return (
    <>
      <Navbar />
      <Header />
      <About />
      <EmergencyServices />
      <Services />
      <Discouver />
      <Contact />
      <Report />
      <FAQ />
      <Footer />
      <Chatbot />
    </>
  );
}
