import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import BackgroundEffects from "../components/BackgroundEffects";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-slate-950 text-white min-h-screen">
      <BackgroundEffects />

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <Features />
      </main>
    </div>
  );
}