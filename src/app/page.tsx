import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import ParticlesBackground from "@/components/ParticlesBackground";
import Image from "next/image";

const stack = [
  { icon: "ri-wordpress-fill", label: "WorkPress" },
  { icon: "ri-pencil-ruler-2-fill", label: "UI/UX Design" },
  { icon: "ri-shopping-cart-2-fill", label: "E-commerce" },
  { icon: "ri-smartphone-fill", label: "Mobile-First" },
  { icon: "ri-seo-fill", label: "SEO Optimized" },
  { icon: "ri-rocket-fill", label: "Landing Pages" },
  { icon: "ri-tools-fill", label: "Maintenance" },
  { icon: "ri-collage-fill", label: "White Label" },
  { icon: "ri-magic-fill", label: "Redesign" },
  { icon: "ri-figma-fill", label: "Figma Design" },
  { icon: "ri-global-fill", label: "Hosting Setup" },
  { icon: "ri-git-repository-private-fill", label: "SSL & Security" },
];

const whyUs = [
  {
    icon: "ri-flashlight-fill",
    title: "Fast Delivery",
    body: "Most projects delivered in 7–14 business days. We move fast without cutting corners — because your time is money.",
  },
  {
    icon: "ri-focus-2-line",
    title: "Conversion-Focused Design",
    body: "Every design decision is made with one goal: turn your visitors into leads, clients, and revenue.",
  },
  {
    icon: "ri-rotate-lock-fill",
    title: "Full Transparency",
    body: "Regular updates, clear communication, and no hidden fees. You always know exactly where your project stands.",
  },
  {
    icon: "ri-earth-fill",
    title: "Global Clients, Personal Care",
    body: "We have worked with clients in 10+ countries, yet every client gets dedicated, personal attention.",
  },
];

const services = [
  {
    title: "Custom Websites",
    body: "Fully responsive, SEO-ready websites built from scratch — no templates, no shortcuts. Tailored entirely to your brand, your goals, and your audience. We design in Figma first, you approve, then we build.",
    tags: ["Wordpress", "HTML/CSS/JS", "Mobile-First", "SEO Ready"],
  },
  {
    title: (
      <>
        Landing Pages & <br />
        E-commerce
      </>
    ),
    body: "High-converting landing pages that turn visitors into leads — and full e-commerce stores with cart, checkout, and payment integration, ready to sell from day one. Built for results, not just looks.",
    tags: ["Wordpress", "HTML/CSS/JS", "Mobile-First", "SEO Ready"],
  },
  {
    title: (
      <>
        Redesign & <br /> Speed Optimization
      </>
    ),
    body: "Your old website is costing you leads. We transform it — modern UI/UX, faster load times, better SEO, full mobile optimization. We show you the new design before writing a single line of code.",
    tags: ["Wordpress", "HTML/CSS/JS", "Mobile-First", "SEO Ready"],
  },
  {
    title: (
      <>
        Maintenance & <br /> White-Label
      </>
    ),
    body: "Keep your site updated, secure, and fast with our monthly care plans. For agencies, we build under your brand — full NDA, clean code, your clients never know we exist. Scale without hiring developers.",
    tags: ["Wordpress", "HTML/CSS/JS", "Mobile-First", "SEO Ready"],
  },
];

