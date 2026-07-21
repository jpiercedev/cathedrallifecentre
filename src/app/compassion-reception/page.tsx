import { ChevronDownIcon, SparklesIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";

import styles from "./compassion-reception.module.css";
import { RsvpForm } from "./rsvp-form";

export const metadata: Metadata = createPageMetadata({
  title: "Compassion Reception",
  description:
    "Join us for a private Compassion Reception and inside look at the Cathedral Life Centre on Tuesday, August 18, 2026.",
  path: "/compassion-reception",
  image:
    "/assets/pages/compassion-reception/life-centre-building-front-july-2026.webp",
});

const directionsUrl =
  "https://www.google.com/maps/search/?api=1&query=24854+Cathedral+Lakes+Pkwy%2C+Spring%2C+TX+77386";

function Ornament() {
  return (
    <div aria-hidden="true" className={styles.ornament}>
      <span />
      <SparklesIcon />
      <span />
    </div>
  );
}

export default function CompassionReceptionPage() {
  return (
    <main className={styles.page} id="compassion-reception-page">
      <section aria-labelledby="reception-title" className={styles.hero}>
        <Image
          alt=""
          aria-hidden="true"
          className={styles.heroImage}
          fill
          priority
          quality={90}
          sizes="100vw"
          src="/assets/pages/compassion-reception/life-centre-building-front-july-2026.webp"
        />
        <div aria-hidden="true" className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>
            <span />
            The Cathedral Life Centre
            <span />
          </div>
          <h1 id="reception-title">Compassion Reception</h1>
          <p>
            You&apos;re invited to a private reception and an inside look at the
            Cathedral Life Centre—a Christ-centered ministry serving women
            escaping abuse, single mothers choosing life, families facing
            crisis, children in foster care, and young adults aging out of the
            foster care system. Join us to tour the facility, hear the vision,
            and discover how you can help provide hope, healing, and practical
            support to those who need it most.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="#rsvp">
              RSVP Now
            </Link>
            <Link className={styles.outlineButton} href="#details">
              Event Details
            </Link>
          </div>
        </div>
        <Link
          aria-label="Scroll to event details"
          className={styles.scrollCue}
          href="#details"
        >
          <span>Explore</span>
          <ChevronDownIcon aria-hidden="true" />
        </Link>
      </section>

      <section aria-labelledby="details-title" className={styles.details} id="details">
        <Ornament />
        <div className={styles.detailsInner}>
          <h2 id="details-title">You Are Invited</h2>
          <p className={styles.when}>
            Tuesday, August 18, 2026
            <br />
            7:00–8:30 PM
          </p>
          <div className={styles.extraDetails}>
            <span>• Dress is business casual</span>
            <span>• Refreshments will be served</span>
          </div>
          <p className={styles.locationLabel}>Location</p>
          <p className={styles.locationName}>Cathedral Life Centre</p>
          <address>24854 Cathedral Lakes Pkwy | Spring, TX 77386</address>
          <a className={styles.directions} href={directionsUrl}>
            Get Directions
          </a>
        </div>
        <div className={styles.photoStrip}>
          <Image
            alt="Cathedral Life Centre building exterior"
            fill
            quality={85}
            sizes="(max-width: 767px) 33vw, 300px"
            src="/assets/pages/compassion-reception/compassion-reception-exterior.jpg"
          />
          <Image
            alt="Main lobby lounge with sofas and coffee tables"
            fill
            quality={85}
            sizes="(max-width: 767px) 33vw, 300px"
            src="/assets/pages/compassion-reception/main-lobby-lounge-with-sofas-and-coffee-tables.jpg"
          />
          <Image
            alt="Mom holding baby at Cathedral Life Centre"
            fill
            quality={85}
            sizes="(max-width: 767px) 33vw, 300px"
            src="/assets/pages/donate/mom-holding-baby-in-furnished-living-room.jpg"
          />
        </div>
      </section>

      <section aria-labelledby="rsvp-title" className={styles.rsvpSection} id="rsvp">
        <div className={styles.rsvpHeading}>
          <div className={styles.formEyebrow}>
            <span />
            Reserve Your Seat
            <span />
          </div>
          <h2 id="rsvp-title">RSVP</h2>
          <p>
            Thank you for your RSVP by Friday, August 14. We look forward to
            welcoming you to the Compassion Reception on Tuesday, August 18, at
            the Cathedral Life Centre. Additional event details will be sent to
            your email.
          </p>
        </div>
        <div className={styles.formCard}>
          <RsvpForm />
        </div>
      </section>

      <section aria-labelledby="hope-video-title" className={styles.videoSection}>
        <div className={styles.videoInner}>
          <div className={styles.videoCopy}>
            <span>Discover the Mission</span>
            <h2 id="hope-video-title">See Hope in Action</h2>
            <Link href="/">Learn About the Life Centre</Link>
          </div>
          <div className={styles.videoFrame}>
            <iframe
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              src="https://player.vimeo.com/video/1208955332?dnt=1&title=0&byline=0&portrait=0&playsinline=1"
              title="Cathedral Life Centre mission video"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
