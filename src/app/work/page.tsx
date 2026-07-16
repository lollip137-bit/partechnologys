import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import ParticlesBackground from "@/components/ParticlesBackground";
import PortfolioGrid from "@/components/PortfolioGrid";
import BeforeAfterShowcase from "@/components/BeforeAfterShowcase";

export const metadata: Metadata = {
  title: "Our Work — Build.Site",
  description:
    "80+ projects, real results. Browse Build.Site's portfolio of custom websites, redesigns, and e-commerce builds.",
};

export default function WorkPage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        <section className="relative h-auto flex flex-col bg-bg-hero-color isolate border-b-2 border-primary-border">
          <div className="absolute left-1/2 top-44 -translate-x-1/2 h-0 w-100 bg-primary-green rounded-full opacity-10 shadow-[0_0_150px_90px_#14A800] shadow-primary-green -z-30"></div>
          <ParticlesBackground />
          <div className="absolute inset-0 bg-[linear-gradient(rgb(26_38_24/0.35)_1px,transparent_1px),linear-gradient(90deg,rgb(26_38_24/0.35)_1px,transparent_1px)] bg-[size:64px_64px] -z-10"></div>
          <div className="container mx-auto px-4 md:px-8 lg:px-10 py-15">
            <h4 className="text-primary-green text-md pb-6 font-bold"> — OUR WORK</h4>
            <h2 className="text-5xl font-black text-white pb-6">
              80+ Projects. <br /> <span className="text-primary-green">Real Results.</span>
            </h2>
            <p className="pb-4 block md:inline text-text-primary text-md">
              From local service businesses to global e-commerce platforms — every{" "}
              <br /> project is built to win leads, calls, and sales for our clients.
            </p>
          </div>
        </section>

        <section className="bg-bg-color h-auto">
          <div className="container mx-auto px-4 md:px-8 lg:px-10 text-text-primary py-25">
            <div className="flex flex-col gap-8 lg:flex-row items-start lg:justify-between lg:items-end pb-20">
              <div>
                <h4 className="text-primary-green text-sm tracking-wide pb-5 font-bold">
                  {" "}
                  — FULL PORTFOLIO
                </h4>
                <h2 className="text-4xl font-black text-white">
                  All <span className="text-primary-green">12 Featured</span> Projects
                </h2>
              </div>
            </div>

            <PortfolioGrid />
          </div>
        </section>

        <section className="bg-bg-color h-auto">
          <div className="container mx-auto px-4 md:px-8 lg:px-10 text-text-primary py-25">
            <BeforeAfterShowcase />
          </div>
        </section>
      </main>

      <Footer />
      <FloatingContact />
    </>
  );
}
