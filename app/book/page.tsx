import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GovPhotoBooking from "@/components/GovPhotoBooking";

export const metadata: Metadata = {
  title: "Book a Passport or Visa Photo · Photo Tak Victoria",
  description:
    "Book a 15-minute appointment for government-compliant Canadian or US passport & visa photos at Photo Tak, Victoria BC.",
};

export default function BookPage() {
  return (
    <>
      <Navbar />
      <main className="pt-8">
        <GovPhotoBooking />
      </main>
      <Footer />
    </>
  );
}
