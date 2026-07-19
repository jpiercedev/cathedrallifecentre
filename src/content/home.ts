import { assetPath } from "@/lib/assets";

export const homeContent = {
  hero: {
    eyebrow: "Spring, Texas",
    title: ["Hope Restored.", "Lives Rebuilt.", "Futures Renewed."],
    description:
      "A Christ-centered refuge for single moms choosing life, women in crisis, and families in need—bringing",
    emphasis: "hope, healing, and life!",
    image: assetPath("pages/home/building-exterior.jpg"),
  },
  mission: {
    eyebrow: "Our Mission",
    title: "Bringing Hope, Healing & Life to Women in Crisis",
    paragraphs: [
      {
        text: "The Life Centre is a 50,000-sq. ft. Christ-centered refuge where women escaping domestic abuse, single moms choosing life, young adults aging out of foster care, and families in crisis can find safety, stability, and hope.",
        strong: true,
      },
      {
        text: "Through transitional housing, life skills coaching, spiritual guidance, basic car maintenance, and care, we help families rebuild their lives with dignity — all at no charge.",
      },
      {
        text: "We do not receive government funding.",
        emphasis:
          "This ministry exists because generous partners choose to step forward and make a life-changing difference.",
      },
      {
        text: "Will you partner with us to help women and children in desperate need?",
        strong: true,
      },
    ],
    images: {
      motherAndBaby: assetPath("pages/home/mother-and-baby-home-hero.jpg"),
      community: assetPath(
        "pages/residency-programs/two-women-with-baby-in-lounge.jpg",
      ),
      lounge: assetPath("pages/home/common-lounge-fireplace.jpg"),
    },
  },
  statement: {
    strong: "Your donation can change someone’s world",
    rest: "—helping women and children move beyond crisis and into a future filled with stability, renewed hope, and new beginnings.",
  },
  ministries: {
    eyebrow: "What We Do",
    title: "Our Ministries",
    description:
      "Our ministries provide practical support, lasting hope, and personalized care for women and children in difficult seasons of life.",
    items: [
      {
        title: "Residency Programs",
        href: "/residency-programs",
        image: assetPath("pages/about/bedroom-suite-blue-wall-and-crib.jpg"),
      },
      {
        title: "The Market",
        href: "/the-market",
        image: assetPath("pages/the-market/the-market-hero.jpg"),
      },
      {
        title: "Fresh Start",
        href: "/fresh-start",
        image: assetPath(
          "pages/compassion-reception/compassion-reception-exterior.jpg",
        ),
      },
      {
        title: "Foster Care",
        href: "/foster-care",
        image: assetPath("pages/foster-care/foster-care-card.jpg"),
      },
      {
        title: "Adoption",
        href: "/adoption",
        image: assetPath("pages/adoption/adoption-card.jpg"),
      },
      {
        title: "Grace Garage",
        href: "/grace-garage",
        image: assetPath("pages/volunteer/community-ministries-card.jpg"),
      },
      {
        title: "Coaching",
        href: "/coaching",
        image: assetPath("pages/coaching/coaching-card.jpg"),
      },
      {
        title: "Groups",
        href: "/groups",
        image: assetPath("pages/groups/groups-card.jpg"),
      },
      {
        title: "Classes",
        href: "/classes",
        image: assetPath("pages/classes/classes-card.jpg"),
      },
    ],
  },
  residency: {
    eyebrow: "Featured Programs",
    title: "A Safe Haven for Women & Families",
    description:
      "We provide more than shelter—we equip residents with essential life skills and a strong foundation, empowering them to reenter their communities with renewed confidence and a bright, hopeful future.",
    bullets: [
      "Women in Crisis & Families in Need",
      "Disaster Relief & Medical Crisis Housing",
      "Foster Transition Housing (18+)",
      "Crisis Pregnancy Support (18+)",
    ],
    image: assetPath(
      "pages/residency-programs/pregnant-woman-arriving-at-entrance.jpg",
    ),
    applicationUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSfU-kTygPih0cx3bQ_e7oXbkpsiiQrhUp3gBv6BCFROkalRww/viewform",
  },
  giving: {
    eyebrow: "Your Generosity Matters",
    title: "Every Gift Brings Hope",
    description:
      "Your financial support provides safe housing, warm meals, job training, counseling, and essential resources. When you give, you invest in changed lives and brighter futures.",
    cards: [
      {
        eyebrow: "Monthly Partnership",
        title: "Faithful Monthly Giving",
        description:
          "Committed monthly donors lay a solid foundation for ongoing ministries and consistent support for residents.",
      },
      {
        eyebrow: "Furnish a Room\n$5,000",
        title: "The Mom Room",
        description:
          "Bed, furniture, glider rocker, crib, baby items, décor, everyday supplies & kitchenette renovations for a new mom.",
        featured: true,
      },
      {
        eyebrow: "Furnish An Apartment\n$10,000",
        title: "Family Suite",
        description:
          "Multi-room suites for families—beds, bunk beds, furniture, vanity, table/desk & kitchenette renovations.",
      },
    ],
  },
  volunteer: {
    eyebrow: "Get Involved",
    title: "Volunteer Opportunities",
    paragraphs: [
      {
        text: "Volunteering at Cathedral Life Centre is a rewarding way to serve your community and strengthen your faith. Volunteers assist in organizing events, coaching, leading groups, and providing direct aid.",
      },
      {
        text: "By volunteering, you spread the message of",
        emphasis: "hope, healing, and life!",
      },
    ],
    image: assetPath("pages/home/building-exterior.jpg"),
    applicationUrl:
      "https://gracewoodlands.churchcenter.com/people/forms/1013129",
  },
  contact: {
    eyebrow: "Reach Out",
    title: "Find Out More",
    description:
      "Whether you need help, want to volunteer, or are looking to partner with us—we'd love to hear from you.",
    address: "24854 Cathedral Lakes Pkwy, Spring, TX 77386",
    phoneDisplay: "(832) 381-2306",
    phoneHref: "tel:8323812306",
  },
} as const;
