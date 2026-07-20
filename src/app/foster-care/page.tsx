import { MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Image from "next/image";
import { InteriorHero } from "@/components/page/interior-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { fosterCareContent } from "@/content/foster-care";
import { createPageMetadata } from "@/lib/metadata";

import { FosterContactForm } from "./foster-contact-form";
import styles from "./foster-care.module.css";

export const metadata: Metadata = createPageMetadata({
  title: fosterCareContent.metadata.title,
  description: fosterCareContent.metadata.description,
  path: "/foster-care",
  image: fosterCareContent.hero.image,
});

export default function FosterCarePage() {
  const { hero, scripture, heart, programs, contact } = fosterCareContent;

  return (
    <main className={styles.main} id="main-content">
      <InteriorHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Ministries" },
          { label: "Foster Care" },
        ]}
        description={hero.description}
        eyebrow={hero.eyebrow}
        heroClassName={styles.hero}
        image={hero.image}
        imagePosition="50% 35%"
        innerClassName={styles.heroInner}
        overlayClassName={styles.heroOverlay}
        scrollCueClassName={styles.scrollCue}
        scrollTargetId="clc-content"
        titleId="foster-care-title"
      >
        {hero.titleLead}{" "}
        <br />
        {hero.titleSecondLine} <em>{hero.titleEmphasis}</em>
      </InteriorHero>

      <section className={styles.scripture} id="clc-content">
        <blockquote>
          <span aria-hidden="true" className={styles.quoteMark} />
          <p>
            {scripture.lead} <strong>{scripture.emphasis}</strong>
          </p>
          <cite>{scripture.reference}</cite>
          <span aria-hidden="true" className={styles.citationRule} />
        </blockquote>
      </section>

      <section aria-labelledby="heart-title" className={styles.heartSection}>
        <Container className={`${styles.sourceContainer} ${styles.heartGrid}`}>
          <div className={styles.heartImage}>
            <Image
              alt={heart.imageAlt}
              fill
              quality={85}
              sizes="(max-width: 479px) calc(100vw - 40px), (max-width: 767px) calc(100vw - 48px), (max-width: 991px) calc(100vw - 64px), 160px"
              src={heart.image}
            />
          </div>
          <div className={styles.heartCopy}>
            <EyebrowLabel className={styles.sectionEyebrow}>
              {heart.eyebrow}
            </EyebrowLabel>
            <h2 id="heart-title">{heart.title}</h2>
            {heart.paragraphs.map((paragraph) => (
              <p className={styles.bodyCopy} key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="programs-title"
        className={styles.programsSection}
      >
        <Container
          className={`${styles.sourceContainer} ${styles.programsGrid}`}
        >
          <div className={styles.programsCopy}>
            <EyebrowLabel className={styles.sectionEyebrow}>
              {programs.eyebrow}
            </EyebrowLabel>
            <h2 id="programs-title">{programs.title}</h2>
            {programs.paragraphs.map((paragraph) => (
              <p className={styles.bodyCopy} key={paragraph}>
                {paragraph}
              </p>
            ))}

            <aside className={styles.timingCard}>
              <div className={styles.timingImage}>
                <Image
                  alt={programs.imageAlt}
                  fill
                  quality={85}
                  sizes="(max-width: 479px) calc(100vw - 40px), (max-width: 767px) calc(100vw - 48px), (max-width: 991px) calc(100vw - 64px), 504px"
                  src={programs.image}
                />
              </div>
              <div className={styles.timingCopy}>
                <p className={styles.timingEyebrow}>
                  {programs.timingEyebrow}
                </p>
                <p>{programs.timing}</p>
              </div>
            </aside>
          </div>

          <div className={styles.programListColumn}>
            <EyebrowLabel className={styles.sectionEyebrow}>
              {programs.listEyebrow}
            </EyebrowLabel>
            <div className={styles.programList}>
              {programs.items.map((program) => {
                const comingSoon = program.status === "Coming Soon";
                return (
                  <article
                    className={comingSoon ? styles.comingProgram : undefined}
                    key={program.number}
                  >
                    <span className={styles.programNumber}>{program.number}</span>
                    <div className={styles.programCopy}>
                      {!comingSoon ? (
                        <p className={styles.programStatus}>{program.status}</p>
                      ) : null}
                      <div className={styles.programTitleRow}>
                        <h3>{program.title}</h3>
                        {comingSoon ? (
                          <span className={styles.comingSoon}>Coming Soon</span>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className={styles.primaryButtonWrap}>
              <ButtonLink
                className={styles.primaryButton}
                href={programs.action.href}
              >
                {programs.action.label}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="contact-title" className={styles.contactSection}>
        <Container className={`${styles.contactContainer} ${styles.contactGrid}`}>
          <div className={styles.contactCopy}>
            <EyebrowLabel className={styles.sectionEyebrow}>
              {contact.eyebrow}
            </EyebrowLabel>
            <h2 id="contact-title">{contact.title}</h2>
            <p className={styles.contactDescription}>{contact.description}</p>

            <div className={styles.contactDetails}>
              <div className={styles.contactDetail}>
                <span aria-hidden="true" className={styles.contactIcon}>
                  <MapPinIcon />
                </span>
                <div>
                  <p className={styles.contactLabel}>Address</p>
                  <address>
                    {contact.address.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </address>
                </div>
              </div>
              <div className={styles.contactDetail}>
                <span aria-hidden="true" className={styles.contactIcon}>
                  <PhoneIcon />
                </span>
                <div>
                  <p className={styles.contactLabel}>Phone</p>
                  <a href={contact.phone.href}>{contact.phone.label}</a>
                </div>
              </div>
            </div>
          </div>

          <FosterContactForm className={styles.formCard} />
        </Container>
      </section>
    </main>
  );
}
