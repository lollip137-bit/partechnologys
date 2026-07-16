"use client";

import { useState } from "react";
import Image from "next/image";

type Project = {
  domain: string;
  image: string;
  tag: string;
  title: string;
  body: string;
  detailTag: string;
  detailBody: string;
  stat: string;
};

const projects: Project[] = [
  {
    domain: "qbaestateagency.com",
    image: "/assets/qba.jpeg",
    tag: "REAL ESTATE · LUXURY · UAE",
    title: "QBA Estate Agency",
    body: "Luxury real estate platform with custom dark design and full service showcase.",
    detailTag: "Redesign & Development",
    detailBody:
      "Full custom redesign from scratch. Dark luxury aesthetic, mobile-first build, multi-step WhatsApp enquiry form, dedicated service pages, and client testimonials. Load time reduced from 8.2s to 1.4s.",
    stat: "675% more enquiries after launch",
  },
  {
    domain: "chaletschamonix.com",
    image: "/assets/chaletschamonix.jpeg",
    tag: "LUXURY TRAVEL · FRANCE",
    title: "Chalets Chamonix",
    body: "Luxury Alpine chalet booking platform with immersive visuals and premium brand feel.",
    detailTag: "Custom Development",
    detailBody:
      "Full luxury travel website with immersive hero sections, chalet listing pages, availability calendar integration, and a booking inquiry flow. Premium typography and cinematic layout designed to match the high-end Alps market.",
    stat: "Booking inquiries doubled in 60 days",
  },
  {
    domain: "rigidfitness.fit",
    image: "/assets/rigid.jpeg",
    tag: "FITNESS & HEALTH · EUROPE",
    title: "Rigid Fitness",
    body: "Bold fitness brand site with program showcase, trainer profiles, and membership sign-up flow.",
    detailTag: "Custom Development",
    detailBody:
      "Brand-specific custom design matching the energy of their fitness brand. Program pages, trainer profiles with credentials, transformation gallery, and prominent trial sign-up CTAs on every section.",
    stat: "33% more membership sign-ups",
  },
  {
    domain: "humbleteam.com",
    image: "/assets/humbleteam.jpeg",
    tag: "PRODUCT STUDIO · UK",
    title: "Humble Team",
    body: "Premium product design studio site with bold typography and smooth scroll experience.",
    detailTag: "Redesign & Development",
    detailBody:
      "Complete website redesign for a UK product studio. Bold typographic layout, animated sections, case study pages, and a lead capture system. Figma mockup approved before a single line of code.",
    stat: "480% more project inquiries",
  },
  {
    domain: "davidottaproductions.com",
    image: "/assets/davidotta.jpeg",
    tag: "CREATIVE · MEDIA PRODUCTION",
    title: "David Otta Productions",
    body: "Creative media portfolio with video showcases, reel embeds, and lead inquiry flow.",
    detailTag: "Redesign & Development",
    detailBody:
      "Dark cinematic portfolio website for a media production company. Video reel embeds, project showcase grid, client logos section, and a streamlined project inquiry form. Delivered in 8 days.",
    stat: "Project inquiries up 4x in first month",
  },
  {
    domain: "canbury.io",
    image: "/assets/canbury.png",
    tag: "SAAS · TECH STARTUP · UK",
    title: "Canbury.io",
    body: "Clean SaaS startup site with feature highlights, pricing section, and onboarding flow.",
    detailTag: "Custom Development",
    detailBody:
      "Modern SaaS website with animated feature sections, comparison pricing table, integration showcase, and a smooth onboarding CTA flow. Built to convert visitors into trial signups from the first scroll.",
    stat: "675% more enquiries after launch",
  },
  {
    domain: "marghzar.com",
    image: "/assets/marghzar.jpeg",
    tag: "TRAVEL & TOURISM · PAKISTAN",
    title: "Marghzar",
    body: "Immersive travel website showcasing Pakistan's northern landscapes with booking & inquiry flow.",
    detailTag: "Custom Development",
    detailBody:
      "Visually immersive travel website for a Pakistan tourism brand. Full-screen hero with parallax effect, destination showcase pages, tour package listings, group booking inquiry forms, and WhatsApp integration for instant contact.",
    stat: "Tour inquiries up 8x within 30 days",
  },
  {
    domain: "yourstock24global.com",
    image: "/assets/yourstock24.jpeg",
    tag: "E-COMMERCE · B2B · EUROPE",
    title: "YourStock24 Global",
    body: "European overstock trading platform with structured product catalog and wholesale inquiry system.",
    detailTag: "Redesign & Development",
    detailBody:
      "Full platform rebuild — organized product catalog with category navigation, structured wholesale inquiry forms per category, international trust signals, and multi-language layout consideration for EU buyers.",
    stat: "640% more wholesale inquiries",
  },
  {
    domain: "amesainteriors.com.au",
    image: "/assets/amesa.jpeg",
    tag: "INTERIOR DESIGN · AUSTRALIA",
    title: "Amesa Interiors",
    body: "Elegant studio site with portfolio gallery, service pages, and consultation booking flow.",
    detailTag: "Redesign & Development",
    detailBody:
      "Elegant portfolio-style website for an Australian interior design studio. Full project gallery with filtering, service breakdown pages, online consultation booking, and a clean minimal aesthetic that matches the brand.",
    stat: "3x more consultation bookings",
  },
];

export default function PortfolioGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="columns-1 md:columns-2 xl:columns-3 gap-6">
      {projects.map((project, i) => (
        <div
          key={project.domain}
          onClick={() => setOpenIndex(i === openIndex ? null : i)}
          className="mb-6 break-inside-avoid bg-bg-card-color border-2 rounded-2xl border-primary-border cursor-pointer hover:-translate-y-1.5 active:-translate-y-1.5 transition-all duration-200"
        >
          <div className="flex justify-between items-center px-5 py-3 border-b-2 border-primary-border">
            <div className="flex gap-2">
              <div className="bg-red-600 h-3 w-3 rounded-full"></div>
              <div className="bg-yellow-500 h-3 w-3 rounded-full"></div>
              <div className="bg-green-600 h-3 w-3 rounded-full"></div>
            </div>
            <div className="bg-bg-skills-color py-1 px-2 border-2 border-primary-border rounded-xl w-fit flex">
              <i className="ri-lock-fill text-primary-green pr-1"></i>
              <span>{project.domain}</span>
            </div>
          </div>
          <div className="relative w-full h-56">
            <Image src={project.image} alt={project.title} fill className="object-cover" />
          </div>
          <div className="p-6 border-b-2 border-primary-border">
            <h4 className="text-primary-green font-medium mb-2 text-xs uppercase">
              {project.tag}
            </h4>
            <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
            <p className="text-sm">{project.body}</p>
          </div>
          {openIndex === i && (
            <div className="p-6 bg-bg-skills-color">
              <h4 className="text-primary-green font-medium mb-2 text-xs uppercase">
                {project.detailTag}
              </h4>
              <h3 className="text-xl font-bold text-white mb-2">What We Built</h3>
              <p className="text-sm pb-4">{project.detailBody}</p>
              <h4 className="bg-green-300/10 px-4 py-1 text-primary-green font-medium border-3 border-green-500/20 rounded-4xl mb-6 text-md w-fit">
                <i className="bi bi-graph-up-arrow text-xs"></i>&nbsp; {project.stat}
              </h4>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
