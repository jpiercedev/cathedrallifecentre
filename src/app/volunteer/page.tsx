import { MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/home/contact-form";
import { InteriorHero } from "@/components/page/interior-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { volunteerContent } from "@/content/volunteer";
import { createPageMetadata } from "@/lib/metadata";

import coachingStyles from "../coaching/coaching.module.css";
import styles from "./volunteer.module.css";

export const metadata: Metadata = createPageMetadata({
  title: volunteerContent.metadata.title,
  description: volunteerContent.metadata.description,
  path: "/volunteer",
  image: volunteerContent.hero.image,
});

export default function VolunteerPage() {
  const { hero, ministries, cta, contact, applicationUrl } = volunteerContent;

  return (
    <main className={styles.main} id="main-content">
      <InteriorHero
        action={{ href: applicationUrl, label: "Apply To Volunteer" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Ministries" },
          { label: "Volunteer Ministries" },
        ]}
        description={hero.description}
        fadeClassName={styles.heroFade}
        heroClassName={styles.hero}
        image={hero.image}
        imagePosition="50% 50%"
        innerClassName={styles.heroInner}
        overlayClassName={styles.heroOverlay}
        scrollCueClassName={styles.scrollCue}
        scrollTargetId="clc-content"
        titleId="volunteer-title"
      >
        {hero.title}
      </InteriorHero>

      <section className={styles.ministriesSection} id="clc-content">
        <Container className={styles.contentInner}>
          <h2 className={styles.srOnly}>Volunteer opportunities</h2>
          <div className={styles.cardGrid}>
            {ministries.map((ministry) => {
              const cardContent = (
                <>
                  {"image" in ministry && ministry.image ? (
                    <Image
                      alt=""
                      className={styles.cardImage}
                      fill
                      quality={85}
                      sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 991px) calc(50vw - 44px), 368px"
                      src={ministry.image}
                    />
                  ) : null}
                  <div aria-hidden="true" className={styles.cardOverlay} />
                  <div className={styles.cardBody}>
                    <h3>{ministry.name}</h3>
                    <p>{ministry.description}</p>
                  </div>
                </>
              );

              return "href" in ministry && ministry.href ? (
                <a
                  aria-label={`Learn more about ${ministry.name}`}
                  className={styles.cardLink}
                  href={ministry.href}
                  key={ministry.name}
                >
                  {cardContent}
                </a>
              ) : (
                <article className={styles.card} key={ministry.name}>
                  {cardContent}
                </article>
              );
            })}
          </div>

          <div className={styles.cta}>
            <div>
              <h2>
                {cta.titleLead} <strong>{cta.titleEmphasis}</strong>{" "}
                {cta.titleTail}
              </h2>
              <ButtonLink className={styles.ctaButton} href={applicationUrl}>
                Apply To Volunteer
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="volunteer-contact-title"
        className={coachingStyles.contactSection}
        id="contact"
      >
        <div className={coachingStyles.contactInner}>
          <div className={coachingStyles.contactCopy}>
            <EyebrowLabel className={`${coachingStyles.sectionEyebrow} ${coachingStyles.contactEyebrow}`}>
              {contact.eyebrow}
            </EyebrowLabel>
            <h2 id="volunteer-contact-title">{contact.title}</h2>
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
            ariaLabel="Contact the Volunteer ministry"
            className={coachingStyles.contactForm}
            compact
            heading={null}
            idPrefix="volunteer"
            namePlaceholder="Your name"
            submitLabel="Send Message"
            webflowDelivery={contact.form}
          />
        </div>
      </section>
    </main>
  );
}
