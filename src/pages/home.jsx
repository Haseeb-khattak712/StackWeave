import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BackgroundGrid from "../components/BackgroundGrid";

export default function Home() {
  return (
    <div className="relative bg-[#020617] text-white overflow-hidden min-h-screen">
      <BackgroundGrid />

      <Navbar />

      <main className="relative z-10">
        <Hero />
      </main>
    </div>
  );
}