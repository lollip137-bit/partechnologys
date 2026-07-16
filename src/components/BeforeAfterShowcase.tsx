"use client";

import { useState } from "react";
import Image from "next/image";

type Stat = { label: string; before: string; after: string };

type CaseStudy = {
  name: string;
  beforeImage: string;
  afterImage: string;
  stats: Stat[];
  impact: string;
};

const caseStudies: CaseStudy[] = [
  {
    name: "QBA Estate Agency",
    beforeImage: "/assets/before-qba.png",
    afterImage: "/assets/qba.jpeg",
    stats: [
      { label: "Monthly Enquiries", before: "4/mo", after: "31/mo" },
      { label: "Bounce Rate", before: "74%", after: "38%" },
      { label: "Load Speed", before: "8.2s", after: "1.4s" },
      { label: "Session Time", before: "42s", after: "3m 14s" },
    ],
    impact:
      "QBA Estate Agency had an outdated WordPress site with no clear call-to-action and zero mobile optimization. After the full redesign they went from 4 enquiries per month to over 31 — a 675% increase. Two major deals in Q1 post-launch came directly from the website enquiry form.",
  },
  {
    name: "Marghzar",
    beforeImage: "/assets/before-marghzar.png",
    afterImage: "/assets/marghzar.jpeg",
    stats: [
      { label: "Tour Inquiries", before: "8/mo", after: "71/mo" },
      { label: "Bounce Rate", before: "83%", after: "41%" },
      { label: "Load Speed", before: "9.6s", after: "1.9s" },
      { label: "Session Time", before: "29s", after: "5m 18s" },
    ],
    impact:
      "Marghzar was running on a basic Blogspot page with no structure, no images, and no booking flow. International tourists looking for Pakistan travel packages couldn't trust the site enough to inquire. After the full rebuild with immersive destination pages, tour packages, and WhatsApp integration, monthly inquiries jumped from 8 to 71 — an 8x increase in 30 days.",
  },
  {
    name: "Humble Team",
    beforeImage: "/assets/before-humbleteam.png",
    afterImage: "/assets/humbleteam.jpeg",
    stats: [
      { label: "Project Inquiries", before: "8/mo", after: "17/mo" },
      { label: "Bounce Rate", before: "79%", after: "34%" },
      { label: "Load Speed", before: "7.4s", after: "1.6s" },
      { label: "Session Time", before: "38s", after: "4m 02s" },
    ],
    impact:
      "Humble Team had a basic template site that didn't reflect the quality of their work. Potential clients were landing on the site and leaving immediately. After the redesign with a bold typographic layout, animated case studies, and a clear project inquiry flow, monthly inquiries jumped from 3 to 17 and average session time increased by over 6x.",
  },
];

export default function BeforeAfterShowcase() {
  const [active, setActive] = useState(0);
  const study = caseStudies[active];

  return (
    <div>
      <div className="pb-15">
        <h4 className="text-primary-green text-sm tracking-wide pb-5 font-bold">
          {" "}
          — FULL PORTFOLIO
        </h4>
        <h2 className="text-4xl font-black text-white">
          All <span className="text-primary-green">12 Featured</span> Projects
        </h2>
        <div className="flex flex-wrap gap-3 pt-8 w-full">
          {caseStudies.map((cs, i) => (
            <button
              key={cs.name}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-4xl box-border border border-b shadow-xs font-bold text-xs px-7 py-3 focus:outline-none cursor-pointer transition duration-250 ${
                active === i
                  ? "bg-primary-green text-white border-primary-border"
                  : "bg-transparent text-text-primary border-primary-border hover:text-primary-green hover:border-primary-green"
              }`}
            >
              {cs.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 pb-10">
          <div className="border-2 border-primary-border rounded-3xl overflow-hidden h-64 flex flex-col">
            <div className="p-3 bg-red-500/15 border-b-2 border-primary-border">
              <h6 className="text-rose-500 font-medium tracking-wider text-sm">
                <i className="ri-close-fill pr-2"></i>BEFORE — OLD WEBSITE
              </h6>
            </div>
            <div className="relative flex-1">
              <Image
                src={study.beforeImage}
                alt={`${study.name} before redesign`}
                fill
                className="object-fill"
              />
            </div>
          </div>
          <div className="border-2 border-primary-border rounded-3xl overflow-hidden h-61 relative">
            <div className="p-3 bg-green-500/15 border-b-2 border-primary-border relative z-10">
              <h6 className="text-primary-green font-medium tracking-wider text-sm">
                <i className="ri-check-fill pr-2"></i>AFTER — BUILD.SITE REDESIGN
              </h6>
            </div>
            <div className="relative h-full">
              <Image
                src={study.afterImage}
                alt={`${study.name} after redesign`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="pb-10 xl:flex gap-3 flex-wrap grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {study.stats.map((stat) => (
            <div
              key={stat.label}
              className="xl:px-15 py-8 bg-bg-card-color border-2 border-primary-border rounded-2xl w-full xl:w-fit"
            >
              <h6 className="uppercase pb-3 text-text-secondary text-sm text-center whitespace-nowrap">
                {stat.label}
              </h6>
              <p className="text-center whitespace-nowrap">
                <span className="text-rose-500/80 font-medium line-through">
                  {stat.before}
                </span>
                <span className="text-primary-green text-xl font-bold">
                  <i className="ri-arrow-right-long-line"></i>
                  {stat.after}
                </span>
              </p>
            </div>
          ))}
        </div>

        <div className="p-8 bg-bg-card-color border rounded-2xl border-primary-border text-white cursor-pointer border-l-4 border-l-primary-green">
          <h3 className="font-black text-lg pb-2">Business Impact</h3>
          <p className="text-text-primary text-sm leading-6">{study.impact}</p>
        </div>
      </div>
    </div>
  );
}
