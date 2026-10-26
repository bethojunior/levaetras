import Image from "next/image";
import Link from "next/link";
import SiteNav from "./site-nav";
import { waLink } from "@/lib/links";
import type { Texts } from "@/lib/content-defaults";

const WaIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.8-.1 1.4Z"
    />
  </svg>
);

const icons = [
  "M5 17h14M5 17a2 2 0 1 0 4 0m6 0a2 2 0 1 0 4 0M3 13l2-6h14l2 6v4H3v-4Zm0 0h18",
  "M3 7l9-4 9 4-9 4-9-4Zm0 0v10l9 4 9-4V7M12 11v10",
  "M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  "M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4",
];
const cardColors = ["blue", "red", "yellow", "green"];
const n4 = [1, 2, 3, 4];

export default function Home({ t }: { t: Texts }) {
  const wa = (msg = t.wa_message) => waLink(t.whatsapp, msg);
  const strip = t.strip.split("\n").map((s) => s.trim()).filter(Boolean);
  const loop = [...strip, ...strip];
  return (
    <>
      <SiteNav
        links={[
          { href: "#servicos", label: t.nav_services },
          { href: "#como-funciona", label: t.nav_steps },
          { href: "#app", label: t.nav_app },
          { href: "#festival", label: t.nav_festival },
          { href: "#faq", label: t.nav_faq },
          { href: "/blog", label: t.nav_blog },
          { href: t.driver_url, label: t.nav_driver, external: true },
        ]}
        cta={t.nav_cta}
        ctaHref={wa()}
      />
      <main>
        <section className="hero">
          <div className="hero__bg" aria-hidden="true" />
          <div className="wrap hero__in">
            <div className="hero__txt">
              <p className="tag">{t.hero_tag}</p>
              <h1>
                {t.hero_title_pre} <span className="y">{t.hero_title_yellow}</span>{" "}
                {t.hero_title_mid} <span className="g">{t.hero_title_green}</span>.
              </h1>
              <p className="lead">{t.hero_lead}</p>
              <div className="cta">
                <a href={wa()} className="btn btn--yellow" target="_blank" rel="noopener">
                  <WaIcon />
                  {t.hero_cta}
                </a>
                <a href="#servicos" className="btn btn--ghost">
                  {t.hero_cta2}
                </a>
              </div>
              <ul className="stats">
                {[1, 2, 3].map((i) => (
                  <li key={i}>
                    <strong>{t[`stat_${i}_value`]}</strong>
                    <span>{t[`stat_${i}_label`]}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hero__logo">
              <Image
                src="/logo.webp"
                alt="Logo Parintins Leva e Traz - Mobilidade Urbana"
                width={400}
                height={400}
                priority
              />
            </div>
          </div>
        </section>

        <div className="strip" aria-hidden="true">
          <div className="strip__track">
            {loop.map((s, i) => (
              <span key={i} className="strip__item">
                {s}
                <i />
              </span>
            ))}
          </div>
        </div>

        <section className="sec" id="servicos">
          <div className="wrap">
            <p className="eyebrow">{t.services_eyebrow}</p>
            <h2>{t.services_title}</h2>
            <div className="grid">
              {n4.map((i) => (
                <article key={i} className={`card card--${cardColors[i - 1]}`}>
                  <div className="ico">
                    <svg viewBox="0 0 24 24">
                      <path d={icons[i - 1]} />
                    </svg>
                  </div>
                  <h3>{t[`service_${i}_title`]}</h3>
                  <p>{t[`service_${i}_text`]}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sec sec--dark" id="como-funciona">
          <div className="wrap">
            <p className="eyebrow">{t.steps_eyebrow}</p>
            <h2>{t.steps_title}</h2>
            <ol className="steps">
              {n4.map((i) => (
                <li key={i}>
                  <span className="n">{i}</span>
                  <h3>{t[`step_${i}_title`]}</h3>
                  <p>{t[`step_${i}_text`]}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="sec">
          <div className="wrap why">
            <div>
              <p className="eyebrow">{t.why_eyebrow}</p>
              <h2>{t.why_title}</h2>
              <p className="lead lead--dark">{t.why_lead}</p>
            </div>
            <ul className="checks">
              {n4.map((i) => (
                <li key={i}>
                  <b>{t[`why_${i}_title`]}</b> {t[`why_${i}_text`]}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec sec--dark app" id="app">
          <div className="wrap app__in">
            <div>
              <p className="eyebrow eyebrow--w">{t.app_eyebrow}</p>
              <h2>{t.app_title}</h2>
              <p className="lead">{t.app_lead}</p>
              <div className="stores">
                <a href={t.ios_url} className="store" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.500 2-3.700 2.100-3.800-1.200-1.700-3-1.900-3.600-2-1.500-.2-3 .9-3.800.9s-2-.9-3.300-.8c-1.700 0-3.300 1-4.100 2.500-1.800 3.100-.5 7.600 1.200 10.100.8 1.200 1.800 2.600 3.100 2.500 1.200 0 1.700-.8 3.200-.8s1.900.8 3.200.8c1.300 0 2.200-1.200 3-2.400.9-1.400 1.300-2.700 1.300-2.800 0 0-2.500-1-2.300-3.500ZM14 5.200c.7-.8 1.100-2 1-3.200-1 0-2.200.7-2.900 1.500-.6.700-1.200 1.900-1 3.100 1.100.1 2.200-.6 2.900-1.400Z"/></svg>
                  <span>{t.app_ios_label}</span>
                </a>
                <a href={t.android_url} className="store" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 2.700v18.600c0 .4.5.7.9.5l10.200-9.300L4.900 2.200c-.4-.2-.9.100-.9.500Zm12.300 7.500 2.900-1.700c.6-.4.600-1.200 0-1.500L6.300 1.600l8.400 8.500 1.600.1Zm0 3.600-1.600.1-8.400 8.500 12.900-5.200c.6-.3.6-1.100 0-1.500l-2.900-1.900Z"/></svg>
                  <span>{t.app_android_label}</span>
                </a>
              </div>
            </div>
            <div className="app__logo">
              <Image src="/logo.webp" alt="" width={300} height={300} />
            </div>
          </div>
        </section>

        <section className="driver">
          <div className="wrap driver__in">
            <div>
              <p className="eyebrow">{t.driver_eyebrow}</p>
              <h2>{t.driver_title}</h2>
              <p>{t.driver_lead}</p>
            </div>
            <a href={t.driver_url} className="btn btn--dark" target="_blank" rel="noopener">
              {t.driver_cta}
            </a>
          </div>
        </section>

        <section className="festival" id="festival">
          <div className="festival__half festival__half--blue" />
          <div className="festival__half festival__half--red" />
          <div className="wrap festival__in">
            <p className="eyebrow eyebrow--w">{t.fest_eyebrow}</p>
            <h2>{t.fest_title}</h2>
            <p className="lead">{t.fest_lead}</p>
            <a href={wa(t.fest_wa_message)} className="btn btn--yellow" target="_blank" rel="noopener">
              {t.fest_cta}
            </a>
          </div>
        </section>

        <section className="sec" id="faq">
          <div className="wrap faq">
            <div>
              <p className="eyebrow">{t.faq_eyebrow}</p>
              <h2>{t.faq_title}</h2>
            </div>
            <div className="acc">
              {[1, 2, 3, 4, 5].map((i) => (
                <details key={i} open={i === 1}>
                  <summary>{t[`faq_${i}_q`]}</summary>
                  <p>{t[`faq_${i}_a`]}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="final">
          <div className="wrap final__in">
            <Image src="/logo.webp" alt="" width={120} height={120} />
            <h2>{t.final_title}</h2>
            <p>{t.final_sub}</p>
            <a href={wa()} className="btn btn--yellow" target="_blank" rel="noopener">
              {t.final_cta}
            </a>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot__in">
          <div className="brand">
            <Image src="/logo.webp" alt="" width={40} height={40} />
            <span>
              Leva <b>&amp;</b> Traz
            </span>
          </div>
          <p>{t.footer_line}</p>
          <p className="foot__links">
            <Link href="/blog">{t.nav_blog}</Link>
            <a href={t.ios_url} target="_blank" rel="noopener">App Store</a>
            <a href={t.android_url} target="_blank" rel="noopener">Google Play</a>
            <a href={t.driver_url} target="_blank" rel="noopener">{t.nav_driver}</a>
          </p>
          {t.instagram && (
            <a href={t.instagram} target="_blank" rel="noopener" className="foot__ig">
              Instagram
            </a>
          )}
          <p className="small">
            © {new Date().getFullYear()} {t.footer_copy}
          </p>
        </div>
      </footer>

      <a href={wa()} className="fab" aria-label={t.final_cta} target="_blank" rel="noopener">
        <WaIcon />
      </a>
    </>
  );
}
