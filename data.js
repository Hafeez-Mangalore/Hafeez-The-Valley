/*
  Sample data — mirrors the future Excel structure:
  Property ID | Property Name | Cluster/Location | Property Type | Bedrooms | Bathrooms |
  Size (sqft) | Price | Status | Description | Key Features | Image URLs | Amenities
  Replace CLUSTERS / PROPERTIES below with real data (or wire up an Excel -> JSON export).
*/

window.AGENT = {
  name: "Muhammad Hafeez",
  title: "Valley Specialist",
  brokerage: "Coldwell Banker Swap Real Estate",
  phone: "+971 50 000 0000",
  whatsapp: "971500000000",
  email: "mhhafeez90@gmail.com",
  photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
  bio: "Specializing exclusively in The Valley by Emaar, Muhammad helps buyers and investors find the right home across every cluster — from first enquiry to handover."
};

window.CLUSTERS = [
  {
    id: "eden",
    name: "Eden",
    tagline: "Garden living at the heart of The Valley",
    description:
      "Eden is a lush, family-first cluster built around central parks and shaded walking trails. Homes here favor wide plots and green frontage, making it a favorite for buyers who want a quieter, garden-community feel without leaving The Valley's core amenities behind.",
    heroImage: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1600&auto=format&fit=crop",
    amenities: ["Central community park", "Kids' play areas", "Jogging & cycling track", "Multi-purpose lawns", "Community pool"],
    nearby: ["The Valley Community Centre — 5 min", "Al Ain Road access — 8 min", "Town Centre retail — 6 min"]
  },
  {
    id: "lillia",
    name: "Lillia",
    tagline: "Contemporary townhomes, resort-style courtyards",
    description:
      "Lillia offers a more contemporary architectural language with private courtyards and resort-style shared pools. It's positioned close to The Valley's town centre, appealing to buyers who want walkable access to retail and dining alongside modern home design.",
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    amenities: ["Resort-style pool deck", "Courtyard gardens", "Fitness pavilion", "Basketball court", "24/7 security"],
    nearby: ["Town Centre — 3 min", "Nursery & school cluster — 7 min", "Golf course preview — 10 min"]
  },
  {
    id: "rosalind",
    name: "Rosalind",
    tagline: "Premium villas for growing families",
    description:
      "Rosalind is home to some of The Valley's larger villa plots, designed for growing families who want extra space, private gardens, and proximity to the community's flagship amenities including the Aqua Adventure and skate park.",
    heroImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1600&auto=format&fit=crop",
    amenities: ["Private garden plots", "Aqua Adventure water park access", "Skate park", "Padel & tennis courts", "Retail plaza"],
    nearby: ["Aqua Adventure — 4 min", "Valley Point retail — 6 min", "Main highway access — 9 min"]
  }
];

