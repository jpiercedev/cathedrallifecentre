"use client";

import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FormEvent, useState } from "react";

import styles from "./compassion-reception.module.css";

const webflowFormEndpoint =
  "https://webflow.com/api/v1/form/663792c3759f35a04eea8483";
const pageId = "6a5111cc823f1288bc844b65";
const elementId = "dda7bd19-b7b7-1771-ccaa-31744a02302b";
const maximumGuests = 8;

type FormStatus = "idle" | "submitting" | "success" | "error";

export function RsvpForm() {
  const [guests, setGuests] = useState<number[]>([]);
  const [nextGuestId, setNextGuestId] = useState(1);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [guestNotice, setGuestNotice] = useState("");

  function addGuest() {
    if (guests.length >= maximumGuests) return;
    const guestNumber = guests.length + 1;
    setGuests((current) => [...current, nextGuestId]);
    setNextGuestId((current) => current + 1);
    setGuestNotice(`Guest ${guestNumber} added.`);
  }

  function removeGuest(id: number, guestNumber: number) {
    setGuests((current) => current.filter((guestId) => guestId !== id));
    setGuestNotice(`Guest ${guestNumber} removed. Guest numbering updated.`);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    setStatus("submitting");
    const data = new FormData(form);
    const body = new URLSearchParams({
      name: "Html Form",
      source: window.location.href,
      test: "false",
      dolphin: "false",
      pageId,
      elementId,
    });

    for (const [key, value] of data.entries()) {
      body.append(`fields[${key}]`, String(value));
    }

    try {
      const response = await fetch(webflowFormEndpoint, {
        body,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
      });
      if (!response.ok) throw new Error(`Form returned ${response.status}`);
      setStatus("success");
      setGuests([]);
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.formSuccess} data-testid="rsvp-success" role="status">
        <h3>Thank You</h3>
        <p>Your RSVP has been received. We look forward to welcoming you.</p>
      </div>
    );
  }

  return (
    <form
      aria-label="Compassion Reception RSVP"
      className={styles.form}
      method="post"
      onSubmit={handleSubmit}
    >
      <fieldset disabled={status === "submitting"}>
        <div className={styles.nameFields}>
          <label>
            <span>First Name</span>
            <input
              autoComplete="given-name"
              name="First-Name"
              placeholder="First name"
              required
              type="text"
            />
          </label>
          <label>
            <span>Last Name</span>
            <input
              autoComplete="family-name"
              name="Last-Name"
              placeholder="Last name"
              required
              type="text"
            />
          </label>
        </div>

        <label>
          <span>Email</span>
          <input
            autoComplete="email"
            name="Email"
            placeholder="your@email.com"
            required
            type="email"
          />
        </label>

        <label>
          <span>Phone Number</span>
          <input
            autoComplete="tel"
            name="Phone"
            placeholder="(555) 555-5555"
            required
            type="tel"
          />
        </label>

        <div className={styles.attendanceFields}>
          <fieldset>
            <legend>Will you be attending?</legend>
            <div className={styles.choiceRow}>
              <label className={styles.radioOption}>
                <input name="Will-you-be-attending" required type="radio" value="Yes" />
                Yes
              </label>
              <label className={styles.radioOption}>
                <input name="Will-you-be-attending" required type="radio" value="No" />
                No
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>If attending, will you be bringing guests?</legend>
            <div className={styles.choiceRow}>
              <label className={styles.radioOption}>
                <input name="Bringing-guests" required type="radio" value="Yes" />
                Yes
              </label>
              <label className={styles.radioOption}>
                <input name="Bringing-guests" required type="radio" value="No" />
                No
              </label>
            </div>
          </fieldset>
        </div>

        {guests.length > 0 ? (
          <div className={styles.guestFields}>
            {guests.map((id, index) => {
              const guestNumber = index + 1;
              return (
                <fieldset
                  aria-label={`Guest ${guestNumber}`}
                  className={styles.guestCard}
                  key={id}
                >
                  <div className={styles.guestHeader}>
                    <legend>Guest {guestNumber}</legend>
                    <button
                      aria-label={`Remove Guest ${guestNumber}`}
                      className={styles.removeGuest}
                      onClick={() => removeGuest(id, guestNumber)}
                      type="button"
                    >
                      <XMarkIcon aria-hidden="true" />
                      Remove Guest
                    </button>
                  </div>
                  <div className={styles.guestNameFields}>
                    <label>
                      <span>First Name</span>
                      <input
                        autoComplete="off"
                        name={`Guest-${guestNumber}-First-Name`}
                        required
                        type="text"
                      />
                    </label>
                    <label>
                      <span>Last Name</span>
                      <input
                        autoComplete="off"
                        name={`Guest-${guestNumber}-Last-Name`}
                        required
                        type="text"
                      />
                    </label>
                  </div>
                  <label>
                    <span>Email</span>
                    <input
                      autoComplete="off"
                      name={`Guest-${guestNumber}-Email`}
                      type="email"
                    />
                  </label>
                </fieldset>
              );
            })}
          </div>
        ) : null}

        <button
          className={styles.addGuest}
          disabled={guests.length >= maximumGuests || status === "submitting"}
          onClick={addGuest}
          type="button"
        >
          <PlusIcon aria-hidden="true" />
          Add a Guest
        </button>
        <p aria-live="polite" className={styles.guestNotice} role="status">
          {guestNotice}
        </p>

        <label>
          <span>Questions or Special Considerations</span>
          <textarea name="Comments" placeholder="Anything we should know?" />
        </label>

        <button className={styles.submit} type="submit">
          {status === "submitting" ? "Submitting…" : "Submit RSVP"}
        </button>
      </fieldset>

      {status === "error" ? (
        <p aria-live="assertive" className={styles.formError} role="alert">
          We couldn&apos;t submit your RSVP. Please try again or call (832) 381-2306.
        </p>
      ) : null}
    </form>
  );
}
