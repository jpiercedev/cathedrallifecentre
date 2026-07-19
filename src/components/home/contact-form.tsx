import styles from "./contact-form.module.css";

export function ContactForm() {
  return (
    <form aria-describedby="contact-delivery-notice" className={styles.form}>
      <h3>Send Us a Message</h3>
      <p hidden id="contact-delivery-notice">
        Online form submission is unavailable. Please call (832) 381-2306.
      </p>
      <fieldset disabled>
        <label htmlFor="contact-name">Name</label>
        <input
          autoComplete="name"
          id="contact-name"
          name="name"
          placeholder="Your full name"
          type="text"
        />
        <label htmlFor="contact-email">Email Address</label>
        <input
          autoComplete="email"
          id="contact-email"
          name="email"
          placeholder="your@email.com"
          type="email"
        />
        <label className={styles.messageLabel}>Message</label>
        <button disabled type="submit">
          Submit
        </button>
      </fieldset>
    </form>
  );
}
