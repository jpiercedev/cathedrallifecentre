import { assetPath } from "@/lib/assets";

export const aboutContent = {
  metadata: {
    title: "About",
    description:
      "Learn about the Cathedral Life Centre, its Christ-centered facility, leadership, and commitment to women and families in need.",
  },
  hero: {
    eyebrow: "About the Life Centre",
    title: "A Place of Refuge",
    emphasis: "Transformation",
    description:
      "Created to bring hope, healing, and life to those in need — this 50,000+ sq. ft. facility is home to Christ-centered programs and ministries serving women and families.",
    image: assetPath("pages/about/hero-rachele-helping-woman.jpg"),
    actions: [
      { label: "Give", href: "/donate" },
      { label: "Serve", href: "/volunteer" },
    ],
  },
  facility: {
    eyebrow: "The Facility & Our Commitment",
    title: "A Safe Haven. A Place of Hope.",
    lead:
      "The Cathedral Life Center at Grace Woodlands is a Christ-centered refuge of compassion in the Spring / North Houston region for women escaping domestic abuse, single moms choosing life for their babies, young adults aging out of foster care, and families facing crisis.",
    paragraphs: [
      "This 50,000+ square foot facility provides fully furnished transitional housing, life skills coaching, spiritual guidance, car maintenance, and compassionate care, all at no charge to families who need help rebuilding their lives with dignity and hope.",
      "From its miraculous acquisition to its development as a first-class residential ministry center, the Life Center exists to provide safety, stability, and a future for women, children, and families who need it most.",
    ],
    note:
      "* We do not accept any government funding; instead, we rely 100% on supporters like you who care about women and children desperate for hope.",
    images: [
      {
        image: assetPath(
          "pages/about/bedroom-suite-blue-accent-wall-with-baby-crib.jpg",
        ),
        alt: "Furnished Cathedral Life Centre bedroom suite with a blue accent wall and baby crib",
      },
      {
        image: assetPath("pages/about/mom-playing-with-baby-toy-on-bed.jpg"),
        alt: "Mother playing with her baby on a bed",
      },
      {
        image: assetPath(
          "pages/about/resident-suite-living-area-with-dining-table.jpg",
        ),
        alt: "Cathedral Life Centre resident suite living area and dining table",
      },
    ],
  },
  leadership: {
    eyebrow: "Our Leadership",
    people: [
      {
        id: "steve-and-becky-riggle",
        name: "Steve and Becky Riggle",
        roles: ["Founders"],
        image: assetPath("pages/about/steve-and-becky-riggle.jpg"),
        imageAlt: "Steve and Becky Riggle",
        paragraphs: [
          "Steve and Becky serve as the Founding Senior Pastors of Grace Woodlands Church in The Woodlands, TX, and they are the founders of the Cathedral Life Centre.",
          "Along with pastoring, Steve also serves as the President of Grace International, a fellowship of over 5,900 churches with more than 550,000+ members, various compassion ministries, and educational institutions both nationally and internationally with ministries in 131 nations of the world.",
        ],
      },
      {
        id: "rachele-riggle-karmout",
        name: "Rachele Riggle-Karmout",
        roles: [
          "Director of the Cathedral Life Centre",
          "Family Life Pastor at Grace Church",
        ],
        image: assetPath("pages/about/rachele-riggle-karmout.jpg"),
        imageAlt: "Rachele Riggle-Karmout",
        paragraphs: [
          "Rachele Riggle-Karmout brings heartfelt leadership to both the Cathedral Life Centre and the Grace Family Life ministry. Having spent many years as a single mom of two children who have faced significant physical challenges, Rachele leads with deep empathy, strength, and a passion for helping others.",
          "She is dedicated to seeing families thrive — spiritually, emotionally, and practically. Whether serving children, guiding parents, or reaching out to those in crisis, Rachele's mission is to offer real help and the living hope of Jesus.",
        ],
      },
    ],
  },
  contact: {
    eyebrow: "Find Out More",
    title: "Connect With the Life Centre",
    description:
      "Have questions about our ministry, our facility, or how you can get involved? Fill out the form and our team will be in touch.",
    address: ["24854 Cathedral Lakes Pkwy", "Spring, TX 77386"],
    phone: { label: "(832) 381-2306", href: "tel:8323812306" },
    website: { label: "CathedralLifeCentre.com", href: "/" },
  },
} as const;
