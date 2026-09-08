// Shared between the customer-facing Custom order builder and the admin
// Custom Orders grid, so a color name always maps to the same swatch.
export const COLOR_OPTIONS = [
  { name: "Black", hex: "#1a1a1a", light: false },
  { name: "White", hex: "#ffffff", light: true },
  { name: "Navy", hex: "#1f2a44", light: false },
  { name: "Maroon", hex: "#6b1e2b", light: false },
  { name: "Olive", hex: "#4b5320", light: false },
  { name: "Beige", hex: "#d8c3a5", light: true },
];

export const COLOR_HEX_BY_NAME = Object.fromEntries(COLOR_OPTIONS.map((c) => [c.name, c.hex]));
