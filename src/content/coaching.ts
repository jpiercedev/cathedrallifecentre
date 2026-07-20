export const coachingContent = {
  metadata: {
    title: "Coaching",
    description:
      "Cathedral Life Centre coaching provides Biblical guidance, practical life skills, and supportive planning for individuals and families.",
  },
  hero: {
    eyebrow: "Coaching",
    titleLead: "Coaching makes",
    titleEmphasis: "a difference",
    image: "/assets/pages/coaching/coaching-hero.jpg",
  },
  program: {
    eyebrow: "Coaching Makes a Difference",
    title: "Enhancing life skills & aligning with God's purpose.",
    paragraphs: [
      "Coaching can help individuals achieve personal and professional fulfillment by enhancing life skills and aligning their journey with God's purpose for their lives. The program offers supportive guidance, skills development, and a clear path toward healthy living, all taught from a Biblical worldview.",
      "Coaches and classes can assist in identifying goals, developing effective strategies, and creating action plans to build confidence and see meaningful progress.",
    ],
    quotes: [
      {
        quote: '"As iron sharpens iron, so one person sharpens another."',
        citation: "Proverbs 27:17",
        primary: true,
      },
      {
        quote:
          '"Listen to the advice and accept discipline, and at the end you will be counted among the wise."',
        citation: "Proverbs 19:20",
        primary: false,
      },
    ],
    conclusion:
      "Through the resources and support available at the facility, the commitment is to help individuals and families thrive!",
    image: "/assets/pages/coaching/coaching-session.jpg",
    imageAlt: "Cathedral Life Centre courtyard",
    topicsLabel: "Topics We Cover",
    topics: [
      { label: "Finances", available: true },
      { label: "Credit Building", available: true },
      { label: "Church and Faith", available: true },
      { label: "Marriage", available: true },
      { label: "Parenting", available: true },
      { label: "Home Management", available: false },
      { label: "Family Connection", available: false },
      { label: "Job Skills Training", available: false },
      { label: "Nutrition and Health", available: false },
    ],
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
      pageId: "66aefedb03afe5fdd7af2dea",
    },
  },
} as const;
