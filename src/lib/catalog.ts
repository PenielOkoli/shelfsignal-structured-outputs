export const products = [
  { id: 'mug', name: 'Everyday ceramic mug', category: 'Kitchen & living', price: 6500, stock: 24, color: 'peach' },
  { id: 'tote', name: 'Market day tote', category: 'Everyday essentials', price: 4200, stock: 38, color: 'sage' },
  { id: 'notebook', name: 'Room for ideas', category: 'Paper & stationery', price: 3500, stock: 12, color: 'lilac' },
] as const;
export type ProductId = typeof products[number]['id'];
export const productById = (id: ProductId) => products.find(product => product.id === id)!;
export const presets = [
  { name: 'The weekend edit', brief: 'Create a welcoming weekend display for a small lifestyle shop. Highlight thoughtful gifts under ₦10,000, use the current catalog, and suggest practical steps without inventing sales data.' },
  { name: 'Back to your routine', brief: 'Help customers prepare for a new work week. Use our mugs, notebooks, and totes to build a useful everyday-essentials display. Keep suggestions simple and avoid sales guarantees.' },
  { name: 'Small gifts, big thought', brief: 'Plan an affordable gifting display using our existing catalog. Emphasize small thoughtful gifts and pairing ideas. Do not invent discounts, stock levels, or demand metrics.' },
];
export function formatPrice(value: number, locale: 'en-NG' | 'en-GB' = 'en-NG') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);
}
