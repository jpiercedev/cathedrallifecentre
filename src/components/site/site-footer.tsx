import Image from "next/image";
import Link from "next/link";
import { navigation } from "@/data/navigation";

import styles from "./site-footer.module.css";

const quickLinkLabels = new Set(["Volunteer", "Contact", "Partner With Us"]);
const ministryLinks = navigation.footer.filter(
  (item) => !quickLinkLabels.has(item.label),
);
const quickLinks = navigation.footer.filter((item) =>
  quickLinkLabels.has(item.label),
);

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link aria-label="Cathedral Life Centre home" href="/">
            <Image
              alt="Cathedral Life Centre"
              className={styles.logo}
              height={249}
              src="/assets/global/cathedral-life-centre-logo.png"
              width={1088}
            />
          </Link>
          <p>
            A Christ-centered refuge bringing hope, healing, and life to women
            and families in need.
          </p>
          <Link className={styles.donate} href="/donate" prefetch={false}>
            Donate
          </Link>
        </div>

        <div className={styles.linkGroup}>
          <h2>Ministries</h2>
          <ul>
            {ministryLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} prefetch={false}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.linkGroup}>
          <h2>Quick Links</h2>
          <ul>
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} prefetch={false}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.contact}>
          <h2>Contact</h2>
          <address>
            24854 Cathedral Lakes Pkwy
            <br />
            Spring, TX 77386
          </address>
          <a href="tel:8323812306">(832) 381-2306</a>
          <a href="https://www.cathedrallifecentre.com/">
            CathedralLifeCentre.com
          </a>
        </div>
      </div>
      <div className={styles.legal}>
        <div className={styles.legalInner}>
          <p>
            Cathedral Life Centre • 24854 Cathedral Lakes Pkwy, Spring, TX
            77386 • (832) 381-2306 • CathedralLifeCentre.com
          </p>
          <p className={styles.ministryNote}>
            The Cathedral Life Centre is a ministry of{" "}
            <a href="https://gracewoodlands.com/">Grace Church</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
