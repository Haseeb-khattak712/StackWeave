import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Workflow from "../components/Workflow";
import FeaturesGrid from "../components/FeaturesGrid";
import Footer from "../components/Footer";
import BackgroundGrid from "../components/BackgroundGrid";

export default function Home() {
  return (
    <div className="relative bg-[#020617] text-white overflow-hidden">
      <BackgroundGrid />

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <Workflow />
        <FeaturesGrid />
      </main>

      <Footer />
    </div>
  );
}