export const communityMinistriesContent = {
  metadata: {
    title: "Community Ministries",
    description:
      "Cathedral Life Centre community ministries provide practical support for women and families through Grace Garage, Fresh Start, and everyday resources.",
  },
  hero: {
    eyebrow: "Community Ministries",
    titleLead: "Care for",
    titleEmphasis: "personal needs",
    image: "/assets/pages/community-ministries/mother-holding-newborn.jpg",
  },
  program: {
    eyebrow: "Community Ministries",
    title: "Caring for the whole person, in every area of life.",
    description:
      "Not only will we provide care in significant areas of personal need, but also in the concerns of everyday life. Our community ministries bring assistance for transitional housing, vehicle maintenance, second-hand clothing, and other resources and materials for women in need.",
    image: "/assets/pages/community-ministries/woman-on-porch.jpg",
    imageAlt: "Cathedral Life Centre porch",
    ministriesLabel: "Our Community Ministries",
    ministries: [
      { label: "GraceGarage.org", href: "/grace-garage", available: true },
      { label: "Fresh Start Ministry", href: "/fresh-start", available: true },
      { label: "Resale Shop", href: null, available: false },
      { label: "Beauty Salon", href: null, available: true },
      { label: "Library", href: null, available: false },
    ],
  },
  contact: {
    eyebrow: "Find Out More",
    title: "Connect With the Life Centre",
    description:
      "Have questions about our community ministries or want to get involved? Fill out the form and our team will be in touch.",
    address: ["24854 Cathedral Lakes Pkwy", "Spring, TX 77386"],
    phone: { href: "tel:8323812306", label: "(832) 381-2306" },
    form: {
      elementId: "bed8a05b-ac05-f61d-8fde-62cb78dd699d",
      formName: "qwybyu",
      pageId: "66aefe22335aaf4dfc3627be",
    },
  },
} as const;
