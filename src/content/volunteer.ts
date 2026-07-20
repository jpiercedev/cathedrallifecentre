export const volunteerContent = {
  metadata: {
    title: "Volunteer Ministries",
    description:
      "Discover ways to serve Cathedral Life Centre ministries and make a lasting impact in the Spring, Texas community.",
  },
  applicationUrl:
    "https://gracewoodlands.churchcenter.com/people/forms/1013129",
  hero: {
    image: "/assets/pages/volunteer/community-ministries-card.jpg",
    title: "Volunteer Ministries",
    description:
      "Discover the various ways you can serve our community. Join a team and help us build a legacy of hope and love through our dedicated outreach programs.",
  },
  ministries: [
    {
      name: "Foster Care",
      description:
        "Support families and children in the foster care system through compassionate service.",
      image:
        "/assets/pages/residency-programs/two-women-with-baby-in-lounge.jpg",
    },
    {
      name: "Coaching",
      description:
        "Empower others by sharing your skills and providing mentorship to those in need.",
      image: "/assets/pages/coaching/coaching-card.jpg",
    },
    {
      name: "Adoption",
      description:
        "Help guide and support families through the beautiful journey of adoption.",
      image: "/assets/pages/adoption/adoption-card.jpg",
    },
    {
      name: "Grace Garage",
      description:
        "Help provide free vehicle maintenance and repairs for single moms, widows, and wives of deployed military.",
      href: "https://gracegarage.org",
      image: "/assets/pages/volunteer/community-ministries-card.jpg",
    },
    {
      name: "Groups",
      description:
        "Facilitate and support small groups that foster connection and spiritual growth.",
      image: "/assets/pages/groups/groups-card.jpg",
    },
    {
      name: "Facility Care",
      description:
        "Help maintain a clean, functional, and welcoming environment for Life Centre residents and programs.",
    },
    {
      name: "Office Admin",
      description:
        "Support the Life Centre through organization, communication, and essential administrative tasks.",
    },
  ],
  cta: {
    titleLead: "Ready to make a",
    titleEmphasis: "lasting impact",
    titleTail: "in your community?",
  },
  contact: {
    eyebrow: "Find Out More",
    title: "Connect With the Life Centre",
    description:
      "Have questions about our classes or want to get involved? Fill out the form and our team will be in touch.",
    address: ["24854 Cathedral Lakes Pkwy", "Spring, TX 77386"],
    phone: { href: "tel:8323812306", label: "(832) 381-2306" },
    form: {
      elementId: "cf2e2d4e-8700-3ccc-3eba-783bdfec934b",
      formName: "nvygko",
      pageId: "67f3ff9f44358d26d5ea4376",
    },
  },
} as const;
