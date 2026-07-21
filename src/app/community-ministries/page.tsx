import { MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/home/contact-form";
import { InteriorHero } from "@/components/page/interior-hero";
import { Container } from "@/components/ui/container";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { communityMinistriesContent } from "@/content/community-ministries";
import { createPageMetadata } from "@/lib/metadata";

import coachingStyles from "../coaching/coaching.module.css";
import styles from "./community-ministries.module.css";

export const metadata: Metadata = createPageMetadata({
  title: communityMinistriesContent.metadata.title,
  description: communityMinistriesContent.metadata.description,
  path: "/community-ministries",
  image: communityMinistriesContent.hero.image,
});

export default function CommunityMinistriesPage() {
  const { hero, program, contact } = communityMinistriesContent;

  return (
    <main className={coachingStyles.main} id="main-content">
      <InteriorHero
        action={{ href: "#contact", label: "Find Out More" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Community Ministries" },
        ]}
        eyebrow={hero.eyebrow}
        heroClassName={coachingStyles.hero}
        image={hero.image}
        imagePosition="50% 50%"
        innerClassName={coachingStyles.heroInner}
        overlayClassName={coachingStyles.heroOverlay}
        secondaryAction={{ href: "/donate", label: "Donate" }}
        showScrollCue={false}
        titleId="community-ministries-title"
      >
        {hero.titleLead}{" "}
        <br />
        <em>{hero.titleEmphasis}</em>
      </InteriorHero>

      <section
        aria-labelledby="community-program-title"
        className={`${coachingStyles.programSection} ${styles.programSection}`}
      >
        <span aria-hidden="true" className={coachingStyles.contentAnchor} id="clc-content" />
        <Container className={`${coachingStyles.sourceContainer} ${coachingStyles.programGrid}`}>
          <div className={coachingStyles.programCopy}>
            <EyebrowLabel className={coachingStyles.sectionEyebrow}>
              {program.eyebrow}
            </EyebrowLabel>
            <h2 id="community-program-title">
              Caring for the whole person,{" "}
              <br />
              in every area of life.
            </h2>
            <p className={coachingStyles.bodyCopy}>{program.description}</p>
          </div>

          <div className={coachingStyles.programTopics}>
            <div className={coachingStyles.programImage}>
              <Image
                alt={program.imageAlt}
                fill
                quality={85}
                sizes="(max-width: 479px) calc(100vw - 40px), (max-width: 767px) calc(100vw - 48px), (max-width: 991px) calc(100vw - 64px), 504px"
                src={program.image}
              />
              <div aria-hidden="true" className={coachingStyles.programImageOverlay} />
            </div>
            <p className={coachingStyles.topicsLabel}>{program.ministriesLabel}</p>
            <ul className={coachingStyles.topicList}>
              {program.ministries.map((ministry) => (
                <li
                  className={ministry.available ? coachingStyles.available : coachingStyles.coming}
                  key={ministry.label}
                >
                  <span aria-hidden="true" className={coachingStyles.topicDot} />
                  <span>
                    {ministry.href ? (
                      <Link className={styles.ministryLink} href={ministry.href}>
                        {ministry.label}
                      </Link>
                    ) : (
                      ministry.label
                    )}
                    {ministry.available ? null : (
                      <span className={coachingStyles.comingSoon}>Coming Soon</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="community-contact-title"
        className={`${coachingStyles.contactSection} ${styles.contactSection}`}
        id="contact"
      >
        <div className={`${coachingStyles.contactInner} ${styles.contactInner}`}>
          <div className={coachingStyles.contactCopy}>
            <EyebrowLabel className={`${coachingStyles.sectionEyebrow} ${coachingStyles.contactEyebrow}`}>
              {contact.eyebrow}
            </EyebrowLabel>
            <h2 id="community-contact-title">{contact.title}</h2>
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
            ariaLabel="Contact the Community Ministries"
            className={coachingStyles.contactForm}
            compact
            heading={null}
            idPrefix="community-ministries"
            namePlaceholder="Your name"
            submitLabel="Send Message"
            webflowDelivery={contact.form}
          />
        </div>
      </section>
    </main>
  );
}
