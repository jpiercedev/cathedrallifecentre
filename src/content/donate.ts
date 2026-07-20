import { assetPath } from "@/lib/assets";

const giveUrl =
  "https://deka.gives/grace-community-church-woodlands/give?purpose=291";

export const donateContent = {
  metadata: {
    title: "Get Involved",
    description:
      "Give to Cathedral Life Centre and help provide safe housing, meals, job training, counseling, and essential resources for people in need.",
  },
  hero: {
    eyebrow: "Get Involved",
    title: "Your generosity makes",
    emphasis: " a difference!",
    description:
      "Give today to bring hope, healing, and life to someone in need!",
    image: assetPath(
      "pages/donate/bedroom-suite-blue-accent-wall-with-baby-crib.jpg",
    ),
    imageAlt: "Cathedral Life Centre building exterior",
    action: {
      label: "Give Today",
      href: giveUrl,
    },
    video: {
      id: "1210071037",
      title: "Life Centre - Giving",
      poster: assetPath("pages/donate/life-centre-giving-video-poster.jpg"),
    },
  },
  give: {
    eyebrow: "Give",
    title: ["Investing in changed lives", "& brighter futures."],
    paragraphs: [
      "The Cathedral Life Centre is a refuge—where young adults aging out of foster care find a home, moms choosing life receive the support and care they need, and families in crisis are met with compassion and practical help.",
      "Every ministry within these walls is made possible through the generosity of people who believe in making a difference. Your financial support helps provide safe housing, warm meals, job training, counseling, and essential resources for those in need.",
      "When you give, you're investing in changed lives and brighter futures. Together, we can expand this work and bring hope where it's needed most.",
    ],
    image: assetPath(
      "pages/donate/mom-holding-baby-in-furnished-living-room.jpg",
    ),
    imageAlt: "Mom and baby at Cathedral Life Centre",
    check: {
      title: "Give by Check or Cash",
      paragraphs: [
        "Cash or checks may be given in person during any service at Grace Woodlands or delivered to the church office during regular office hours. Please make checks payable to Grace Woodlands and write “Life Centre” in the memo line.",
        "Checks may be mailed to:",
      ],
      address: [
        "Grace Woodlands",
        "ATTN: Life Centre",
        "24400 Interstate 45 N",
        "Spring, TX 77386",
      ],
    },
    waysEyebrow: "Ways to Give",
    ways: [
      {
        number: "01",
        title: "Monthly Partnership",
        description:
          "We are looking for committed monthly donors whose faithful support will lay a solid foundation for ongoing ministries.",
      },
      {
        number: "02",
        title: "Furnish A Room",
        description:
          "You can also make a significant difference by addressing the initial needs required to prepare our facility.",
        options: [
          {
            tone: "terracotta",
            title: "Furnish a Room — $5,000",
            lead: "The Mom Room",
            description:
              " includes bed, furniture, glider rocker, crib, baby items, decor, everyday supplies, and kitchenette renovations and equipment.",
          },
          {
            tone: "navy",
            title: "Furnish an Apartment Suite — $10,000",
            description:
              "There are a few locations in our facility that we could renovate and design multi-room apartment-style suites for families, which would include multiple beds, bunk bed, furniture, vanity, table/desk, and a kitchenette.",
          },
        ],
      },
      {
        number: "03",
        title: "General Support",
        description:
          "Give a single gift to the building restoration and ongoing ministry support.",
      },
      {
        number: "04",
        title: "In-Kind Donations",
        description:
          "To make an in-kind donation, contact Bill Phillips, Grace Ministry Giving Director. You may call the church office (832-381-2306), or email legacy@gracewoodlands.com.",
      },
      {
        number: "05",
        title: "Planned Legacy Giving",
        description:
          "To make a Legacy Gift, contact Bill Phillips, Grace Ministry Giving Director. You may call the church office (832-381-2306), or email legacy@gracewoodlands.com, or visit gm.giftlegacy.com",
      },
    ],
    action: {
      label: "Give Online",
      href: giveUrl,
    },
    nonprofit: {
      beforeLink: "The Cathedral Life Centre is a ministry of ",
      linkLabel: "Grace Church",
      linkHref: "https://gracewoodlands.com/",
      afterLink:
        ". Grace is a non-profit organized under section 501(c)(3) of the Internal Revenue Code; therefore, all contributions are tax-deductible.",
    },
  },
} as const;
