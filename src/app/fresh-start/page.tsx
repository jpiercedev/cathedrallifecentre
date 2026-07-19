import type { Metadata } from "next";
import Image from "next/image";
import { InteriorHero } from "@/components/page/interior-hero";
import { Container } from "@/components/ui/container";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { freshStartContent } from "@/content/fresh-start";
import { createPageMetadata } from "@/lib/metadata";

import styles from "./fresh-start.module.css";

export const metadata: Metadata = createPageMetadata({
  title: freshStartContent.metadata.title,
  description: freshStartContent.metadata.description,
  path: "/fresh-start",
  image: freshStartContent.hero.image,
});

export default function FreshStartPage() {
  const { hero, newBeginning, gallery, donations } = freshStartContent;

  return (
    <main className={styles.main} id="main-content">
      <InteriorHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Ministries" },
          { label: "Fresh Start" },
        ]}
        description={hero.description}
        eyebrow={hero.eyebrow}
        image={hero.image}
        imagePosition="50% 45%"
        innerClassName={styles.heroInner}
        scrollCueClassName={styles.scrollCue}
        scrollTargetId="clc-content"
        titleId="fresh-start-title"
      >
        {hero.title}
      </InteriorHero>

      <section
        aria-labelledby="new-beginning-title"
        className={styles.section}
        id="clc-content"
      >
        <Container className={styles.split}>
          <div className={styles.introImage}>
            <Image
              alt={newBeginning.imageAlt}
              fill
              quality={85}
              sizes="(max-width: 991px) calc(100vw - 48px), 508px"
              src={newBeginning.image}
            />
          </div>
          <div className={styles.copy}>
            <EyebrowLabel className={styles.eyebrow}>
              {newBeginning.eyebrow}
            </EyebrowLabel>
            <h2 id="new-beginning-title">{newBeginning.title}</h2>
            {newBeginning.paragraphs.map((paragraph, index) => (
              <p
                className={index === 0 ? styles.paragraphLead : styles.paragraph}
                key={paragraph}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      <section aria-label="Fresh Start homes" className={styles.gallery}>
        <div className={styles.galleryInner}>
          {gallery.map((item) => (
            <div className={styles.galleryImage} key={item.image}>
              <Image
                alt={item.alt}
                fill
                quality={85}
                sizes="(max-width: 767px) 88vw, 48vw"
                src={item.image}
              />
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="fresh-start-donations-title"
        className={styles.section}
      >
        <Container className={styles.donationsInner}>
          <EyebrowLabel className={styles.eyebrow}>
            {donations.eyebrow}
          </EyebrowLabel>
          <h2 id="fresh-start-donations-title">{donations.title}</h2>
          {donations.paragraphs.map((paragraph, index) => (
            <p
              className={index === 0 ? styles.paragraphLead : styles.paragraph}
              key={paragraph}
            >
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
