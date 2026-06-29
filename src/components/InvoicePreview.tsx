"use client";

import {
  InvoiceItem, InvoiceCalculations, Currency,
  InvoiceColors, InvoiceFooter, DEFAULT_COLORS, DEFAULT_FOOTER,
} from "@/types";
import { formatCurrency } from "@/lib/utils";

interface InvoicePreviewProps {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  logoUrl: string;
  clientName: string;
  clientEmail: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: Currency;
  items: InvoiceItem[];
  taxPercent: number;
  discountPercent: number;
  calc: InvoiceCalculations;
  notes: string;
  paymentTerms: string;
  colors?: InvoiceColors;
  footer?: InvoiceFooter;
}

export default function InvoicePreview(props: InvoicePreviewProps) {
  const {
    businessName, businessEmail, businessPhone, logoUrl,
    clientName, clientEmail,
    invoiceNumber, invoiceDate, dueDate,
    currency, items, taxPercent, discountPercent, calc,
    notes, paymentTerms,
    colors = DEFAULT_COLORS,
    footer = DEFAULT_FOOTER,
  } = props;

  return (
    <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
      <div id="invoice-preview" className="relative" style={{ minHeight: 500 }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20">
          <span className="text-gray-200/60 text-5xl font-bold uppercase tracking-[0.2em] rotate-[-30deg]">
            Pay to unlock
          </span>
        </div>

        <div className="relative z-10 flex flex-col min-h-[500px]">
          {/* HEADER BAND */}
          <div className="px-8 py-6" style={{ backgroundColor: colors.headerBg }}>
            <div className="flex justify-between items-start">
              <div>
                {logoUrl && (
                  <img src={logoUrl} alt="Logo" className="h-16 w-auto object-contain mb-2" />
                )}
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold" style={{ color: colors.mainText }}>
                  {businessName || "Your Business Name"}
                </h2>
                <p className="text-sm" style={{ color: colors.subtleText }}>{businessEmail}</p>
                <p className="text-sm" style={{ color: colors.subtleText }}>{businessPhone}</p>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="flex-1 px-8 py-6" style={{ backgroundColor: colors.bodyBg }}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: colors.subtleText }}>
                  Invoice To
                </h3>
                <p className="font-medium" style={{ color: colors.mainText }}>{clientName || "Client Name"}</p>
                <p className="text-sm" style={{ color: colors.subtleText }}>{clientEmail}</p>
              </div>
              <div className="text-right space-y-1">
                {[
                  ["Invoice #:", invoiceNumber],
                  ["Date:", invoiceDate || "—"],
                  ["Due Date:", dueDate || "—"],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex gap-4 text-sm">
                    <span style={{ color: colors.subtleText }}>{label as string}</span>
                    <span className="font-medium" style={{ color: colors.mainText }}>{val as string}</span>
                  </div>
                ))}
              </div>
            </div>

            <table className="w-full mb-6">
              <thead>
                <tr style={{ borderBottom: `2px solid ${colors.lines}` }}>
                  {["Description", "Qty", "Unit Price", "Amount"].map((h) => (
                    <th key={h} className={`text-${h === "Description" ? "left" : "right"} py-3 text-sm font-semibold uppercase`} style={{ color: colors.subtleText }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b" style={{ borderColor: "#e5e7eb" }}>
                    <td className="py-3" style={{ color: colors.mainText }}>{item.description || "—"}</td>
                    <td className="py-3 text-right" style={{ color: colors.mainText }}>{item.quantity}</td>
                    <td className="py-3 text-right" style={{ color: colors.mainText }}>{formatCurrency(item.unitPrice, currency)}</td>
                    <td className="py-3 text-right font-medium" style={{ color: colors.mainText }}>{formatCurrency(item.quantity * item.unitPrice, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mb-6">
              <div className="w-64 space-y-2">
                <TotalRow label="Subtotal" value={formatCurrency(calc.subtotal, currency)} colors={colors} />
                {taxPercent > 0 && <TotalRow label={`Tax (${taxPercent}%)`} value={formatCurrency(calc.taxAmount, currency)} colors={colors} />}
                {discountPercent > 0 && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.subtleText }}>Discount ({discountPercent}%)</span>
                    <span className="font-medium text-red-600">-{formatCurrency(calc.discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2" style={{ borderTop: `2px solid ${colors.lines}` }}>
                  <span className="font-bold" style={{ color: colors.mainText }}>Total</span>
                  <span className="font-bold text-lg" style={{ color: colors.subtleText }}>{formatCurrency(calc.total, currency)}</span>
                </div>
              </div>
            </div>

            {(notes || paymentTerms) && (
              <div className="border-t pt-4 space-y-3" style={{ borderColor: "#e5e7eb" }}>
                {notes && (
                  <div>
                    <h4 className="text-sm font-semibold uppercase mb-1" style={{ color: colors.subtleText }}>Notes</h4>
                    <p className="text-sm" style={{ color: colors.mainText }}>{notes}</p>
                  </div>
                )}
                {paymentTerms && (
                  <div>
                    <h4 className="text-sm font-semibold uppercase mb-1" style={{ color: colors.subtleText }}>Payment Terms</h4>
                    <p className="text-sm" style={{ color: colors.mainText }}>{paymentTerms}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FOOTER BAND */}
          <div className="px-8 py-5" style={{ backgroundColor: colors.footerBg }}>
            {footer.thankYouText && (
              <p
                className="text-lg mb-3 text-center"
                style={{
                  fontFamily: footer.thankYouFont,
                  color: footer.thankYouColor,
                }}
              >
                {footer.thankYouText}
              </p>
            )}
            <div className="flex flex-wrap gap-x-8 gap-y-1 text-xs" style={{ color: colors.subtleText }}>
              {footer.showContact && (
                <>
                  <span>{businessEmail}</span>
                  <span>{businessPhone}</span>
                </>
              )}
              {footer.bankAccountName && (
                <span>A/C Name: {footer.bankAccountName}</span>
              )}
              {footer.bankName && (
                <span>Bank: {footer.bankName}</span>
              )}
              {footer.accountNumber && (
                <span>A/C No: {footer.accountNumber}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TotalRow({ label, value, colors }: { label: string; value: string; colors: InvoiceColors }) {
  return (
    <div className="flex justify-between text-sm">
      <span style={{ color: colors.subtleText }}>{label}</span>
      <span className="font-medium" style={{ color: colors.mainText }}>{value}</span>
    </div>
  );
}