const featuredWork = [
  {
    domain: "qbaestateagency.com",
    image: "/assets/qba.jpeg",
    tag: "REAL ESTATE · LUXURY · UAE",
    title: "QBA Estate Agency",
    body: "Luxury real estate platform with custom dark design and full service showcase.",
  },
  {
    domain: "chaletschamonix.com",
    image: "/assets/chaletschamonix.jpeg",
    tag: "LUXURY TRAVEL · FRANCE",
    title: "Chalets Chamonix",
    body: "Luxury Alpine chalet booking platform with immersive visuals and premium brand feel.",
  },
  {
    domain: "rigidfitness.fit",
    image: "/assets/rigid.jpeg",
    tag: "FITNESS & HEALTH · EUROPE",
    title: "Rigid Fitness",
    body: "Bold fitness brand site with program showcase, trainer profiles, and membership sign-up flow.",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex-1">
        <section className="relative min-h-screen h-auto flex flex-col bg-bg-hero-color isolate">
          <div className="absolute left-1/2 top-44 -translate-x-1/2 h-0 w-100 bg-primary-green rounded-full opacity-10 shadow-[0_0_250px_150px_#14A800] shadow-primary-green -z-30"></div>
          <ParticlesBackground />
          <div className="absolute inset-0 bg-[linear-gradient(rgb(26_38_24/0.35)_1px,transparent_1px),linear-gradient(90deg,rgb(26_38_24/0.35)_1px,transparent_1px)] bg-[size:64px_64px] -z-10"></div>
          <div className="w-full container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 flex flex-1 flex-col justify-center items-start text-white py-20 h-full">
            <h4 className="bg-green-300/10 px-4 py-1 text-primary-green font-medium border-3 border-green-500/20 rounded-4xl mb-6">
              • Premium Web Agency · Est. 2024
            </h4>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-12">
              We Build Websites <br /> That{" "}
              <span className="text-primary-green">Win Clients</span> <br /> &
              Close Deals.
            </h1>
            <p className="text-text-primary mb-8 md:max-w-lg">
              From custom landing pages to full e-commerce platforms — Build.Site
              delivers fast, modern, and conversion-ready websites for ambitious
              businesses worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-5 w-full">
              <button
                type="button"
                className="text-white font-bold bg-primary-green rounded-4xl hover:bg-primary-green/80 box-border border border-transparent shadow-xs leading-5 text-sm px-10 py-4 cursor-pointer hover:shadow-lg active:shadow-lg shadow-primary-green/60 hover:-translate-y-1 active:-translate-y-1 transition-all duration-400 focus:outline-none"
              >
                Get a free Mockup <i className="ri-arrow-right-long-line"></i>
              </button>
              <button
                type="button"
                className="text-white bg-transparent rounded-4xl box-border border border-b border-primary-border shadow-xs font-bold leading-5 text-sm px-10 py-4 focus:outline-none cursor-pointer hover:text-primary-green hover:border-primary-green active:text-primary-green active:border-primary-green transition"
              >
                See our Work<i className="ri-arrow-right-long-line"></i>
              </button>
            </div>
            <hr className="border-primary-border w-full my-10" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-18">
              <div>
                <h3 className="text-4xl font-bold mb-2">
                  80<span className="text-primary-green ml-1">+</span>
                </h3>
                <p className="text-text-secondary text-xl">Projects Delivered</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold mb-2">
                  15<span className="text-primary-green ml-1">+</span>
                </h3>
                <p className="text-text-secondary text-xl">Industries Served</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold mb-2">
                  98<span className="text-primary-green ml-1">%</span>
                </h3>
                <p className="text-text-secondary text-xl">Client Satisfaction</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold mb-2">
                  10<span className="text-primary-green ml-1">+</span>
                </h3>
                <p className="text-text-secondary text-xl">Countries Reached</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="bg-bg2-color whitespace-nowrap py-8 flex overflow-x-auto overflow-hidden border-y border-primary-border text-text-secondary text-sm [&::-webkit-scrollbar]:hidden">
            {[0, 1].map((row) => (
              <div
                key={row}
                className="flex animate-slider-scroll gap-20 justify-center items-center"
              >
                {stack.map((item) => (
                  <div key={item.label}>
                    <i className={`${item.icon} text-primary-green text-xl mr-1`}></i>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-bg-color h-auto">
          <div className="container mx-auto px-4 md:px-8 lg:px-10 text-text-primary pt-50 flex flex-col xl:flex-row gap-20 justify-center items-center">
            <div>
              <h4 className="text-primary-green text-md pb-6 font-bold">
                {" "}
                — WHO WE ARE
              </h4>
              <h2 className="text-5xl font-black text-white pb-6">
                Not Just an Agency — <br />{" "}
                <span className="text-primary-green">A Growth Partner</span>
              </h2>
              <p className="pb-4">
                Build.Site is a results-driven web agency built on three
                principles: deliver fast, build with quality, and always keep the
                client experience first. We are not a freelancer you hire once —
                we are the team that grows with your business.
              </p>
              <p className="pb-7">
                We work with startups, growing brands, and established
                businesses across the US, UK, Europe, UAE, and Australia.
                Transparent process, clear communication, clean code.
              </p>
              <div className="flex whitespace-nowrap gap-x-3 flex-wrap text-sm">
                {[
                  "WordPress",
                  "HTML / CSS / JS",
                  "Figma Design",
                  "WooCommerce",
                  "Elementor",
                  "React",
                  "On-Page SEO",
                ].map((tag) => (
                  <h4
                    key={tag}
                    className="bg-green-300/10 px-4 py-1 font-medium border-3 border-primary-border rounded-4xl mb-6 w-fit"
                  >
                    {tag}
                  </h4>
                ))}
              </div>
            </div>

            <div className="w-full flex flex-col gap-y-6">
              {whyUs.map((item) => (
                <div
                  key={item.title}
                  className="p-8 bg-bg-card-color border rounded-3xl border-primary-border flex items-start gap-6 hover:border-secondary-border active:border-secondary-border transition duration-300 cursor-pointer"
                >
                  <div className="inline-flex justify-center items-center bg-green-600/20 px-3 py-2 border-2 rounded-xl border-green-400/20">
                    <i className={`${item.icon} text-primary-green text-2xl font-bold`}></i>
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-white pb-2">{item.title}</h5>
                    <p className="text-sm">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-bg-color h-auto">
          <div className="container mx-auto px-4 md:px-8 lg:px-10 text-text-primary pt-50 pb-25 flex flex-col gap-20">
            <div className="flex flex-col gap-8 lg:flex-row items-start lg:justify-between lg:items-end">
              <div>
                <h4 className="text-primary-green text-md pb-6 font-bold">
                  {" "}
                  — WHAT WE DO
                </h4>
                <h2 className="text-5xl font-black text-white pb-6">
                  Services Built for <br />{" "}
                  <span className="text-primary-green">Real Business Results</span>
                </h2>
                <p className="pb-4 block md:inline text-lg">
                  We don&apos;t offer generic solutions. Every service we provide
                  is tailored to <br /> help your business get more leads, more
                  calls, and more sales — online.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  className="text-white float-right bg-transparent rounded-4xl box-border border border-b border-primary-border shadow-xs font-bold leading-5 text-sm px-10 py-4 focus:outline-none cursor-pointer hover:text-primary-green hover:border-primary-green active:text-primary-green active:border-primary-green transition whitespace-nowrap"
                >
                  See our Work<i className="ri-arrow-right-long-line"></i>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {services.map((service, i) => (
                <div
                  key={i}
                  className="p-8 bg-bg-card-color border rounded-3xl border-primary-border flex flex-col items-start gap-6 text-white hover:bg-primary-green/15 active:bg-primary-green/15 hover:text-primary-green active:text-primary-green cursor-pointer hover:border-l-6 hover:border-l-primary-green active:border-l-primary-green transition-all duration-600"
                >
                  <div className="w-full flex justify-between items-center">
                    <h3 className="font-black text-3xl">{service.title}</h3>
                    <div className="bg-red border-primary-border rounded-full">
                      <i className="ri-arrow-right-long-line bg-transparent border-4 border-primary-border rounded-full p-2"></i>
                    </div>
                  </div>
                  <p className="text-text-primary text-xl">{service.body}</p>
                  <div className="flex gap-x-1 flex-wrap">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-bg-color px-4 py-1 font-medium border-3 border-primary-border rounded-4xl w-fit text-text-primary z-20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-bg2-color h-auto">
          <div className="container mx-auto px-4 md:px-8 lg:px-10 text-text-primary py-25">
            <div className="flex flex-col gap-8 lg:flex-row items-start lg:justify-between lg:items-end">
              <div>
                <h4 className="text-primary-green text-md pb-6 font-bold">
                  {" "}
                  — FEATURED WORK
                </h4>
                <h2 className="text-5xl font-black text-white">
                  A Few of Our
                  <br /> <span className="text-primary-green">Recent Projects</span>
                </h2>
              </div>
              <div>
                <a
                  href="/work"
                  className="text-white float-right bg-transparent rounded-4xl box-border border border-b border-primary-border shadow-xs font-bold leading-5 text-sm px-10 py-4 focus:outline-none cursor-pointer hover:text-primary-green hover:border-primary-green transition whitespace-nowrap inline-flex items-center gap-1"
                >
                  View ALL 80+ Projects<i className="ri-arrow-right-long-line"></i>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7 mt-10">
              {featuredWork.map((project) => (
                <div
                  key={project.title}
                  className="bg-bg-card-color border-2 rounded-2xl border-primary-border cursor-pointer hover:-translate-y-1.5 active:-translate-y-1.5 transition-all duration-200"
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
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-primary-green font-medium mb-2 text-xs">
                      {project.tag}
                    </h4>
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-sm">{project.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center items-center">
              <a
                href="/work"
                className="text-white font-bold bg-primary-green rounded-4xl hover:bg-primary-green/80 box-border border border-transparent shadow-xs leading-5 text-sm px-10 py-4 cursor-pointer hover:shadow-lg active:shadow-lg shadow-primary-green/60 hover:-translate-y-1 active:-translate-y-1 transition-all duration-400 focus:outline-none inline-flex items-center gap-1"
              >
                See All Projects & Case Studies<i className="ri-arrow-right-long-line"></i>
              </a>
            </div>
          </div>
        </section>

        <section className="bg-bg2-color h-auto">
          <div className="container mx-auto px-4 md:px-8 lg:px-10 text-text-primary pt-25 pb-25 flex flex-col xl:flex-row gap-15">
            <div className="left-side xl:w-1/2 w-full flex flex-col gap-10 justify-center items-center">
              <div>
                <h4 className="text-primary-green text-md pb-6 font-bold">
                  {" "}
                  — Get In Touch
                </h4>
                <h2 className="text-5xl font-black text-white pb-6">
                  Ready to Build
                  <br /> <span className="text-primary-green">Something Great?</span>
                </h2>
                <p className="pb-4">
                  Fill in the form and we will get back to you within 24 hours
                  with a clear plan and timeline. No pressure, no commitment.
                </p>
              </div>
              <div className="w-full flex flex-col gap-y-6">
                {[
                  {
                    icon: "ri-whatsapp-line",
                    title: "WhatsApp (Fasttest)",
                    body: "+92 328 2754995 · Replies in minutes",
                  },
                  {
                    icon: "ri-instagram-line",
                    title: "Instagram",
                    body: "@_build.site · DMs open",
                  },
                  {
                    icon: "ri-linkedin-fill",
                    title: "LinkedIn",
                    body: "Build.Site Agency",
                  },
                  {
                    icon: "ri-mail-fill",
                    title: "Email",
                    body: "hello@buildsite.agency",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-8 bg-bg-card-color border rounded-3xl border-primary-border flex items-start gap-6 cursor-pointer md:hover:translate-x-1.5 hover:translate-x-0.5 active:translate-x-2 hover:border-secondary-border active:border-secondary-border transition duration-300"
                  >
                    <div className="inline-flex justify-center items-center bg-green-600/20 px-3 py-2 border-2 rounded-xl border-green-400/20">
                      <i className={`${item.icon} text-primary-green text-2xl font-bold`}></i>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-white pb-2">{item.title}</h5>
                      <p className="text-sm">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="right-side w-full xl:w-1/2 bg-bg-card-color py-13 px-5 sm:p-15 border-4 border-primary-border rounded-4xl">
              <h1 className="font-black text-2xl sm:text-3xl text-white pb-12">
                Send Us a Message
              </h1>
              <form className="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-7 sm:gap-x-3 pb-7">
                  <div className="w-full">
                    <label className="block pb-3 text-lg" htmlFor="firstName">
                      FIRST NAME
                    </label>
                    <input
                      id="firstName"
                      className="rounded-xl bg-bg-color p-4 border-2 border-primary-border w-full focus:outline-none focus:border-primary-green"
                      type="text"
                      placeholder="John"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block pb-3 text-lg" htmlFor="lastName">
                      LAST NAME
                    </label>
                    <input
                      id="lastName"
                      className="rounded-xl bg-bg-color p-4 border-2 border-primary-border w-full focus:outline-none focus:border-primary-green"
                      type="text"
                      placeholder="Sedn"
                    />
                  </div>
                </div>
                <div className="pb-7 w-full">
                  <label className="block pb-3 text-lg" htmlFor="email">
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="email"
                    className="w-full rounded-xl bg-bg-color p-4 border-2 border-primary-border focus:outline-none focus:border-primary-green"
                    type="email"
                    placeholder="john@company.com"
                  />
                </div>
                <div className="pb-7">
                  <label className="block pb-3 text-lg" htmlFor="service">
                    SERVICES NEEDED
                  </label>
                  <select
                    id="service"
                    className="rounded-xl bg-bg-color p-4 border-2 border-primary-border w-full appearance-none focus:outline-none focus:border-primary-green"
                    defaultValue=""
                  >
                    <option value="" className="text-white">
                      Select a service...
                    </option>
                    <option value="custom-website">CUSTOM WEBSITE</option>
                    <option value="landing-page">LANDING PAGE</option>
                    <option value="ecommerce-store">E-COMMERCE STORE</option>
                    <option value="redesign">WEBSITE REDESIGN</option>
                    <option value="maintenance">MAINTENANCE PLAN</option>
                  </select>
                </div>
                <div className="pb-7">
                  <label className="block pb-3" htmlFor="message">
                    TELL US ABOUT YOUR PROJECT
                  </label>
                  <textarea
                    id="message"
                    className="rounded-xl bg-bg-color p-4 border-2 border-primary-border w-full h-32 focus:outline-none focus:border-primary-green"
                    placeholder="Briefly describe what you need — industry, features, references, rough budget..."
                  ></textarea>
                </div>
                <div>
                  <button
                    type="button"
                    className="block mx-auto text-white font-bold bg-primary-green rounded-4xl hover:bg-primary-green/80 box-border border border-transparent shadow-xs leading-5 text-sm px-10 py-4 cursor-pointer hover:shadow-lg active:shadow-lg shadow-primary-green/60 hover:-translate-y-1 active:-translate-y-1 transition-all duration-400 focus:outline-none w-full"
                  >
                    Get a free Mockup <i className="ri-send-plane-fill"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingContact />
    </>
  );
}
