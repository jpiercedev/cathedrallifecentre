import { MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/home/contact-form";
import { InteriorHero } from "@/components/page/interior-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { adoptionContent } from "@/content/adoption";
import { createPageMetadata } from "@/lib/metadata";

import styles from "./adoption.module.css";

export const metadata: Metadata = createPageMetadata({
  title: adoptionContent.metadata.title,
  description: adoptionContent.metadata.description,
  path: "/adoption",
  image: adoptionContent.hero.image,
});

export default function AdoptionPage() {
  const { hero, overview, resources, contact } = adoptionContent;

  return (
    <main className={styles.main} id="main-content">
      <InteriorHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Ministries" },
          { label: "Adoption" },
        ]}
        eyebrow={hero.eyebrow}
        fadeClassName={styles.heroFade}
        heroClassName={styles.hero}
        image={hero.image}
        imagePosition="50% 40%"
        innerClassName={styles.heroInner}
        overlayClassName={styles.heroOverlay}
        scrollCueClassName={styles.scrollCue}
        scrollTargetId="clc-content"
        titleId="adoption-title"
      >
        {hero.titleLead}{" "}
        <br />
        <em>{hero.titleEmphasis}</em>
      </InteriorHero>

      <section
        aria-labelledby="adoption-overview-title"
        className={styles.overviewSection}
      >
        <span aria-hidden="true" className={styles.contentAnchor} id="clc-content" />
        <Container className={`${styles.sourceContainer} ${styles.overviewGrid}`}>
          <div className={styles.overviewCopy}>
            <EyebrowLabel className={styles.sectionEyebrow}>
              {overview.eyebrow}
            </EyebrowLabel>
            <h2 id="adoption-overview-title">{overview.title}</h2>
            {overview.paragraphs.map((paragraph) => (
              <p className={styles.bodyCopy} key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          <div aria-label="Adoption family gallery" className={styles.gallery}>
            {overview.images.map((image, index) => (
              <div
                className={index === 0 ? styles.galleryMain : styles.gallerySmall}
                key={image.src}
              >
                <Image
                  alt={image.alt}
                  fill
                  quality={85}
                  sizes={
                    index === 0
                      ? "(max-width: 479px) calc(100vw - 40px), (max-width: 767px) calc(100vw - 48px), (max-width: 991px) calc(100vw - 64px), 504px"
                      : "(max-width: 479px) calc(50vw - 28px), (max-width: 767px) calc(50vw - 32px), (max-width: 991px) calc(50vw - 40px), 244px"
                  }
                  src={image.src}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="adoption-resources-title"
        className={styles.resourcesSection}
      >
        <Container className={`${styles.sourceContainer} ${styles.resourcesGrid}`}>
          <div className={styles.resourcesImage}>
            <Image
              alt={resources.imageAlt}
              fill
              quality={85}
              sizes="(max-width: 479px) calc(100vw - 40px), (max-width: 767px) calc(100vw - 48px), (max-width: 991px) calc(100vw - 64px), 504px"
              src={resources.image}
            />
            <div className={styles.imageCaption}>
              <span>{resources.imageEyebrow}</span>
              <strong>{resources.imageCaption}</strong>
            </div>
          </div>

          <div className={styles.resourcesCopy}>
            <EyebrowLabel className={styles.sectionEyebrow}>
              {resources.eyebrow}
            </EyebrowLabel>
            <h2 id="adoption-resources-title">{resources.title}</h2>
            <span aria-hidden="true" className={styles.headingRule} />

            <div className={styles.resourceList}>
              {resources.items.map((item) => (
                <article
                  className={
                    item.status === "active"
                      ? styles.activeResource
                      : styles.comingResource
                  }
                  key={item.title}
                >
                  <div className={styles.resourceTitleRow}>
                    <h3>{item.title}</h3>
                    {item.status === "Coming Soon" ? (
                      <span className={styles.comingSoon}>Coming Soon</span>
                    ) : null}
                  </div>
                  {"description" in item ? <p>{item.description}</p> : null}
                </article>
              ))}
            </div>

            <div className={styles.primaryButtonWrap}>
              <ButtonLink
                className={styles.primaryButton}
                href={resources.action.href}
              >
                {resources.action.label}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="adoption-contact-title"
        className={styles.contactSection}
        id="contact"
      >
        <div className={styles.contactInner}>
          <div className={styles.contactCopy}>
            <EyebrowLabel className={`${styles.sectionEyebrow} ${styles.contactEyebrow}`}>
              {contact.eyebrow}
            </EyebrowLabel>
            <h2 id="adoption-contact-title">{contact.title}</h2>
            <p className={styles.contactDescription}>{contact.description}</p>

            <div className={styles.contactDetail}>
              <span aria-hidden="true">
                <MapPinIcon />
              </span>
              <p>
                <strong>Address</strong>
                <span className={styles.contactValue}>
                  {contact.address.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
              </p>
            </div>
            <div className={styles.contactDetail}>
              <span aria-hidden="true">
                <PhoneIcon />
              </span>
              <p>
                <strong>Phone</strong>
                <a href={contact.phone.href}>{contact.phone.label}</a>
              </p>
            </div>
          </div>

          <ContactForm
            ariaLabel="Contact the Adoption ministry"
            className={styles.contactForm}
            compact
            heading={null}
            idPrefix="adoption"
            namePlaceholder="Your name"
            submitLabel="Send Message"
            webflowDelivery={contact.form}
          />
        </div>
      </section>
    </main>
  );
}
