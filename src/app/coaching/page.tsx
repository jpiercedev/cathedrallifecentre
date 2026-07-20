import { MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/home/contact-form";
import { InteriorHero } from "@/components/page/interior-hero";
import { Container } from "@/components/ui/container";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { coachingContent } from "@/content/coaching";
import { createPageMetadata } from "@/lib/metadata";

import styles from "./coaching.module.css";

export const metadata: Metadata = createPageMetadata({
  title: coachingContent.metadata.title,
  description: coachingContent.metadata.description,
  path: "/coaching",
  image: coachingContent.hero.image,
});

export default function CoachingPage() {
  const { hero, program, contact } = coachingContent;

  return (
    <main className={styles.main} id="main-content">
      <InteriorHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Ministries" },
          { label: "Coaching" },
        ]}
        eyebrow={hero.eyebrow}
        heroClassName={styles.hero}
        image={hero.image}
        imagePosition="100% 50%"
        innerClassName={styles.heroInner}
        overlayClassName={styles.heroOverlay}
        scrollCueClassName={styles.scrollCue}
        scrollTargetId="clc-content"
        titleId="coaching-title"
      >
        {hero.titleLead}{" "}
        <br />
        <em>{hero.titleEmphasis}</em>
      </InteriorHero>

      <section
        aria-labelledby="coaching-program-title"
        className={styles.programSection}
        id="clc-content"
      >
        <Container className={`${styles.sourceContainer} ${styles.programGrid}`}>
          <div className={styles.programCopy}>
            <EyebrowLabel className={styles.sectionEyebrow}>
              {program.eyebrow}
            </EyebrowLabel>
            <h2 id="coaching-program-title">
              Enhancing life skills &amp;{" "}
              <br />
              aligning with God&apos;s purpose.
            </h2>
            {program.paragraphs.map((paragraph) => (
              <p className={styles.bodyCopy} key={paragraph}>
                {paragraph}
              </p>
            ))}
            {program.quotes.map((quote) => (
              <blockquote
                className={quote.primary ? styles.primaryQuote : styles.secondaryQuote}
                key={quote.citation}
              >
                <p>{quote.quote}</p>
                <cite>{quote.citation}</cite>
              </blockquote>
            ))}
            <p className={`${styles.bodyCopy} ${styles.conclusion}`}>
              {program.conclusion}
            </p>
          </div>

          <div className={styles.programTopics}>
            <div className={styles.programImage}>
              <Image
                alt={program.imageAlt}
                fill
                quality={85}
                sizes="(max-width: 991px) calc(100vw - 64px), 504px"
                src={program.image}
              />
              <div aria-hidden="true" className={styles.programImageOverlay} />
            </div>
            <p className={styles.topicsLabel}>{program.topicsLabel}</p>
            <ul className={styles.topicList}>
              {program.topics.map((topic) => (
                <li className={topic.available ? styles.available : styles.coming} key={topic.label}>
                  <span aria-hidden="true" className={styles.topicDot} />
                  <span>
                    {topic.label}
                    {topic.available ? null : (
                      <span className={styles.comingSoon}>Coming Soon</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section aria-labelledby="coaching-contact-title" className={styles.contactSection}>
        <div className={styles.contactInner}>
          <div className={styles.contactCopy}>
            <EyebrowLabel className={`${styles.sectionEyebrow} ${styles.contactEyebrow}`}>
              {contact.eyebrow}
            </EyebrowLabel>
            <h2 id="coaching-contact-title">{contact.title}</h2>
            <p className={styles.contactDescription}>{contact.description}</p>

            <div className={styles.contactDetail}>
              <span aria-hidden="true"><MapPinIcon /></span>
              <p>
                <strong>Address</strong>
                <span className={styles.contactValue}>
                  {contact.address.map((line) => <span key={line}>{line}</span>)}
                </span>
              </p>
            </div>
            <div className={styles.contactDetail}>
              <span aria-hidden="true"><PhoneIcon /></span>
              <p>
                <strong>Phone</strong>
                <a href={contact.phone.href}>{contact.phone.label}</a>
              </p>
            </div>
          </div>

          <ContactForm
            ariaLabel="Contact the Coaching ministry"
            className={styles.contactForm}
            compact
            heading={null}
            idPrefix="coaching"
            namePlaceholder="Your name"
            submitLabel="Send Message"
            webflowDelivery={contact.form}
          />
        </div>
      </section>
    </main>
  );
}
