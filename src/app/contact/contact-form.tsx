"use client";

import { FormEvent, useState } from "react";
import { contactContent } from "@/content/contact";

import styles from "./contact.module.css";

const webflowFormEndpoint =
  "https://webflow.com/api/v1/form/663792c3759f35a04eea8483";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactPageForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const { delivery, interests, title } = contactContent.form;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const selectedInterests = data.getAll("Interest").map(String);
    const body = new URLSearchParams({
      name: delivery.formName,
      source: window.location.href,
      test: "false",
      dolphin: "false",
      pageId: delivery.pageId,
      elementId: delivery.elementId,
      "fields[name-2]": String(data.get("name-2") ?? "").trim(),
      "fields[email-2]": String(data.get("email-2") ?? "").trim(),
      "fields[Message]": String(data.get("Message") ?? "").trim(),
      "fields[Phone]": String(data.get("Phone") ?? "").trim(),
      "fields[Interest]": selectedInterests.join(", "),
    });

    setStatus("submitting");
    try {
      const response = await fetch(webflowFormEndpoint, {
        body,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
      });
      if (!response.ok) throw new Error(`Form returned ${response.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        aria-live="polite"
        className={`${styles.formCard} ${styles.formSuccess}`}
        data-testid="contact-form-success"
        role="status"
      >
        <p>Thank you! Your submission has been received!</p>
      </div>
    );
  }

  return (
    <div className={styles.formCard}>
      <form
        aria-label="Contact Form"
        className={styles.form}
        method="post"
        onSubmit={handleSubmit}
      >
        <h2>{title}</h2>

        <label className={styles.nameLabel} htmlFor="contact-name">
          Name
        </label>
        <input
          autoComplete="name"
          className={styles.nameInput}
          id="contact-name"
          maxLength={256}
          name="name-2"
          required
          type="text"
        />

        <label className={styles.emailLabel} htmlFor="contact-email">
          Email Address
        </label>
        <input
          autoComplete="email"
          className={styles.emailInput}
          id="contact-email"
          maxLength={256}
          name="email-2"
          required
          type="email"
        />

        <label className={styles.messageLabel} htmlFor="contact-message">
          Message
        </label>
        <textarea
          className={styles.messageInput}
          id="contact-message"
          maxLength={5000}
          name="Message"
        />

        <label className={styles.phoneLabel} htmlFor="contact-phone">
          Phone
        </label>
        <input
          autoComplete="tel"
          className={styles.phoneInput}
          id="contact-phone"
          maxLength={256}
          name="Phone"
          placeholder="Example text"
          required
          type="tel"
        />

        <fieldset className={styles.interests}>
          <legend>
            How can we help? <span>(optional)</span>
          </legend>
          {interests.map((interest, index) => (
            <label htmlFor={`contact-interest-${index}`} key={interest.value}>
              <input
                id={`contact-interest-${index}`}
                name="Interest"
                type="checkbox"
                value={interest.value}
              />
              <span aria-hidden="true" className={styles.interestPrefix}>
                Interest
              </span>
              <span>{interest.label}</span>
            </label>
          ))}
        </fieldset>

        <button disabled={status === "submitting"} type="submit">
          {status === "submitting" ? "Submitting…" : "Submit"}
        </button>
        {status === "error" ? (
          <p aria-live="assertive" className={styles.formError} role="alert">
            Oops! Something went wrong while submitting the form.
          </p>
        ) : null}
      </form>
    </div>
  );
}
