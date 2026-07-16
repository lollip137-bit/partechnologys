"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="text-text-primary bg-bg-color border-b border-primary-border">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 flex flex-wrap items-center justify-between py-5">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-white text-3xl whitespace-nowrap font-black">
              Build<span className="text-primary-green text-2xl">•</span>Site
            </span>
          </Link>
          <div className="inline-flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              className="text-white bg-primary-green rounded-3xl hover:bg-primary-green/80 box-border border border-transparent shadow-xs font-medium leading-5 text-sm px-4 py-2 focus:outline-none cursor-pointer hover:-translate-y-1 active:-translate-y-1 hover:shadow-sm active:shadow-sm hover:shadow-primary-green active:shadow-primary-green transition duration-300"
            >
              Get free Mockup <i className="ri-arrow-right-long-line"></i>
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center p-2 w-9 h-9 justify-center text-sm text-text-primary rounded-lg md:hidden hover:bg-bg-skills-color focus:outline-none"
              aria-controls="navbar-cta"
              aria-expanded={open}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6 cursor-pointer"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M5 7h14M5 12h14M5 17h14"
                />
              </svg>
            </button>
          </div>
          <div
            className={`${
              open ? "flex" : "hidden"
            } items-center justify-between w-full md:flex md:w-auto md:order-1`}
            id="navbar-cta"
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg bg-bg-skills-color md:flex-row md:space-x-10 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent items-center w-full">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block py-2 px-3 rounded hover:text-primary-green md:p-0 transition ${
                        isActive
                          ? "text-primary-green underline underline-offset-4 decoration-primary-green"
                          : "text-text-primary"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
