import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingSection from "@/components/BookingSection";

export const metadata: Metadata = {
  title: "Book an Appointment · Photo Tak Victoria",
  description:
    "Book any Photo Tak service online: passport & visa photos, corporate headshots, portraits, family sessions, and free wedding or real estate consultations in Victoria BC.",
};

export default function BookPage() {
  return (
    <>
      <Navbar />
      <main className="pt-8">
        <BookingSection />
      </main>
      <Footer />
    </>
  );
}
