import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import FeaturedWork from "@/components/FeaturedWork";
import ServicesGrid from "@/components/ServicesGrid";
import GovPhotoBooking from "@/components/GovPhotoBooking";
import WhyChoose from "@/components/WhyChoose";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhatWeDo />
        <FeaturedWork />
        <ServicesGrid />
        <GovPhotoBooking />
        <WhyChoose />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
