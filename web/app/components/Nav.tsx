"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/user", label: "Request Help" },
  { href: "/admin", label: "Admin" },
  { href: "/speed", label: "Connectivity" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="bg-white">
      <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-semibold tracking-tight text-[--color-foreground]">ara</span>
        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-black text-white"
                    : "text-[--color-muted] hover:text-[--color-foreground] hover:bg-zinc-100"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
