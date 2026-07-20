export const graceGarageContent = {
  metadata: {
    title: "Grace Garage",
    description:
      "Grace Garage serves single moms, widows, and wives of deployed military with complimentary oil changes and trustworthy vehicle inspections.",
  },
  hero: {
    eyebrow: "Grace Garage",
    titleLead: "What is",
    titleEmphasis: "Grace Garage?",
    description:
      "The Grace Garage is a ministry of Grace Woodlands dedicated to serving single moms, widows, and wives of deployed military.",
    image: "/assets/pages/grace-garage/grace-garage-hero.jpg",
  },
  overview: {
    eyebrow: "About the Ministry",
    title: "Complimentary oil changes and trustworthy vehicle inspections.",
    description:
      "Complimentary oil changes and trustworthy vehicle inspections help the women we serve have an added sense of confidence when traveling to work, driving to medical appointments, taking children to school, grocery shopping, etc.",
    servicesLabel: "We currently provide services for:",
    services: ["Single moms", "Widows", "Wives of deployed military"],
    images: [
      {
        alt: "Grace Garage service bays",
        src: "/assets/pages/grace-garage/grace-garage-shop-main.jpg",
      },
      {
        alt: "Grace Garage mechanics inspecting a vehicle",
        src: "/assets/pages/grace-garage/grace-garage-shop-detail.jpg",
      },
      {
        alt: "Grace Garage team welcoming a guest",
        src: "/assets/pages/grace-garage/grace-garage-shop-team.jpg",
      },
    ],
  },
  impact: {
    eyebrow: "See the Impact",
    title: "Give the gift of hope to a single mom in need.",
    description:
      "A donation of any amount, including assets of value, helps ensure a mom and her children have safe and reliable transportation. All donations are tax deductible.",
    action: {
      href: "https://deka.gives/grace-community-church-woodlands/give?purpose=294",
      label: "Click to Donate",
    },
    video: {
      id: "1039280625",
      poster: "/assets/pages/grace-garage/grace-garage-video-poster.jpg",
      title: "Donate to the Grace Garage today!",
    },
  },
  volunteer: {
    eyebrow: "Get Involved",
    title: "Join the Grace Garage Team!",
    paragraphs: [
      "We need qualified mechanics ready to serve the community and teach young people who wish to learn more about fixing cars, administrative help, and a caring team of women ready to minister to the women we are serving.",
      "Are you a single mom or widow who needs help with your vehicle? We know asking for help can be hard, so we’ve made the application process simple. All applications will be reviewed, and if approved, we will contact you to schedule an appointment.",
    ],
    image: "/assets/pages/grace-garage/grace-garage-volunteer.jpg",
    imageAlt: "Grace Garage volunteers working on a vehicle",
    imageEyebrow: "Grace Garage",
    imageCaption: "A Ministry of Grace Woodlands",
    actions: [
      {
        href: "https://gracewoodlands.churchcenter.com/people/forms/476964",
        label: "Apply for Help",
        kind: "primary",
      },
      {
        href: "https://gracewoodlands.churchcenter.com/people/forms/486902",
        label: "Join the Team",
        kind: "secondary",
      },
    ],
  },
  contact: {
    eyebrow: "Find Out More",
    title: "Connect With the Life Centre",
    description: "Questions? Email garage@gracewoodlands.com.",
    address: ["24854 Cathedral Lakes Pkwy", "Spring, TX 77386"],
    phone: { href: "tel:8323812306", label: "(832) 381-2306" },
    form: {
      elementId: "cf2e2d4e-8700-3ccc-3eba-783bdfec934b",
      formName: "nvygko",
      pageId: "675127f74333dcb6b0289c81",
    },
  },
} as const;
