"use client";

import { ContactForm } from "@/components/home/contact-form";

type FosterContactFormProps = {
  className?: string;
};

const fosterWebflowDelivery = {
  elementId: "0b593cc8-6028-fa4a-63b8-8f8d5cd1a018",
  formName: "wvkizi",
  pageId: "66aef778716ef72443d85f70",
} as const;

export function FosterContactForm({ className }: FosterContactFormProps) {
  return (
    <ContactForm
      ariaLabel="Contact the Foster Care ministry"
      className={className}
      compact
      heading={null}
      idPrefix="foster"
      namePlaceholder="Your name"
      submitLabel="Send Message"
      webflowDelivery={fosterWebflowDelivery}
    />
  );
}
