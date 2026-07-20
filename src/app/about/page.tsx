import {
  GlobeAltIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InteriorHero } from "@/components/page/interior-hero";
import { Container } from "@/components/ui/container";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { aboutContent } from "@/content/about";
import { createPageMetadata } from "@/lib/metadata";

import { AboutContactForm } from "./about-contact-form";
import styles from "./about.module.css";

export const metadata: Metadata = createPageMetadata({
  title: aboutContent.metadata.title,
  description: aboutContent.metadata.description,
  path: "/about",
  image: aboutContent.hero.image,
});

export default function AboutPage() {
  const { hero, facility, leadership, contact } = aboutContent;
  const [steveAndBecky, rachele] = leadership.people;

  return (
    <main className={styles.main} id="main-content">
      <InteriorHero
        action={hero.actions[0]}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
        description={hero.description}
        eyebrow={hero.eyebrow}
        fadeClassName={styles.heroFade}
        heroClassName={styles.hero}
        image={hero.image}
        imagePosition="50% 40%"
        innerClassName={styles.heroInner}
        overlayClassName={styles.heroOverlay}
        secondaryAction={hero.actions[1]}
        showScrollCue={false}
        titleId="about-title"
      >
        <span>{hero.title}</span>{" "}
        <span>
          &amp; <em>{hero.emphasis}</em>
        </span>
      </InteriorHero>

      <section
        aria-labelledby="facility-title"
        className={styles.facilitySection}
        id="about-content"
      >
        <Container className={`${styles.sourceContainer} ${styles.facilityGrid}`}>
          <div className={styles.facilityCopy}>
            <EyebrowLabel className={styles.sectionEyebrow}>
              {facility.eyebrow}
            </EyebrowLabel>
            <h2 id="facility-title">{facility.title}</h2>
            <p className={styles.facilityLead}>{facility.lead}</p>
            <p className={styles.facilityParagraphs}>
              {facility.paragraphs[0]}
              <br />
              <br />
              {facility.paragraphs[1]}
            </p>
            <aside className={styles.fundingNote}>
              <p>{facility.note}</p>
            </aside>
          </div>

          <div aria-label="Cathedral Life Centre facility" className={styles.gallery}>
            {facility.images.map((item, index) => (
              <div
                className={index === 0 ? styles.galleryMain : styles.gallerySmall}
                key={item.image}
              >
                <Image
                  alt={item.alt}
                  fill
                  quality={85}
                  sizes={
                    index === 0
                      ? "(max-width: 991px) calc(100vw - 48px), 508px"
                      : "(max-width: 991px) calc((100vw - 64px) / 2), 246px"
                  }
                  src={item.image}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="leadership-title" className={styles.leadershipSection}>
        <Container className={styles.sourceContainer}>
          <h2 className={styles.leadershipTitle} id="leadership-title">
            {leadership.eyebrow}
          </h2>

          <article
            aria-labelledby={`${steveAndBecky.id}-title`}
            className={`${styles.leaderRow} ${styles.steveRow}`}
          >
            <div className={`${styles.leaderImage} ${styles.steveImage}`}>
              <Image
                alt={steveAndBecky.imageAlt}
                fill
                quality={85}
                sizes="(max-width: 991px) calc(100vw - 48px), 342px"
                src={steveAndBecky.image}
              />
            </div>
            <div className={styles.leaderCopy}>
              <h3 id={`${steveAndBecky.id}-title`}>{steveAndBecky.name}</h3>
              <p className={styles.leaderRoles}>{steveAndBecky.roles[0]}</p>
              <span aria-hidden="true" className={styles.leaderRule} />
              <p>{steveAndBecky.paragraphs[0]}</p>
              <p>
                Along with pastoring, Steve also serves as the President of
                Grace International, a fellowship of over <strong>5,900 churches</strong>
                {" "}with more than <strong>550,000+ members</strong>, various
                compassion ministries, and educational institutions both
                nationally and internationally with ministries in <strong>131</strong>
                {" "}<strong>nations</strong> of the world.
              </p>
            </div>
          </article>

          <article
            aria-labelledby={`${rachele.id}-title`}
            className={`${styles.leaderRow} ${styles.racheleRow}`}
          >
            <div className={styles.leaderCopy}>
              <h3 id={`${rachele.id}-title`}>{rachele.name}</h3>
              <span aria-hidden="true" className={styles.racheleRule} />
              <p className={styles.leaderRoles}>
                {rachele.roles.map((role) => (
                  <span key={role}>{role}</span>
                ))}
              </p>
              {rachele.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className={styles.leaderImage}>
              <Image
                alt={rachele.imageAlt}
                fill
                quality={85}
                sizes="(max-width: 991px) calc(100vw - 48px), 342px"
                src={rachele.image}
              />
            </div>
          </article>
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
              <div className={styles.contactDetail}>
                <span aria-hidden="true" className={styles.contactIcon}>
                  <GlobeAltIcon />
                </span>
                <div>
                  <p className={styles.contactLabel}>Website</p>
                  <Link href={contact.website.href}>{contact.website.label}</Link>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formCard}>
            <AboutContactForm />
          </div>
        </Container>
      </section>
    </main>
  );
}
