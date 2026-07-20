import type { Metadata } from "next";
import { MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { ContactForm } from "@/components/home/contact-form";
import { InteriorHero } from "@/components/page/interior-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { residencyProgramsContent } from "@/content/residency-programs";
import { createPageMetadata } from "@/lib/metadata";

import styles from "./residency-programs.module.css";

export const metadata: Metadata = createPageMetadata({
  title: residencyProgramsContent.metadata.title,
  description: residencyProgramsContent.metadata.description,
  path: "/residency-programs",
  image: residencyProgramsContent.hero.image,
});

export default function ResidencyProgramsPage() {
  const { hero, programs, contact } = residencyProgramsContent;

  return (
    <main className={styles.main} id="main-content">
      <InteriorHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Ministries" },
          { label: "Residency Programs" },
        ]}
        description={hero.description}
        fadeClassName={styles.heroFade}
        heroClassName={styles.hero}
        image={hero.image}
        imagePosition="left top"
        innerClassName={styles.heroInner}
        overlayClassName={styles.heroOverlay}
        scrollCueClassName={styles.scrollCue}
        scrollTargetId="clc-content"
        titleId="residency-programs-title"
      >
        {hero.titleLead} <em>{hero.titleEmphasis}</em>
      </InteriorHero>

      <section
        aria-labelledby="programs-title"
        className={styles.programs}
        id="clc-content"
      >
        <Container className={styles.programsInner}>
          <header className={styles.programsHeading}>
            <EyebrowLabel className={styles.eyebrow}>
              {programs.eyebrow}
            </EyebrowLabel>
            <h2 id="programs-title">{programs.title}</h2>
            <p className={styles.programsDescription}>
              {programs.description}
            </p>
          </header>

          <div className={styles.programGrid}>
            {programs.items.map((program) => (
              <article className={styles.programCard} key={program.title}>
                <Image
                  alt={
                    "age" in program
                      ? `${program.title} ${program.age}`
                      : program.title
                  }
                  fill
                  quality={85}
                  sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 991px) calc(50vw - 36px), 344px"
                  src={program.image}
                />
                <div aria-hidden="true" className={styles.cardOverlay} />
                <h3>
                  {program.title}
                  {"age" in program ? (
                    <span className={styles.age}> {program.age}</span>
                  ) : null}
                </h3>
              </article>
            ))}
          </div>

          <div className={styles.applyRow}>
            <ButtonLink
              className={styles.applyButton}
              href={programs.applicationUrl}
            >
              Apply For Residency
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="contact-title"
        className={styles.contact}
        id="contact"
      >
        <div className={styles.contactInner}>
          <div className={styles.contactCopy}>
            <EyebrowLabel className={styles.contactEyebrow}>
              {contact.eyebrow}
            </EyebrowLabel>
            <h2 id="contact-title">{contact.title}</h2>
            <p className={styles.contactDescription}>{contact.description}</p>

            <div className={styles.contactDetail}>
              <span aria-hidden="true">
                <MapPinIcon />
              </span>
              <p>
                <strong>Address</strong>
                {contact.address.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            </div>

            <div className={styles.contactDetail}>
              <span aria-hidden="true">
                <PhoneIcon />
              </span>
              <p>
                <strong>Phone</strong>
                <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
              </p>
            </div>
          </div>

          <ContactForm
            className={styles.contactForm}
            compact
            heading={null}
            idPrefix="classes"
            namePlaceholder="Your name"
            submitLabel="Send Message"
            webflowDelivery={contact.webflowDelivery}
          />
        </div>
      </section>
    </main>
  );
}