window.PROPERTIES = [
  {
    id: "VLY-101",
    name: "Eden Garden Townhouse",
    cluster: "eden",
    type: "Townhouse",
    bedrooms: 3,
    bathrooms: 4,
    size: 2210,
    price: 2450000,
    status: "Available",
    listedDate: "2026-08-20",
    featured: true,
    description:
      "A bright 3-bedroom townhouse on a corner plot facing Eden's central park. Open-plan living opens onto a private garden, with a maid's room and dedicated study nook on the ground floor.",
    features: ["Corner plot", "Private garden", "Maid's room", "Study nook", "Covered parking (2 cars)"],
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "VLY-102",
    name: "Eden Park View Villa",
    cluster: "eden",
    type: "Villa",
    bedrooms: 4,
    bathrooms: 5,
    size: 3180,
    price: 3600000,
    status: "Available",
    listedDate: "2026-09-05",
    featured: false,
    description:
      "Spacious 4-bedroom villa with direct park views, a double-height entrance foyer, and a family lounge upstairs separate from the main living area — ideal for multi-generational living.",
    features: ["Direct park view", "Double-height foyer", "Upper-floor family lounge", "Landscaped garden", "Covered parking (3 cars)"],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "VLY-103",
    name: "Eden Willow Townhouse",
    cluster: "eden",
    type: "Townhouse",
    bedrooms: 3,
    bathrooms: 3,
    size: 1980,
    price: 2180000,
    status: "Rent",
    listedDate: "2026-07-12",
    featured: false,
    description:
      "Well-maintained 3-bedroom townhouse available for rent, walking distance to Eden's play areas. Neutral finishes throughout, ready to move in.",
    features: ["Walk to play area", "Neutral finishes", "Built-in wardrobes", "Covered parking (2 cars)"],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "VLY-201",
    name: "Lillia Courtyard Townhouse",
    cluster: "lillia",
    type: "Townhouse",
    bedrooms: 3,
    bathrooms: 4,
    size: 2050,
    price: 2650000,
    status: "Available",
    listedDate: "2026-09-15",
    featured: true,
    description:
      "Contemporary 3-bedroom townhouse with a private courtyard, steps from Lillia's resort-style pool deck and the Town Centre retail strip.",
    features: ["Private courtyard", "Steps to pool deck", "Smart-home wiring", "Covered parking (2 cars)"],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "VLY-202",
    name: "Lillia Skyline Apartment",
    cluster: "lillia",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    size: 1240,
    price: 1350000,
    status: "Available",
    listedDate: "2026-09-22",
    featured: false,
    description:
      "A low-maintenance 2-bedroom apartment overlooking Lillia's courtyard gardens — a strong entry point into The Valley for first-time buyers or investors.",
    features: ["Courtyard-facing balcony", "Open-plan kitchen", "Built-in wardrobes", "1 covered parking bay"],
    images: [
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "VLY-203",
    name: "Lillia Grove Townhouse",
    cluster: "lillia",
    type: "Townhouse",
    bedrooms: 4,
    bathrooms: 4,
    size: 2340,
    price: 2980000,
    status: "Sold",
    listedDate: "2026-06-02",
    featured: false,
    description:
      "A 4-bedroom townhouse with dual-aspect living space, recently sold — shown here as a reference for recent achieved pricing in Lillia.",
    features: ["Dual-aspect living room", "Rooftop terrace", "Covered parking (2 cars)"],
    images: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "VLY-301",
    name: "Rosalind Family Villa",
    cluster: "rosalind",
    type: "Villa",
    bedrooms: 5,
    bathrooms: 6,
    size: 4120,
    price: 4750000,
    status: "Available",
    listedDate: "2026-09-10",
    featured: true,
    description:
      "A flagship 5-bedroom villa on an extra-wide Rosalind plot, with a private pool, driver's room, and direct pedestrian access to the Aqua Adventure water park.",
    features: ["Private pool", "Extra-wide plot", "Driver's room", "Walk to Aqua Adventure", "Covered parking (4 cars)"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "VLY-302",
    name: "Rosalind Meadow Villa",
    cluster: "rosalind",
    type: "Villa",
    bedrooms: 4,
    bathrooms: 5,
    size: 3450,
    price: 3950000,
    status: "Available",
    listedDate: "2026-08-28",
    featured: false,
    description:
      "4-bedroom villa backing onto green open space, with a private garden large enough for a pool addition and a flexible ground-floor room for a home office or gym.",
    features: ["Green-belt backing", "Pool-ready garden", "Flex room (office/gym)", "Covered parking (3 cars)"],
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "VLY-303",
    name: "Rosalind Terrace Villa",
    cluster: "rosalind",
    type: "Villa",
    bedrooms: 4,
    bathrooms: 4,
    size: 3050,
    price: 3600000,
    status: "Rent",
    listedDate: "2026-05-18",
    featured: false,
    description:
      "Available for rent — a 4-bedroom villa with a landscaped terrace garden, close to Rosalind's padel and tennis courts.",
    features: ["Landscaped terrace", "Near padel/tennis courts", "Covered parking (2 cars)"],
    images: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?q=80&w=1200&auto=format&fit=crop"
    ]
  }
];
