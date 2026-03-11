const REGION_KEYWORDS = {
  north: [
    "woodlands",
    "yishun",
    "sembawang",
    "admiralty",
    "canberra",
    "marsiling",
    "mandai",
    "sungei kadut",
  ],
  "north-east": [
    "punggol",
    "sengkang",
    "anchorvale",
    "fernvale",
    "hougang",
    "serangoon",
    "buangkok",
    "kovan",
    "seletar",
    "ang mo kio",
  ],
  east: [
    "bedok",
    "tampines",
    "pasir ris",
    "changi",
    "simei",
    "kembangan",
    "siglap",
  ],
  west: [
    "jurong",
    "boon lay",
    "clementi",
    "bukit batok",
    "choa chu kang",
    "bukit panjang",
    "teban",
    "yew tee",
    "west coast",
    "tuas",
    "pioneer",
    "senja",
  ],
  central: [
    "marine parade",
    "eunos",
    "bukit merah",
    "queenstown",
    "toa payoh",
    "novena",
    "bishan",
    "bukit timah",
    "tanglin",
    "kallang",
    "geylang",
    "whampoa",
    "newton",
    "holland",
    "redhill",
    "chinatown",
    "outram",
    "telok blangah",
    "pasir panjang",
    "tiong bahru",
  ],
};

function detectRegionByKeyword(name = "", address = "") {
  const text = `${name} ${address}`.toLowerCase();

  for (const [region, keywords] of Object.entries(REGION_KEYWORDS)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return region;
    }
  }

  return null;
}

function detectRegionByCoordinates(lat, lng) {
  // Fallback zones tuned against URA planning map orientation.
  if (lng <= 103.8 || (lng <= 103.83 && lat >= 1.34)) {
    return "west";
  }

  if (lng >= 103.9 && lat < 1.39) {
    return "east";
  }

  if (lat >= 1.395 && lng < 103.88) {
    return "north";
  }

  if (lng >= 103.855 && lat >= 1.35) {
    return "north-east";
  }

  return "central";
}

export function getRegion({ lat, lng, name, address }) {
  const keywordRegion = detectRegionByKeyword(name, address);
  if (keywordRegion) {
    return keywordRegion;
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return "unknown";
  }

  return detectRegionByCoordinates(lat, lng);
}
