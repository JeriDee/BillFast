export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  logoUrl: string;
  clientName: string;
  clientEmail: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: "NGN" | "USD" | "GBP";
  items: InvoiceItem[];
  taxPercent: number;
  discountPercent: number;
  notes: string;
  paymentTerms: string;
}

export interface InvoiceCalculations {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
}

export type Currency = "NGN" | "USD" | "GBP";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
};

export const CURRENCY_NAMES: Record<Currency, string> = {
  NGN: "Nigerian Naira (₦)",
  USD: "US Dollar ($)",
  GBP: "British Pound (£)",
};

export interface InvoiceColors {
  headerBg: string;
  bodyBg: string;
  footerBg: string;
  mainText: string;
  subtleText: string;
  lines: string;
}

export const DEFAULT_COLORS: InvoiceColors = {
  headerBg: "#ffffff",
  bodyBg: "#ffffff",
  footerBg: "#ffffff",
  mainText: "#111827",
  subtleText: "#6b7280",
  lines: "#006600",
};

export const COLOR_LABELS: Record<keyof InvoiceColors, string> = {
  headerBg: "Header Band",
  bodyBg: "Body Background",
  footerBg: "Footer Band",
  mainText: "Main (bold) Text",
  subtleText: "Subtle & Labels",
  lines: "Lines & Borders",
};

export const ZONE_COLORS: (keyof InvoiceColors)[] = ["headerBg", "bodyBg", "footerBg"];

export interface FontOption {
  value: string;
  label: string;
  jsFont: string;
  jsStyle: string;
}

export const THANK_YOU_FONTS: FontOption[] = [
  { value: "helvetica", label: "Helvetica (Default)", jsFont: "helvetica", jsStyle: "normal" },
  { value: "helvetica-bold", label: "Helvetica Bold", jsFont: "helvetica", jsStyle: "bold" },
  { value: "times", label: "Times (Serif)", jsFont: "times", jsStyle: "normal" },
  { value: "times-bold", label: "Times Bold", jsFont: "times", jsStyle: "bold" },
  { value: "courier", label: "Courier (Monospace)", jsFont: "courier", jsStyle: "normal" },
  { value: "courier-bold", label: "Courier Bold", jsFont: "courier", jsStyle: "bold" },
];

export interface InvoiceFooter {
  thankYouText: string;
  thankYouFont: string;
  thankYouColor: string;
  showContact: boolean;
  bankAccountName: string;
  bankName: string;
  accountNumber: string;
}

export const DEFAULT_FOOTER: InvoiceFooter = {
  thankYouText: "",
  thankYouFont: "helvetica",
  thankYouColor: "#111827",
  showContact: true,
  bankAccountName: "",
  bankName: "",
  accountNumber: "",
};

export interface ColorTheme {
  name: string;
  colors: InvoiceColors;
}

export const PRESET_THEMES: ColorTheme[] = [
  {
    name: "Classic Green",
    colors: { headerBg: "#ffffff", bodyBg: "#ffffff", footerBg: "#f0fdf0", mainText: "#111827", subtleText: "#6b7280", lines: "#006600" },
  },
  {
    name: "Midnight Blue",
    colors: { headerBg: "#f8fafc", bodyBg: "#ffffff", footerBg: "#1e3a5f", mainText: "#111827", subtleText: "#6b7280", lines: "#1e3a5f" },
  },
  {
    name: "Warm Earth",
    colors: { headerBg: "#fefcf5", bodyBg: "#fefcf5", footerBg: "#fefcf5", mainText: "#3d2b1f", subtleText: "#8b7355", lines: "#6b4423" },
  },
  {
    name: "Modern Slate",
    colors: { headerBg: "#f1f5f9", bodyBg: "#ffffff", footerBg: "#1e293b", mainText: "#1e293b", subtleText: "#64748b", lines: "#334155" },
  },
  {
    name: "Crimson",
    colors: { headerBg: "#fffafb", bodyBg: "#fffafb", footerBg: "#fffafb", mainText: "#1a1a2e", subtleText: "#6b7280", lines: "#b91c1c" },
  },
  {
    name: "Royal Purple",
    colors: { headerBg: "#faf5ff", bodyBg: "#ffffff", footerBg: "#5b21b6", mainText: "#1e1b4b", subtleText: "#7c3aed", lines: "#5b21b6" },
  },
  {
    name: "Ocean",
    colors: { headerBg: "#f0fdfa", bodyBg: "#ffffff", footerBg: "#0d9488", mainText: "#0f172a", subtleText: "#0891b2", lines: "#0d9488" },
  },
  {
    name: "Dark Mode",
    colors: { headerBg: "#1a1a2e", bodyBg: "#1a1a2e", footerBg: "#16213e", mainText: "#e2e8f0", subtleText: "#94a3b8", lines: "#475569" },
  },
];
