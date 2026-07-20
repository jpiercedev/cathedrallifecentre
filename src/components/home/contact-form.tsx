"use client";

import { FormEvent, useState } from "react";

import styles from "./contact-form.module.css";

const webflowFormEndpoint =
  "https://webflow.com/api/v1/form/663792c3759f35a04eea8483";

type FormStatus = "idle" | "submitting" | "success" | "error";

type WebflowDelivery = {
  elementId: string;
  formName: string;
  pageId: string;
};

type ContactFormProps = {
  ariaLabel?: string;
  className?: string;
  compact?: boolean;
  heading?: string | null;
  idPrefix?: string;
  namePlaceholder?: string;
  submitLabel?: string;
  webflowDelivery?: WebflowDelivery;
};

export function ContactForm({
  ariaLabel = "Contact the Cathedral Life Centre",
  className,
  compact = false,
  heading = "Send Us a Message",
  idPrefix = "contact",
  namePlaceholder = "Your full name",
  submitLabel = "Submit",
  webflowDelivery,
}: ContactFormProps = {}) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const noticeId = `${idPrefix}-delivery-notice`;
  const isLive = Boolean(webflowDelivery);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!webflowDelivery) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("Name") ?? "").trim();
    const email = String(data.get("Email Address") ?? "").trim();

    if (!name || !email) {
      form.reportValidity();
      return;
    }

    setStatus("submitting");
    const body = new URLSearchParams({
      name: webflowDelivery.formName,
      source: window.location.href,
      test: "false",
      dolphin: "false",
      pageId: webflowDelivery.pageId,
      elementId: webflowDelivery.elementId,
      "fields[Name]": name,
      "fields[Email Address]": email,
      "fields[Message]": "",
    });

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
        className={[
          styles.form,
          compact ? styles.compact : "",
          styles.formSuccess,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        data-testid={`${idPrefix}-form-success`}
        role="status"
      >
        <p>We&apos;ll be in contact soon!</p>
      </div>
    );
  }

  return (
    <form
      aria-describedby={isLive ? undefined : noticeId}
      aria-label={ariaLabel}
      className={[styles.form, compact ? styles.compact : "", className]
        .filter(Boolean)
        .join(" ")}
      id={`${idPrefix}-form`}
      method="post"
      onSubmit={handleSubmit}
    >
      {heading ? <h3>{heading}</h3> : null}
      {!isLive ? (
        <p hidden id={noticeId}>
          Online form submission is unavailable. Please call (832) 381-2306.
        </p>
      ) : null}
      <fieldset disabled={!isLive || status === "submitting"}>
        <label htmlFor={`${idPrefix}-name`}>Name</label>
        <input
          autoComplete="name"
          id={`${idPrefix}-name`}
          maxLength={256}
          name="Name"
          placeholder={namePlaceholder}
          required={isLive}
          type="text"
        />
        <label htmlFor={`${idPrefix}-email`}>Email Address</label>
        <input
          autoComplete="email"
          id={`${idPrefix}-email`}
          maxLength={256}
          name="Email Address"
          placeholder="your@email.com"
          required={isLive}
          type="email"
        />
        <p className={styles.messageLabel}>Message</p>
        <button disabled={!isLive || status === "submitting"} type="submit">
          {status === "submitting" ? "Sending…" : submitLabel}
        </button>
      </fieldset>
      {status === "error" ? (
        <p aria-live="assertive" className={styles.formError} role="alert">
          Oops! Something went wrong while submitting the form.
        </p>
      ) : null}
    </form>
  );
}
