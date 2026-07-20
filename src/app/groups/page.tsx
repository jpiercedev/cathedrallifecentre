import { MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/home/contact-form";
import { InteriorHero } from "@/components/page/interior-hero";
import { Container } from "@/components/ui/container";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { groupsContent } from "@/content/groups";
import { createPageMetadata } from "@/lib/metadata";

import coachingStyles from "../coaching/coaching.module.css";
import styles from "./groups.module.css";

export const metadata: Metadata = createPageMetadata({
  title: groupsContent.metadata.title,
  description: groupsContent.metadata.description,
  path: "/groups",
  image: groupsContent.hero.image,
});

export default function GroupsPage() {
  const { hero, program, contact } = groupsContent;

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
        imagePosition="50% 50%"
        innerClassName={coachingStyles.heroInner}
        overlayClassName={coachingStyles.heroOverlay}
        scrollCueClassName={coachingStyles.scrollCue}
        scrollTargetId="clc-content"
        titleId="groups-title"
      >
        {hero.titleLead}{" "}
        <br />
        <em>{hero.titleEmphasis}</em>
      </InteriorHero>

      <section
        aria-labelledby="groups-program-title"
        className={coachingStyles.programSection}
        id="clc-content"
      >
        <Container className={`${coachingStyles.sourceContainer} ${coachingStyles.programGrid}`}>
          <div className={`${coachingStyles.programCopy} ${styles.programCopy}`}>
            <EyebrowLabel className={coachingStyles.sectionEyebrow}>
              {program.eyebrow}
            </EyebrowLabel>
            <h2 id="groups-program-title">
              No one has to face{" "}
              <br />
              a struggle alone.
            </h2>
            <p className={`${coachingStyles.bodyCopy} ${styles.introduction}`}>
              {program.introduction}
            </p>
            <blockquote className={`${coachingStyles.primaryQuote} ${styles.quote}`}>
              <p>{program.quote}</p>
              <cite>{program.citation}</cite>
            </blockquote>
            <p className={`${coachingStyles.bodyCopy} ${styles.conclusion}`}>
              {program.conclusion}
            </p>
            <p className={styles.note}>
              {program.noteLead}{" "}
              <Link href="/volunteer">Volunteer form</Link>{" "}
              {program.noteTail}
            </p>
          </div>

          <div className={`${coachingStyles.programTopics} ${styles.programTopics}`}>
            <div className={`${coachingStyles.programImage} ${styles.programImage}`}>
              <Image
                alt={program.imageAlt}
                fill
                quality={85}
                sizes="(max-width: 991px) calc(100vw - 64px), 504px"
                src={program.image}
              />
              <div aria-hidden="true" className={coachingStyles.programImageOverlay} />
            </div>
            <p className={`${coachingStyles.topicsLabel} ${styles.activeLabel}`}>
              {program.activeLabel}
            </p>
            <ul className={`${coachingStyles.topicList} ${styles.activeList}`}>
              {program.activeGroups.map((group) => (
                <li className={coachingStyles.available} key={group}>
                  <span aria-hidden="true" className={coachingStyles.topicDot} />
                  <span>{group}</span>
                </li>
              ))}
            </ul>

            <div className={styles.comingBlock}>
              <p className={styles.comingLabel}>{program.comingLabel}</p>
              <p className={styles.comingIntroduction}>{program.comingIntroduction}</p>
              <ul className={styles.comingList}>
                {program.comingGroups.map((group) => <li key={group}>{group}</li>)}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="groups-contact-title"
        className={coachingStyles.contactSection}
        id="contact"
      >
        <div className={coachingStyles.contactInner}>
          <div className={coachingStyles.contactCopy}>
            <EyebrowLabel className={`${coachingStyles.sectionEyebrow} ${coachingStyles.contactEyebrow}`}>
              {contact.eyebrow}
            </EyebrowLabel>
            <h2 id="groups-contact-title">{contact.title}</h2>
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
            ariaLabel="Contact the Groups ministry"
            className={coachingStyles.contactForm}
            compact
            heading={null}
            idPrefix="groups"
            namePlaceholder="Your name"
            submitLabel="Send Message"
            webflowDelivery={contact.form}
          />
        </div>
      </section>
    </main>
  );
}
