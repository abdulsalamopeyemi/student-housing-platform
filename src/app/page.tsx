import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import SiteHeader from "@/components/layout/SiteHeader";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <TrustStrip />
    </main>
  );
}
