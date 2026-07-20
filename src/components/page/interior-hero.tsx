import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";

import styles from "./interior-hero.module.css";

type Breadcrumb = {
  href?: string;
  label: string;
};

type InteriorHeroProps = {
  action?: {
    href: string;
    label: string;
  };
  secondaryAction?: {
    href: string;
    label: string;
  };
  breadcrumbs: readonly Breadcrumb[];
  children: ReactNode;
  description: string;
  eyebrow: string;
  fadeClassName?: string;
  heroClassName?: string;
  image: string;
  imageAlt?: string;
  imagePosition?: string;
  innerClassName?: string;
  overlayClassName?: string;
  showScrollCue?: boolean;
  scrollCueClassName?: string;
  scrollTargetId?: string;
  titleId: string;
};

function Chevron() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="m9 5 7 7-7 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export function InteriorHero({
  action,
  secondaryAction,
  breadcrumbs,
  children,
  description,
  eyebrow,
  fadeClassName,
  heroClassName,
  image,
  imageAlt = "",
  imagePosition = "50% 50%",
  innerClassName,
  overlayClassName,
  showScrollCue = true,
  scrollCueClassName,
  scrollTargetId = "page-content",
  titleId,
}: InteriorHeroProps) {
  return (
    <section
      aria-labelledby={titleId}
      className={[styles.hero, heroClassName].filter(Boolean).join(" ")}
    >
      <Image
        alt={imageAlt}
        className={styles.image}
        fill
        priority
        quality={85}
        sizes="100vw"
        src={image}
        style={{ objectPosition: imagePosition }}
      />
      <div
        aria-hidden="true"
        className={[styles.overlay, overlayClassName].filter(Boolean).join(" ")}
      />
      <div
        aria-hidden="true"
        className={[styles.fade, fadeClassName].filter(Boolean).join(" ")}
      />

      <Container
        className={[styles.inner, innerClassName].filter(Boolean).join(" ")}
      >
        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
          <ol>
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={`${breadcrumb.label}-${index}`}>
                {index > 0 ? <Chevron /> : null}
                {breadcrumb.href ? (
                  <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                ) : (
                  <span
                    aria-current={
                      index === breadcrumbs.length - 1 ? "page" : undefined
                    }
                  >
                    {breadcrumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.content}>
          <EyebrowLabel className={styles.eyebrow}>{eyebrow}</EyebrowLabel>
          <h1 id={titleId}>{children}</h1>
          <span aria-hidden="true" className={styles.rule} />
          <p>{description}</p>
          {action || secondaryAction ? (
            <div className={styles.actions}>
              {action ? (
                <ButtonLink className={styles.action} href={action.href}>
                  {action.label}
                </ButtonLink>
              ) : null}
              {secondaryAction ? (
                <ButtonLink
                  className={styles.secondaryAction}
                  href={secondaryAction.href}
                >
                  {secondaryAction.label}
                </ButtonLink>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>

      {showScrollCue ? (
        <a
          aria-label="Scroll to page content"
          className={[styles.scrollCue, scrollCueClassName]
            .filter(Boolean)
            .join(" ")}
          href={`#${scrollTargetId}`}
        >
          <span aria-hidden="true" className={styles.mouse}>
            <span className={styles.wheel} />
          </span>
          <span>Scroll</span>
        </a>
      ) : null}
    </section>
  );
}
