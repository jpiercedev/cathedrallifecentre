import { MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/home/contact-form";
import { InteriorHero } from "@/components/page/interior-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { graceGarageContent } from "@/content/grace-garage";
import { createPageMetadata } from "@/lib/metadata";

import styles from "./grace-garage.module.css";
import { GraceGarageVideo } from "./grace-garage-video";

export const metadata: Metadata = createPageMetadata({
  title: graceGarageContent.metadata.title,
  description: graceGarageContent.metadata.description,
  path: "/grace-garage",
  image: graceGarageContent.hero.image,
});

export default function GraceGaragePage() {
  const { hero, overview, impact, volunteer, contact } = graceGarageContent;

  return (
    <main className={styles.main} id="main-content">
      <InteriorHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Ministries" },
          { label: "Grace Garage" },
        ]}
        description={hero.description}
        eyebrow={hero.eyebrow}
        heroClassName={styles.hero}
        image={hero.image}
        imagePosition="50% 60%"
        innerClassName={styles.heroInner}
        overlayClassName={styles.heroOverlay}
        scrollCueClassName={styles.scrollCue}
        scrollTargetId="clc-content"
        titleId="grace-garage-title"
      >
        {hero.titleLead}{" "}
        <br />
        <em>{hero.titleEmphasis}</em>
      </InteriorHero>

      <section
        aria-labelledby="grace-garage-overview-title"
        className={styles.overviewSection}
        id="clc-content"
      >
        <Container className={`${styles.sourceContainer} ${styles.overviewGrid}`}>
          <div className={styles.overviewCopy}>
            <EyebrowLabel className={styles.sectionEyebrow}>
              {overview.eyebrow}
            </EyebrowLabel>
            <h2 id="grace-garage-overview-title">
              Complimentary oil changes and{" "}
              <br />
              trustworthy vehicle inspections.
            </h2>
            <p className={styles.bodyCopy}>{overview.description}</p>
            <div className={styles.serviceList}>
              <p>{overview.servicesLabel}</p>
              <ul>
                {overview.services.map((service) => (
                  <li key={service}>
                    <span aria-hidden="true" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div aria-label="Grace Garage gallery" className={styles.gallery}>
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
                      ? "(max-width: 991px) calc(100vw - 48px), 504px"
                      : "(max-width: 767px) calc(50vw - 32px), 244px"
                  }
                  src={image.src}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="grace-garage-impact-title" className={styles.impactSection}>
        <Container className={`${styles.sourceContainer} ${styles.impactInner}`}>
          <p className={styles.impactEyebrow}>{impact.eyebrow}</p>
          <h2 id="grace-garage-impact-title">{impact.title}</h2>
          <div className={styles.impactDonation}>
            <p className={styles.impactDescription}>{impact.description}</p>
            <div aria-hidden="true" className={styles.impactDescriptionSpacer} />
            <ButtonLink className={styles.donateButton} href={impact.action.href} newTab>
              {impact.action.label}
            </ButtonLink>
          </div>
          <GraceGarageVideo {...impact.video} />
        </Container>
      </section>

      <section
        aria-labelledby="grace-garage-volunteer-title"
        className={styles.volunteerSection}
        id="volunteer"
      >
        <Container className={`${styles.sourceContainer} ${styles.volunteerGrid}`}>
          <div className={styles.volunteerImage}>
            <Image
              alt={volunteer.imageAlt}
              fill
              quality={85}
              sizes="(max-width: 991px) calc(100vw - 48px), 504px"
              src={volunteer.image}
            />
            <div aria-hidden="true" className={styles.volunteerOverlay} />
            <div className={styles.imageCaption}>
              <span>{volunteer.imageEyebrow}</span>
              <strong>{volunteer.imageCaption}</strong>
            </div>
          </div>

          <div className={styles.volunteerCopy}>
            <EyebrowLabel className={styles.sectionEyebrow}>
              {volunteer.eyebrow}
            </EyebrowLabel>
            <h2 id="grace-garage-volunteer-title">{volunteer.title}</h2>
            <span aria-hidden="true" className={styles.headingRule} />
            {volunteer.paragraphs.map((paragraph) => (
              <p className={styles.bodyCopy} key={paragraph}>
                {paragraph}
              </p>
            ))}
            <div className={styles.volunteerActions}>
              {volunteer.actions.map((action) => (
                <ButtonLink
                  className={
                    action.kind === "primary"
                      ? styles.applyButton
                      : styles.secondaryAction
                  }
                  href={action.href}
                  key={action.label}
                  newTab
                >
                  {action.label}
                </ButtonLink>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="grace-garage-contact-title" className={styles.contactSection}>
        <div className={styles.contactInner}>
          <div className={styles.contactCopy}>
            <EyebrowLabel className={`${styles.sectionEyebrow} ${styles.contactEyebrow}`}>
              {contact.eyebrow}
            </EyebrowLabel>
            <h2 id="grace-garage-contact-title">{contact.title}</h2>
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
            ariaLabel="Contact the Grace Garage ministry"
            className={styles.contactForm}
            compact
            heading={null}
            idPrefix="grace-garage"
            namePlaceholder="Your name"
            submitLabel="Send Message"
            webflowDelivery={contact.form}
          />
        </div>
      </section>
    </main>
  );
}
