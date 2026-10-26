export interface Listing {
  id: string;
  name: string;
  category: string;
  condition: "New" | "Like New" | "Used" | "Parts Only";
  price: number;
  year: number;
  location: string;
  description: string;
  horsepower?: number;
  hours?: number;
  image: string;
}

export const listings: readonly Listing[] = [
  {
    id: "1",
    name: "Caterpillar 320 Excavator",
    category: "Excavators",
    condition: "Used",
    price: 148000,
    year: 2019,
    location: "Chicago, IL",
    description: "Well-maintained hydraulic excavator with GPS grade control. Full service history available.",
    horsepower: 148,
    hours: 4200,
    image: "excavator",
  },
  {
    id: "2",
    name: "John Deere 8R 410 Tractor",
    category: "Agricultural",
    condition: "Like New",
    price: 310000,
    year: 2022,
    location: "Indianapolis, IN",
    description: "Precision Ag technology equipped. AutoTrac ready with Starfire 6000 receiver.",
    horsepower: 410,
    hours: 820,
    image: "tractor",
  },
  {
    id: "3",
    name: "Liebherr LTM 1100 Crane",
    category: "Cranes",
    condition: "Used",
    price: 975000,
    year: 2018,
    location: "Detroit, MI",
    description: "All-terrain mobile crane, 100-ton capacity. Boom extension included. Export ready.",
    horsepower: 530,
    hours: 6100,
    image: "crane",
  },
  {
    id: "4",
    name: "Komatsu D65PX-18 Dozer",
    category: "Dozers",
    condition: "Used",
    price: 215000,
    year: 2020,
    location: "St. Louis, MO",
    description: "Low ground pressure dozer with intelligent Machine Control. Blade wear minimal.",
    horsepower: 201,
    hours: 3300,
    image: "dozer",
  },
  {
    id: "5",
    name: "Manitou MRT 2550+",
    category: "Telehandlers",
    condition: "Like New",
    price: 89000,
    year: 2023,
    location: "Milwaukee, WI",
    description: "Rotating telehandler, 25m reach, 5t capacity. All attachments included.",
    horsepower: 175,
    hours: 210,
    image: "telehandler",
  },
  {
    id: "6",
    name: "Volvo EC380E Excavator",
    category: "Excavators",
    condition: "Used",
    price: 186000,
    year: 2021,
    location: "Columbus, OH",
    description: "38-ton hydraulic excavator. Volvo Care Cab, hammer hydraulics pre-installed.",
    horsepower: 296,
    hours: 2900,
    image: "excavator",
  },
  {
    id: "7",
    name: "CASE IH Axial-Flow 9250",
    category: "Agricultural",
    condition: "Used",
    price: 425000,
    year: 2020,
    location: "Peoria, IL",
    description: "High-capacity combine. AFS Connect telematics, 40ft draper header included.",
    horsepower: 473,
    hours: 1950,
    image: "tractor",
  },
  {
    id: "8",
    name: "Atlas Copco XAS 1800",
    category: "Compressors",
    condition: "New",
    price: 62000,
    year: 2024,
    location: "Chicago, IL",
    description: "Portable diesel air compressor, 1800 CFM. Stage V emissions compliant.",
    horsepower: 430,
    image: "compressor",
  },
  {
    id: "9",
    name: "Hamm HD+ 140i VV Roller",
    category: "Compaction",
    condition: "Like New",
    price: 118000,
    year: 2022,
    location: "Kansas City, MO",
    description: "Tandem vibratory roller with oscillation. Compaction documentation system.",
    horsepower: 116,
    hours: 430,
    image: "roller",
  },
];


export const CATEGORIES = ["All", "Excavators", "Agricultural", "Cranes", "Dozers", "Telehandlers", "Compressors", "Compaction"] as const;
export const CONDITIONS = ["All", "New", "Like New", "Used", "Parts Only"] as const;

export class InvalidFilter extends Error {}

export function filterListings(params: URLSearchParams) {
  const allowed = ["search", "category", "condition", "maxPrice"];
  for (const key of params.keys()) {
    if (!allowed.includes(key) || params.getAll(key).length > 1) {
      throw new InvalidFilter("Unknown or repeated query parameter");
    }
  }
  const search = (params.get("search") ?? "").trim().toLowerCase();
  const category = params.get("category") ?? "All";
  const condition = params.get("condition") ?? "All";
  if (search.length > 100) throw new InvalidFilter("Search must be at most 100 characters");
  if (!(CATEGORIES as readonly string[]).includes(category)) throw new InvalidFilter("Unknown category");
  if (!(CONDITIONS as readonly string[]).includes(condition)) throw new InvalidFilter("Unknown condition");
  const rawPrice = params.get("maxPrice");
  let maxPrice = Number.MAX_SAFE_INTEGER;
  if (rawPrice !== null) {
    if (!/^\d+$/.test(rawPrice) || !Number.isSafeInteger(Number(rawPrice))) {
      throw new InvalidFilter("maxPrice must be a non-negative safe integer in USD");
    }
    maxPrice = Number(rawPrice);
  }
  const results = listings.filter(l =>
    (category === "All" || l.category === category) &&
    (condition === "All" || l.condition === condition) &&
    l.price <= maxPrice &&
    (!search || [l.name, l.description, l.location].some(value => value.toLowerCase().includes(search)))
  );
  return { listings: results, total: results.length };
}
