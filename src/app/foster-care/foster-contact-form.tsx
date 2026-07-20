"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import { FormEvent, useState } from "react";

import styles from "./foster-care.module.css";

const webflowFormEndpoint =
  "https://webflow.com/api/v1/form/663792c3759f35a04eea8483";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function FosterContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      name: "wvkizi",
      source: window.location.href,
      test: "false",
      dolphin: "false",
      pageId: "66aef778716ef72443d85f70",
      elementId: "0b593cc8-6028-fa4a-63b8-8f8d5cd1a018",
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
        className={styles.formSuccess}
        data-testid="foster-form-success"
        role="status"
      >
        <span aria-hidden="true" className={styles.successIcon}>
          <CheckIcon />
        </span>
        <p>We&apos;ll be in contact soon!</p>
      </div>
    );
  }

  return (
    <form
      aria-label="Contact the Foster Care ministry"
      className={styles.contactForm}
      id="foster-care-form"
      method="post"
      onSubmit={handleSubmit}
    >
      <div className={styles.formField}>
        <label htmlFor="foster-name">Name</label>
        <input
          autoComplete="name"
          id="foster-name"
          maxLength={256}
          name="Name"
          placeholder="Your name"
          required
          type="text"
        />
      </div>
      <div className={styles.formField}>
        <label htmlFor="foster-email">Email Address</label>
        <input
          autoComplete="email"
          id="foster-email"
          maxLength={256}
          name="Email Address"
          placeholder="your@email.com"
          required
          type="email"
        />
      </div>
      <p className={styles.messageCaption}>Message</p>
      <button
        className={styles.primaryButton}
        disabled={status === "submitting"}
        type="submit"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
      {status === "error" ? (
        <p aria-live="assertive" className={styles.formError} role="alert">
          Oops! Something went wrong while submitting the form.
        </p>
      ) : null}
    </form>
  );
}
