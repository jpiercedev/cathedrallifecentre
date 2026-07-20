import styles from "./contact-form.module.css";

type ContactFormProps = {
  className?: string;
  compact?: boolean;
  heading?: string | null;
  idPrefix?: string;
  namePlaceholder?: string;
  submitLabel?: string;
};

export function ContactForm({
  className,
  compact = false,
  heading = "Send Us a Message",
  idPrefix = "contact",
  namePlaceholder = "Your full name",
  submitLabel = "Submit",
}: ContactFormProps = {}) {
  const noticeId = `${idPrefix}-delivery-notice`;

  return (
    <form
      aria-describedby={noticeId}
      className={[styles.form, compact ? styles.compact : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {heading ? <h3>{heading}</h3> : null}
      <p hidden id={noticeId}>
        Online form submission is unavailable. Please call (832) 381-2306.
      </p>
      <fieldset disabled>
        <label htmlFor={`${idPrefix}-name`}>Name</label>
        <input
          autoComplete="name"
          id={`${idPrefix}-name`}
          name="name"
          placeholder={namePlaceholder}
          type="text"
        />
        <label htmlFor={`${idPrefix}-email`}>Email Address</label>
        <input
          autoComplete="email"
          id={`${idPrefix}-email`}
          name="email"
          placeholder="your@email.com"
          type="email"
        />
        <label className={styles.messageLabel}>Message</label>
        <button disabled type="submit">
          {submitLabel}
        </button>
      </fieldset>
    </form>
  );
}
