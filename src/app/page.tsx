import type { Metadata } from "next";
import { CheckIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/home/contact-form";
import { HeroVideo } from "@/components/home/hero-video";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { homeContent } from "@/content/home";
import { createPageMetadata } from "@/lib/metadata";

import styles from "./home.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Cathedral Life Centre",
  description:
    "A Christ-centered refuge in Spring, Texas, bringing hope, healing, and life to women and families in crisis.",
  path: "/",
  image: homeContent.hero.image,
  absoluteTitle: true,
});

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className={styles.eyebrow}>{children}</p>;
}

export default function Home() {
  const { hero, mission, ministries, residency, giving, volunteer, contact } =
    homeContent;

  return (
    <main id="main-content">
      <section aria-labelledby="home-hero-title" className={styles.hero}>
        <Image
          alt="Cathedral Life Centre building exterior"
          className={styles.heroImage}
          fill
          priority
          quality={85}
          sizes="100vw"
          src={hero.image}
        />
        <div aria-hidden="true" className={styles.heroOverlay} />
        <HeroVideo />
        <Container className={styles.heroInner}>
          <div className={styles.heroContent}>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
            <h1 id="home-hero-title">
              {hero.title.map((line, index) => (
                <span key={line}>
                  {index === hero.title.length - 1 ? (
                    <>
                      {line.split(" ")[0]} <em>{line.split(" ").slice(1).join(" ")}</em>
                    </>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>
            <div aria-hidden="true" className={styles.heroRule} />
            <p>
              {hero.description} <strong>{hero.emphasis}</strong>
            </p>
            <div className={styles.buttonRow}>
              <ButtonLink className={styles.primaryButton} href="/donate">
                Give Today
              </ButtonLink>
              <ButtonLink className={styles.lightOutlineButton} href="#ministries">
                Our Ministries
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="mission-title" className={styles.mission}>
        <Container className={styles.missionGrid}>
          <div className={styles.collage}>
            <div className={`${styles.collageImage} ${styles.collageTall}`}>
              <Image
                alt="Mother holding her baby"
                fill
                quality={85}
                sizes="(max-width: 768px) 45vw, 250px"
                src={mission.images.motherAndBaby}
              />
            </div>
            <div className={styles.collageRight}>
              <div className={styles.collageImage}>
                <Image
                  alt="Women and a baby in a Cathedral Life Centre lounge"
                  fill
                  quality={85}
                  sizes="(max-width: 768px) 45vw, 250px"
                  src={mission.images.community}
                />
              </div>
              <div className={styles.collageImage}>
                <Image
                  alt="Cathedral Life Centre common lounge"
                  fill
                  quality={85}
                  sizes="(max-width: 768px) 45vw, 250px"
                  src={mission.images.lounge}
                />
              </div>
            </div>
            <div className={styles.missionBadge}>
              <strong>Christ-Centered</strong>
              <span>Hope · Healing · Life</span>
            </div>
          </div>

          <div className={styles.missionCopy}>
            <Eyebrow>{mission.eyebrow}</Eyebrow>
            <h2 aria-label={mission.title} id="mission-title">
              {"Bringing Hope, "}
              <br className={styles.breakDesktopMobile} />
              {"Healing & Life "}
              <br className={styles.breakDesktop} />
              {"to "}
              <br className={styles.breakTabletMobile} />
              {"Women "}
              <br className={styles.breakDesktop} />
              {"in Crisis"}
            </h2>
            {mission.paragraphs.map((paragraph) => (
              <p
                className={
                  "strong" in paragraph && paragraph.strong
                    ? styles.bold
                    : undefined
                }
                key={paragraph.text}
              >
                {paragraph.text}
                {"emphasis" in paragraph ? (
                  <>
                    {" "}
                    <em>{paragraph.emphasis}</em>
                  </>
                ) : null}
              </p>
            ))}
            <div className={styles.buttonRow}>
              <ButtonLink className={styles.primaryButton} href="/donate">
                Give Today
              </ButtonLink>
              <ButtonLink className={styles.darkOutlineButton} href="#contact">
                Schedule a Tour
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="donation-statement" className={styles.statement}>
        <Container className={styles.statementInner} size="narrow">
          <h2 id="donation-statement">
            <strong>{homeContent.statement.strong}</strong>
            {homeContent.statement.rest}
          </h2>
          <ButtonLink className={styles.primaryButton} href="/donate">
            Donate
          </ButtonLink>
        </Container>
      </section>

      <section
        aria-labelledby="ministries-title"
        className={styles.ministries}
        id="ministries"
      >
        <Container>
          <div className={styles.sectionHeading}>
            <Eyebrow>{ministries.eyebrow}</Eyebrow>
            <h2 id="ministries-title">{ministries.title}</h2>
            <p>{ministries.description}</p>
          </div>
          <div className={styles.ministryGrid}>
            {ministries.items.map((item) => (
              <article
                className={styles.ministryCard}
                key={item.href}
              >
                <Image
                  alt=""
                  fill
                  sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 991px) 44vw, 303px"
                  src={item.image}
                />
                <Link href={item.href} prefetch={false}>
                  {item.title}
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="residency-title" className={styles.residency}>
        <Container className={styles.residencyGrid}>
          <div className={styles.residencyCopy}>
            <Eyebrow>{residency.eyebrow}</Eyebrow>
            <h2 id="residency-title">{residency.title}</h2>
            <p>{residency.description}</p>
            <ul>
              {residency.bullets.map((bullet) => (
                <li key={bullet}>
                  <span aria-hidden="true">
                    <CheckIcon />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
            <div className={styles.buttonRow}>
              <ButtonLink className={styles.primaryButton} href="/about">
                Find Out More
              </ButtonLink>
              <ButtonLink
                className={styles.primaryButton}
                href={residency.applicationUrl}
              >
                Apply for Residency
              </ButtonLink>
            </div>
          </div>
          <div className={styles.residencyImage}>
            <Image
              alt="A woman arriving at Cathedral Life Centre"
              fill
              quality={85}
              sizes="(max-width: 991px) calc(100vw - 64px), 504px"
              src={residency.image}
            />
          </div>
        </Container>
      </section>

      <section aria-labelledby="giving-title" className={styles.giving}>
        <Container>
          <div className={`${styles.sectionHeading} ${styles.givingHeading}`}>
            <Eyebrow>{giving.eyebrow}</Eyebrow>
            <h2 id="giving-title">{giving.title}</h2>
            <p>{giving.description}</p>
          </div>
          <div className={styles.givingGrid}>
            {giving.cards.map((card) => (
              <article
                className={`${styles.givingCard} ${"featured" in card && card.featured ? styles.givingCardFeatured : ""}`}
                key={card.title}
              >
                <Eyebrow>{card.eyebrow}</Eyebrow>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
          <div className={styles.centeredButton}>
            <ButtonLink className={styles.primaryButton} href="/donate">
              Give Now
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section aria-labelledby="volunteer-title" className={styles.volunteer} id="volunteer">
        <Container className={styles.volunteerGrid}>
          <div className={styles.volunteerCopy}>
            <Eyebrow>{volunteer.eyebrow}</Eyebrow>
            <h2 id="volunteer-title">{volunteer.title}</h2>
            {volunteer.paragraphs.map((paragraph) => (
              <p key={paragraph.text}>
                {paragraph.text}
                {"emphasis" in paragraph ? (
                  <>
                    {" "}
                    <strong className={styles.accentStrong}>
                      {paragraph.emphasis}
                    </strong>
                  </>
                ) : null}
              </p>
            ))}
            <div className={styles.buttonRow}>
              <ButtonLink
                className={styles.primaryButton}
                href={volunteer.applicationUrl}
              >
                Volunteer
              </ButtonLink>
            </div>
          </div>
          <div className={styles.volunteerImage}>
            <Image
              alt="Cathedral Life Centre building exterior"
              fill
              quality={85}
              sizes="(max-width: 991px) calc(100vw - 64px), 504px"
              src={volunteer.image}
            />
            <div className={styles.volunteerBadge}>
              <strong>Internship</strong>
              <span>Program Available</span>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="contact-title" className={styles.contact} id="contact">
        <Container className={styles.contactGrid}>
          <div className={styles.contactCopy}>
            <Eyebrow>{contact.eyebrow}</Eyebrow>
            <h2 id="contact-title">{contact.title}</h2>
            <p>{contact.description}</p>
            <div className={styles.contactDetail}>
              <span aria-hidden="true">
                <MapPinIcon />
              </span>
              <p>
                <strong>Address</strong>
                {contact.address}
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
          <ContactForm />
        </Container>
      </section>
    </main>
  );
}
