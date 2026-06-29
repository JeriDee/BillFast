import { Currency, CURRENCY_SYMBOLS, InvoiceItem, InvoiceCalculations } from "@/types";

export function formatCurrency(amount: number, currency: Currency): string {
  return `${CURRENCY_SYMBOLS[currency]}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function calculateInvoice(
  items: InvoiceItem[],
  taxPercent: number,
  discountPercent: number,
  currency: Currency
): InvoiceCalculations {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = taxPercent > 0 ? subtotal * (taxPercent / 100) : 0;
  const discountAmount = discountPercent > 0 ? subtotal * (discountPercent / 100) : 0;
  const total = subtotal + taxAmount - discountAmount;

  return { subtotal, taxAmount, discountAmount, total };
}

export function generateInvoiceNumber(): string {
  const prefix = "INV";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}
