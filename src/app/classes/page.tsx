import { MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/home/contact-form";
import { InteriorHero } from "@/components/page/interior-hero";
import { Container } from "@/components/ui/container";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { classesContent } from "@/content/classes";
import { createPageMetadata } from "@/lib/metadata";

import coachingStyles from "../coaching/coaching.module.css";
import styles from "./classes.module.css";

export const metadata: Metadata = createPageMetadata({
  title: classesContent.metadata.title,
  description: classesContent.metadata.description,
  path: "/classes",
  image: classesContent.hero.image,
});

export default function ClassesPage() {
  const { hero, program, contact } = classesContent;

  return (
    <main className={coachingStyles.main} id="main-content">
      <InteriorHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Ministries" },
          { label: "Coaching" },
        ]}
        eyebrow={hero.eyebrow}
        heroClassName={coachingStyles.hero}
        image={hero.image}
        imagePosition="50% 40%"
        innerClassName={coachingStyles.heroInner}
        overlayClassName={coachingStyles.heroOverlay}
        scrollCueClassName={coachingStyles.scrollCue}
        scrollTargetId="clc-content"
        titleId="classes-title"
      >
        {hero.titleLead}{" "}
        <br />
        <em>{hero.titleEmphasis}</em>
      </InteriorHero>

      <section
        aria-labelledby="classes-program-title"
        className={`${coachingStyles.programSection} ${styles.programSection}`}
      >
        <span aria-hidden="true" className={coachingStyles.contentAnchor} id="clc-content" />
        <Container className={`${coachingStyles.sourceContainer} ${coachingStyles.programGrid}`}>
          <div className={coachingStyles.programCopy}>
            <EyebrowLabel className={coachingStyles.sectionEyebrow}>
              {program.eyebrow}
            </EyebrowLabel>
            <h2 id="classes-program-title">
              Equipping you with essential{" "}
              <br />
              life skills &amp; Biblical study.
            </h2>
            <p className={`${coachingStyles.bodyCopy} ${styles.introduction}`}>
              {program.introduction}
            </p>
            <blockquote className={`${coachingStyles.primaryQuote} ${styles.quote}`}>
              <p>{program.quote}</p>
              <cite>{program.citation}</cite>
            </blockquote>
          </div>

          <div className={coachingStyles.programTopics}>
            <div className={coachingStyles.programImage}>
              <Image
                alt={program.imageAlt}
                fill
                quality={85}
                sizes="(max-width: 991px) calc(100vw - 64px), 504px"
                src={program.image}
              />
              <div aria-hidden="true" className={coachingStyles.programImageOverlay} />
            </div>
            <p className={`${coachingStyles.topicsLabel} ${styles.currentLabel}`}>
              {program.currentLabel}
            </p>
            <ul className={`${coachingStyles.topicList} ${styles.currentList}`}>
              {program.currentClasses.map((className) => (
                <li className={coachingStyles.available} key={className}>
                  <span aria-hidden="true" className={coachingStyles.topicDot} />
                  <span>{className}</span>
                </li>
              ))}
            </ul>

            <div className={styles.comingBlock}>
              <p className={styles.comingLabel}>{program.comingLabel}</p>
              <ul className={styles.comingList}>
                {program.comingClasses.map((className) => <li key={className}>{className}</li>)}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="classes-contact-title"
        className={coachingStyles.contactSection}
        id="contact"
      >
        <div className={coachingStyles.contactInner}>
          <div className={coachingStyles.contactCopy}>
            <EyebrowLabel className={`${coachingStyles.sectionEyebrow} ${coachingStyles.contactEyebrow}`}>
              {contact.eyebrow}
            </EyebrowLabel>
            <h2 id="classes-contact-title">{contact.title}</h2>
            <p className={coachingStyles.contactDescription}>{contact.description}</p>

            <div className={coachingStyles.contactDetail}>
              <span aria-hidden="true"><MapPinIcon /></span>
              <p>
                <strong>Address</strong>
                <span className={coachingStyles.contactValue}>
                  {contact.address.map((line) => <span key={line}>{line}</span>)}
                </span>
              </p>
            </div>
            <div className={coachingStyles.contactDetail}>
              <span aria-hidden="true"><PhoneIcon /></span>
              <p>
                <strong>Phone</strong>
                <a href={contact.phone.href}>{contact.phone.label}</a>
              </p>
            </div>
          </div>

          <ContactForm
            ariaLabel="Contact the Classes ministry"
            className={coachingStyles.contactForm}
            compact
            heading={null}
            idPrefix="classes"
            namePlaceholder="Your name"
            submitLabel="Send Message"
            webflowDelivery={contact.form}
          />
        </div>
      </section>
    </main>
  );
}
