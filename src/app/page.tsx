import FeaturedProperties from "@/components/home/FeaturedProperties";
import HeroV2 from "@/components/home/HeroV2";
import HowItWorks from "@/components/home/HowItWorks";
import ProviderCTA from "@/components/home/ProviderCTA";
import TrustAndSafety from "@/components/home/TrustAndSafety";
import TrustStrip from "@/components/home/TrustStrip";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        <HeroV2 />
        <TrustStrip />
        <FeaturedProperties />
        <HowItWorks />
        <TrustAndSafety />
        <ProviderCTA />
      </main>

      <SiteFooter />
    </>
  );
}
