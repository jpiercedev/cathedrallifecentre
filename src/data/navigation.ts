import type { NavigationModel } from "@/types/navigation";

/**
 * Verified from the rendered production homepage on 2026-07-18 CDT.
 * This is source navigation data, not a completed navigation component.
 */
export const navigation = {
  announcement: [
    {
      label: "Learn More",
      href: "https://gracewoodlands.com/",
      target: "_blank",
    },
  ],
  primary: [
    { label: "Home", href: "/" },
    {
      label: "Ministries",
      children: [
        { label: "Residency Programs", href: "/residency-programs" },
        { label: "Foster Care", href: "/foster-care" },
        { label: "Adoption", href: "/adoption" },
        { label: "Grace Garage", href: "/grace-garage" },
        { label: "Coaching", href: "/coaching" },
        { label: "Groups", href: "/groups" },
        { label: "Classes", href: "/classes" },
        { label: "Volunteer", href: "/volunteer" },
        { label: "Fresh Start", href: "/fresh-start" },
        { label: "The Market", href: "/the-market" },
      ],
    },
    { label: "Partner with Us", href: "/donate" },
    { label: "Contact", href: "/contact" },
  ],
  actions: [{ label: "Donate", href: "/donate" }],
  footer: [
    { label: "Residency Programs", href: "/residency-programs" },
    { label: "Foster Care", href: "/foster-care" },
    { label: "Adoption", href: "/adoption" },
    { label: "Groups", href: "/groups" },
    { label: "Coaching", href: "/coaching" },
    { label: "Classes", href: "/classes" },
    { label: "The Market", href: "/the-market" },
    { label: "Fresh Start", href: "/fresh-start" },
    { label: "Volunteer", href: "/volunteer" },
    { label: "Contact", href: "/contact" },
    { label: "Partner With Us", href: "/donate" },
  ],
} as const satisfies NavigationModel;
