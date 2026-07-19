import type { Metadata } from "next";
import Image from "next/image";
import { InteriorHero } from "@/components/page/interior-hero";
import { Container } from "@/components/ui/container";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { theMarketContent } from "@/content/the-market";
import { createPageMetadata } from "@/lib/metadata";

import styles from "./the-market.module.css";

export const metadata: Metadata = createPageMetadata({
  title: theMarketContent.metadata.title,
  description: theMarketContent.metadata.description,
  path: "/the-market",
  image: theMarketContent.hero.image,
});

export default function TheMarketPage() {
  const { hero, practicalNeeds, donations } = theMarketContent;

  return (
    <main className={styles.main} id="main-content">
      <InteriorHero
        action={hero.action}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Ministries" },
          { label: "The Market" },
        ]}
        description={hero.description}
        eyebrow={hero.eyebrow}
        image={hero.image}
        imagePosition="50% 45%"
        scrollTargetId="clc-content"
        titleId="the-market-title"
      >
        A place where families
        <br aria-hidden="true" className={styles.heroBreakDesktop} />{" "}
        are seen
        <br aria-hidden="true" className={styles.heroBreakTablet} />{" "}
        <em>and valued.</em>
      </InteriorHero>

      <section
        aria-labelledby="practical-needs-title"
        className={styles.section}
        id="clc-content"
      >
        <Container className={styles.split}>
          <div className={styles.imageFrame}>
            <Image
              alt={practicalNeeds.imageAlt}
              fill
              quality={85}
              sizes="(max-width: 991px) calc(100vw - 48px), 508px"
              src={practicalNeeds.image}
            />
          </div>
          <div className={styles.copy}>
            <EyebrowLabel>{practicalNeeds.eyebrow}</EyebrowLabel>
            <h2 id="practical-needs-title">{practicalNeeds.title}</h2>
            {practicalNeeds.paragraphs.map((paragraph) => (
              <p className={styles.paragraph} key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="market-donations-title"
        className={`${styles.section} ${styles.donations}`}
      >
        <Container className={styles.donationsInner}>
          <EyebrowLabel>{donations.eyebrow}</EyebrowLabel>
          <h2 id="market-donations-title">{donations.title}</h2>
          {donations.paragraphs.map((paragraph) => (
            <p className={styles.paragraph} key={paragraph}>
              {paragraph}
            </p>
          ))}
          <aside className={styles.note}>
            <p className={styles.noteLabel}>{donations.note.label}</p>
            <p>{donations.note.text}</p>
          </aside>
        </Container>
      </section>
    </main>
  );
}
