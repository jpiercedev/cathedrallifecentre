import type { Metadata } from "next";
import Image from "next/image";
import { DonateVideo } from "@/components/page/donate-video";
import { ButtonLink } from "@/components/ui/button-link";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { donateContent } from "@/content/donate";
import { createPageMetadata } from "@/lib/metadata";

import styles from "./donate.module.css";

export const metadata: Metadata = createPageMetadata({
  title: donateContent.metadata.title,
  description: donateContent.metadata.description,
  path: "/donate",
  image: donateContent.hero.image,
});

export default function DonatePage() {
  const { hero, give } = donateContent;

  return (
    <main className={styles.main} id="main-content">
      <section aria-labelledby="donate-title" className={styles.hero}>
        <Image
          alt={hero.imageAlt}
          className={styles.heroImage}
          fill
          priority
          quality={85}
          sizes="100vw"
          src={hero.image}
        />
        <div aria-hidden="true" className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <EyebrowLabel className={styles.heroEyebrow}>
              {hero.eyebrow}
            </EyebrowLabel>
            <h1 id="donate-title">
              {hero.title}
              <em>{hero.emphasis}</em>
            </h1>
            <span aria-hidden="true" className={styles.heroRule} />
            <p>{hero.description}</p>
            <ButtonLink
              className={styles.primaryButton}
              href={hero.action.href}
              newTab
            >
              {hero.action.label}
            </ButtonLink>
          </div>
          <DonateVideo {...hero.video} />
        </div>
      </section>

      <section aria-labelledby="give-title" className={styles.giveSection}>
        <div className={styles.giveContainer}>
          <div className={styles.giveGrid}>
            <div className={styles.giveCopy}>
              <EyebrowLabel className={styles.giveEyebrow}>
                {give.eyebrow}
              </EyebrowLabel>
              <h2 id="give-title">
                {give.title[0]}
                <br />
                {give.title[1]}
              </h2>
              {give.paragraphs.map((paragraph) => (
                <p className={styles.giveParagraph} key={paragraph}>
                  {paragraph}
                </p>
              ))}

              <div className={styles.giveImage}>
                <Image
                  alt={give.imageAlt}
                  fill
                  quality={85}
                  sizes="(max-width: 991px) calc(100vw - 48px), 504px"
                  src={give.image}
                />
                <div aria-hidden="true" className={styles.giveImageOverlay} />
              </div>

              <aside className={styles.checkCard}>
                <h3>{give.check.title}</h3>
                {give.check.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <address>
                  {give.check.address.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
              </aside>
            </div>

            <div className={styles.waysColumn}>
              <p className={styles.waysEyebrow}>{give.waysEyebrow}</p>
              <div>
                {give.ways.map((way) => (
                  <article className={styles.wayCard} key={way.number}>
                    <div className={styles.wayRow}>
                      <span className={styles.numberBadge}>{way.number}</span>
                      <div className={styles.wayCopy}>
                        <h3>{way.title}</h3>
                        <p>{way.description}</p>
                        {"options" in way
                          ? way.options.map((option) => (
                              <div
                                className={
                                  option.tone === "terracotta"
                                    ? styles.terracottaOption
                                    : styles.navyOption
                                }
                                key={option.title}
                              >
                                <h4 className={styles.optionTitle}>
                                  {option.title}
                                </h4>
                                <p className={styles.optionCopy}>
                                  {"lead" in option ? (
                                    <strong>{option.lead}</strong>
                                  ) : null}
                                  {option.description}
                                </p>
                              </div>
                            ))
                          : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <ButtonLink
                className={styles.primaryButtonFull}
                href={give.action.href}
                newTab
              >
                {give.action.label}
              </ButtonLink>
            </div>
          </div>

          <p className={styles.nonprofitNote}>
            {give.nonprofit.beforeLink}
            <a
              href={give.nonprofit.linkHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              {give.nonprofit.linkLabel}
            </a>
            {give.nonprofit.afterLink}
          </p>
        </div>
      </section>
    </main>
  );
}
