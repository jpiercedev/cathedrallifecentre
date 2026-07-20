import type { Metadata } from "next";
import { contactContent } from "@/content/contact";
import { createPageMetadata } from "@/lib/metadata";

import { ContactPageForm } from "./contact-form";
import styles from "./contact.module.css";

export const metadata: Metadata = createPageMetadata({
  absoluteTitle: true,
  title: contactContent.metadata.title,
  description: contactContent.metadata.description,
  path: "/contact",
});

export default function ContactPage() {
  const { intro } = contactContent;

  return (
    <main className={styles.main} id="main-content">
      <h1 className={styles.srOnly}>Contact</h1>
      <div className={styles.pageInner}>
        <div className={styles.layout}>
          <aside aria-labelledby="contact-intro-title" className={styles.introCard}>
            <p className={styles.eyebrow}>{intro.eyebrow}</p>
            <h2 id="contact-intro-title">{intro.title}</h2>
            <p className={styles.description}>{intro.description}</p>
            <ul>
              {intro.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </aside>
          <ContactPageForm />
        </div>
      </div>
    </main>
  );
}
