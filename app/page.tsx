import Link from "next/link";
import Image from "next/image";
import React from "react";
import Particles from "./components/particles";

// Navigation items (tanpa Android App sekarang)
const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      
      {/* Navigation */}
      <nav className="my-16 animate-fade-in">
        <ul className="flex items-center justify-center gap-4">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : "_self"}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Top Glow */}
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />

      {/* Particles */}
      <Particles className="absolute inset-0 -z-10 animate-fade-in" quantity={100} />

      {/* Title */}
      <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text">
        cashpay
      </h1>

      {/* Bottom Glow */}
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />

      {/* Subtitle + Android App Button */}
      <div className="my-16 text-center animate-fade-in flex flex-col items-center gap-4">
        <h2 className="text-sm text-zinc-500">
          I'm building{" "}
          <Link
            target="_blank"
            href="https://unkey.dev"
            className="underline duration-500 hover:text-zinc-300"
            rel="noopener noreferrer"
          >
            unkey.dev
          </Link>{" "}
          to solve API authentication and authorization for developers.
        </h2>

        {/* Android App Google Play Badge */}
        <Link
          href="https://play.google.com/store/apps/details?id=com.your.package" // Ganti dengan link asli
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/google-play-app-store.png" // Ganti sesuai file di folder /public
            alt="Get it on Google Play"
            width={160}
            height={60}
            className="hover:opacity-80"
          />
        </Link>
      </div>
    </div>
  );
}
