"use client";
import { useState } from "react";
import Image from "next/image";
export default function SiteNav({
  links,
  cta,
  ctaHref,
}: {
  links: { href: string; label: string; external?: boolean }[];
  cta: string;
  ctaHref: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav" id="top">
      <div className="wrap nav__in">
        <a href="#top" className="brand" aria-label="Parintins Leva e Traz">
          <Image src="/logo.webp" alt="" width={48} height={48} priority />
          <span>
            Leva <b>&amp;</b> Traz
          </span>
        </a>
        <nav
          className={`menu${open ? " open" : ""}`}
          aria-label="Principal"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener" } : {})}
              className={l.external ? "menu__driver" : undefined}
            >
              {l.label}
            </a>
          ))}
          <a href={ctaHref} className="btn btn--yellow btn--sm" target="_blank" rel="noopener">
            {cta}
          </a>
        </nav>
        <button
          className="burger"
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
