"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  InvoiceItem, Currency, CURRENCY_NAMES,
  InvoiceColors, DEFAULT_COLORS, COLOR_LABELS, ZONE_COLORS,
  InvoiceFooter, DEFAULT_FOOTER, THANK_YOU_FONTS, FontOption,
  PRESET_THEMES,
} from "@/types";
import { calculateInvoice, generateInvoiceNumber, getTodayDate, formatCurrency } from "@/lib/utils";
import InvoicePreview from "@/components/InvoicePreview";

declare global {
  interface Window {
    PaystackPop: new () => PaystackPopInstance;
  }
  interface PaystackPopInstance {
    checkout(options: PaystackCheckoutOptions): Promise<void>;
    newTransaction(options: PaystackCheckoutOptions): void;
  }
  interface PaystackCheckoutOptions {
    key: string;
    email: string;
    amount: number;
    currency: string;
    reference?: string;
    onSuccess?: (transaction: { reference: string }) => void;
    onLoad?: (response: Record<string, unknown>) => void;
    onCancel?: () => void;
    onError?: (error: Error) => void;
  }
}

function loadPaystackCDN(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof PaystackPop !== "undefined") { resolve(); return; }
    const urls = [
      "https://js.paystack.co/v2/inline.js",
      "https://js.paystack.com/v2/inline.js",
    ];
    let i = 0;
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; reject(new Error("Timed out")); }, 15000);
    const tryNext = () => {
      if (timedOut) return;
      if (i >= urls.length) { clearTimeout(timer); reject(new Error("Failed to load Paystack")); return; }
      const s = document.createElement("script");
      s.src = urls[i++];
      s.onload = () => {
        const poll = (n: number) => {
          if (typeof PaystackPop !== "undefined") { clearTimeout(timer); resolve(); return; }
          if (n <= 0) { clearTimeout(timer); reject(new Error("Paystack not ready")); return; }
          setTimeout(() => poll(n - 1), 200);
        };
        poll(10);
      };
      s.onerror = () => { s.remove(); setTimeout(tryNext, 500); };
      document.head.appendChild(s);
    };
    tryNext();
  });
}

export default function CreateInvoicePage() {
  const { data: session } = useSession();

  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(getTodayDate());
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [taxPercent, setTaxPercent] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [notes, setNotes] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");

  const [colors, setColors] = useState<InvoiceColors>(DEFAULT_COLORS);
  const [unifyColors, setUnifyColors] = useState(true);
  const [footer, setFooter] = useState<InvoiceFooter>(DEFAULT_FOOTER);

  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [showThankYouMsg, setShowThankYouMsg] = useState(false);

  useEffect(() => {
    setInvoiceNumber(generateInvoiceNumber());
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchBusinessProfile((session.user as { id: string }).id);
    }
  }, [session]);

  const fetchBusinessProfile = async (userId: string) => {
    try {
      const res = await fetch("/api/users/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.businessName) setBusinessName(data.businessName);
        if (data.businessEmail) setBusinessEmail(data.businessEmail);
        if (data.businessPhone) setBusinessPhone(data.businessPhone);
        if (data.logoUrl) setLogoUrl(data.logoUrl);
        if (data.footer) {
          try { setFooter({ ...DEFAULT_FOOTER, ...JSON.parse(data.footer) }); } catch {}
        }
        if (data.colors) {
          try {
            const parsed = JSON.parse(data.colors);
            setColors({ ...DEFAULT_COLORS, ...parsed });
            if (parsed.headerBg && parsed.bodyBg && parsed.headerBg !== parsed.bodyBg) setUnifyColors(false);
          } catch {}
        }
      }
    } catch {}
  };

  const addItem = () => {
    setItems([...items, { id: (items.length + 1).toString(), description: "", quantity: 1, unitPrice: 0 }]);
  };
  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter((i) => i.id !== id));
  };
  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const calc = calculateInvoice(items, taxPercent, discountPercent, currency);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (key: keyof InvoiceColors, value: string) => {
    if (unifyColors && ZONE_COLORS.includes(key)) {
      setColors({ ...colors, headerBg: value, bodyBg: value, footerBg: value });
    } else {
      setColors({ ...colors, [key]: value });
    }
  };

  const setTheme = (theme: typeof PRESET_THEMES[number]) => {
    setColors({ ...theme.colors });
  };

  const saveInvoice = useCallback(async (paymentRef: string) => {
    try {
      await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber, businessName, businessEmail, businessPhone, logoUrl,
          clientName, clientEmail, invoiceDate, dueDate, currency, items,
          taxPercent, discountPercent,
          subtotal: calc.subtotal, taxAmount: calc.taxAmount, discountAmount: calc.discountAmount, total: calc.total,
          notes, paymentTerms,
          colors: JSON.stringify(colors),
          footer: JSON.stringify(footer),
          paymentRef,
        }),
      });
    } catch {}
  }, [invoiceNumber, businessName, businessEmail, businessPhone, logoUrl,
      clientName, clientEmail, invoiceDate, dueDate, currency, items,
      taxPercent, discountPercent, calc, notes, paymentTerms, colors, footer]);

  function hexToRgb(hex: string): [number, number, number] {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r
      ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)]
      : [0, 0, 0];
  }

  const generatePDF = useCallback(async () => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF("p", "mm", "a4");
    const pw = 210;
    const ph = 297;
    let y = 20;
    const cMain = hexToRgb(colors.mainText);
    const cSubtle = hexToRgb(colors.subtleText);
    const cLines = hexToRgb(colors.lines);

    const footerFont = THANK_YOU_FONTS.find((f) => f.value === footer.thankYouFont);
    const cThankYou = hexToRgb(footer.thankYouColor);

    // -- page fill --
    doc.setFillColor(...hexToRgb(colors.bodyBg));
    doc.rect(0, 0, pw, ph, "F");

    // -- header band --
    doc.setFillColor(...hexToRgb(colors.headerBg));
    doc.rect(0, 0, pw, 50, "F");

    if (logoUrl) {
      try { doc.addImage(logoUrl, "JPEG", 15, y, 30, 30); }
      catch { try { doc.addImage(logoUrl, "PNG", 15, y, 30, 30); } catch {} }
    }

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(cMain[0], cMain[1], cMain[2]);
    doc.text(businessName || "Your Business Name", pw - 15, y + 10, { align: "right" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(cSubtle[0], cSubtle[1], cSubtle[2]);
    doc.text(businessEmail || "", pw - 15, y + 18, { align: "right" });
    doc.text(businessPhone || "", pw - 15, y + 24, { align: "right" });

    y = logoUrl ? 60 : 45;
    doc.setDrawColor(cLines[0], cLines[1], cLines[2]);
    doc.setLineWidth(0.5);
    doc.line(15, y, pw - 15, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(cSubtle[0], cSubtle[1], cSubtle[2]);
    doc.text("INVOICE TO", 15, y + 4);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(cMain[0], cMain[1], cMain[2]);
    doc.setFontSize(11);
    doc.text(clientName || "Client Name", 15, y + 12);
    doc.text(clientEmail || "", 15, y + 19);

    [
      { label: "Invoice #:", value: invoiceNumber },
      { label: "Date:", value: invoiceDate || "—" },
      { label: "Due Date:", value: dueDate || "—" },
    ].forEach((item, i) => {
      doc.setTextColor(cSubtle[0], cSubtle[1], cSubtle[2]);
      doc.text(item.label, pw - 65, y + 4 + i * 7);
      doc.setTextColor(cMain[0], cMain[1], cMain[2]);
      doc.text(item.value, pw - 15, y + 4 + i * 7, { align: "right" });
    });

    y += 30;
    doc.setDrawColor(cLines[0], cLines[1], cLines[2]);
    doc.line(15, y, pw - 15, y);
    y += 5;

    const colX = [15, 95, 130, 150, 180];
    const headers = ["Description", "Qty", "Unit Price", "Amount"];
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(cSubtle[0], cSubtle[1], cSubtle[2]);
    headers.forEach((h, i) => doc.text(h, colX[i], y + 4));

    y += 10;
    doc.setDrawColor(cLines[0], cLines[1], cLines[2]);
    doc.line(15, y, pw - 15, y);
    y += 3;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(cMain[0], cMain[1], cMain[2]);

    items.forEach((item) => {
      if (y > 230) { doc.addPage(); y = 20; }
      doc.text(item.description || "—", colX[0], y + 4);
      doc.text(item.quantity.toString(), pw - 45, y + 4, { align: "right" });
      doc.text(formatCurrency(item.unitPrice, currency), pw - 30, y + 4, { align: "right" });
      doc.text(formatCurrency(item.quantity * item.unitPrice, currency), pw - 15, y + 4, { align: "right" });
      y += 8;
    });

    y += 3;
    doc.setDrawColor(220, 220, 220);
    doc.line(15, y, pw - 15, y);
    y += 5;

    const totals: { label: string; value: string; bold: boolean }[] = [
      { label: "Subtotal", value: formatCurrency(calc.subtotal, currency), bold: false },
    ];
    if (taxPercent > 0) totals.push({ label: `Tax (${taxPercent}%)`, value: formatCurrency(calc.taxAmount, currency), bold: false });
    if (discountPercent > 0) totals.push({ label: `Discount (${discountPercent}%)`, value: `-${formatCurrency(calc.discountAmount, currency)}`, bold: false });
    totals.push({ label: "Total", value: formatCurrency(calc.total, currency), bold: true });

    totals.forEach((t) => {
      if (t.bold) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(cSubtle[0], cSubtle[1], cSubtle[2]);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(cMain[0], cMain[1], cMain[2]);
      }
      doc.text(t.label, pw - 75, y + 4);
      doc.text(t.value, pw - 15, y + 4, { align: "right" });
      y += 7;
    });

    if (notes || paymentTerms) {
      y += 6;
      doc.setDrawColor(cLines[0], cLines[1], cLines[2]);
      doc.line(15, y, pw - 15, y);
      y += 5;
      if (notes) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(cSubtle[0], cSubtle[1], cSubtle[2]);
        doc.text("NOTES", 15, y + 3);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(cSubtle[0], cSubtle[1], cSubtle[2]);
        const l = doc.splitTextToSize(notes, pw - 30);
        doc.text(l, 15, y + 9);
        y += 10 + l.length * 4;
      }
      if (paymentTerms) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(cSubtle[0], cSubtle[1], cSubtle[2]);
        doc.text("PAYMENT TERMS", 15, y + 3);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(cSubtle[0], cSubtle[1], cSubtle[2]);
        const l = doc.splitTextToSize(paymentTerms, pw - 30);
        doc.text(l, 15, y + 9);
      }
    }

    // -- footer band --
    y = 260;
    doc.setFillColor(...hexToRgb(colors.footerBg));
    doc.rect(0, y, pw, ph - y, "F");

    y += 8;
    if (footer.thankYouText) {
      doc.setFont(footerFont?.jsFont || "helvetica", footerFont?.jsStyle || "normal");
      doc.setFontSize(14);
      doc.setTextColor(cThankYou[0], cThankYou[1], cThankYou[2]);
      doc.text(footer.thankYouText, pw / 2, y, { align: "center" });
      y += 8;
    }

    const footerItems: string[] = [];
    if (footer.showContact) {
      if (businessEmail) footerItems.push(businessEmail);
      if (businessPhone) footerItems.push(businessPhone);
    }
    if (footer.bankAccountName) footerItems.push(`A/C Name: ${footer.bankAccountName}`);
    if (footer.bankName) footerItems.push(`Bank: ${footer.bankName}`);
    if (footer.accountNumber) footerItems.push(`A/C No: ${footer.accountNumber}`);

    if (footerItems.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(cSubtle[0], cSubtle[1], cSubtle[2]);
      const line = footerItems.join("  |  ");
      doc.text(line, pw / 2, y + 4, { align: "center" });
    }

    doc.save(`Invoice-${invoiceNumber}.pdf`);
  }, [
    businessName, businessEmail, businessPhone, logoUrl,
    clientName, clientEmail, invoiceNumber, invoiceDate, dueDate,
    currency, items, taxPercent, discountPercent, calc,
    notes, paymentTerms, colors, footer,
  ]);

  const handlePayment = useCallback(async () => {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      alert("Payment not configured. Set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in .env.local");
      return;
    }
    setLoading(true);
    try {
      const ref = `BF-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const doCheckout = (popup: PaystackPopInstance) => {
        popup.checkout({
          key: publicKey,
          email: businessEmail || clientEmail || "customer@billfast.ng",
          amount: 30000,
          currency: "NGN",
          reference: ref,
          onSuccess: async (transaction) => {
            setPaid(true);
            setShowThankYouMsg(true);
            if (session?.user) await saveInvoice(transaction.reference);
            setLoading(false);
            setTimeout(async () => { await generatePDF(); }, 500);
          },
          onCancel: () => { setLoading(false); },
        });
      };
      const mod = await import("@paystack/inline-js");
      const PaystackPopClass = mod.default || mod;
      doCheckout(new PaystackPopClass());
    } catch {
      try {
        await loadPaystackCDN();
        const ref = `BF-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const popup = new window.PaystackPop();
        popup.checkout({
          key: publicKey!,
          email: businessEmail || clientEmail || "customer@billfast.ng",
          amount: 30000,
          currency: "NGN",
          reference: ref,
          onSuccess: async (transaction) => {
            setPaid(true);
            setShowThankYouMsg(true);
            if (session?.user) await saveInvoice(transaction.reference);
            setLoading(false);
            setTimeout(async () => { await generatePDF(); }, 500);
          },
          onCancel: () => { setLoading(false); },
        });
      } catch {
        alert("Payment system failed to load. Please try again.");
        setLoading(false);
      }
    }
  }, [businessEmail, clientEmail, session, saveInvoice, generatePDF]);

  const updateFooter = (k: keyof InvoiceFooter, v: string | boolean) => {
    setFooter({ ...footer, [k]: v });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-900 mb-8">Create New Invoice</h1>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* FORM */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            {/* Business Details */}
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Business Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Your Business Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                <input type="email" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="business@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
                <input type="text" value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="+234 800 000 0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo (optional)</label>
                <input type="file" accept="image/*" onChange={handleLogoUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
              </div>
            </div>

            {/* Client Details */}
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Client Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Client Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
                <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="client@example.com" />
              </div>
            </div>

            {/* Invoice Info */}
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Invoice Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice #</label>
                <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                  {Object.entries(CURRENCY_NAMES).map(([k, n]) => <option key={k} value={k}>{n}</option>)}
                </select>
              </div>
            </div>

            {/* Line Items */}
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Line Items</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <input type="text" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Item description" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Qty</label>
                    <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Unit Price</label>
                    <input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    <span className="text-sm text-gray-600 py-2">{formatCurrency(item.quantity * item.unitPrice, currency)}</span>
                    {items.length > 1 && <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 p-1" title="Remove">✕</button>}
                  </div>
                </div>
              ))}
              <button onClick={addItem} className="text-green-700 text-sm font-medium hover:text-green-800">+ Add Item</button>
            </div>

            {/* Taxes & Discounts */}
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Taxes &amp; Discounts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax (%)</label>
                <input type="number" min="0" max="100" step="0.1" value={taxPercent} onChange={(e) => setTaxPercent(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                <input type="number" min="0" max="100" step="0.1" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
              </div>
            </div>

            {/* Invoice Colors */}
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Invoice Colors</h2>
            <div className="space-y-3">
              <p className="text-xs text-gray-500">Pick a theme or customize below</p>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_THEMES.map((theme) => {
                  const isActive = Object.keys(DEFAULT_COLORS).every(
                    (k) => colors[k as keyof InvoiceColors] === theme.colors[k as keyof InvoiceColors]
                  );
                  return (
                    <button key={theme.name} type="button" onClick={() => setTheme(theme)}
                      className={`p-2 rounded-lg border-2 text-center transition-all ${isActive ? "border-green-600" : "border-gray-200 hover:border-gray-400"}`} title={theme.name}>
                      <div className="flex gap-0.5 justify-center mb-1">
                        <span className="w-4 h-4 rounded" style={{ backgroundColor: theme.colors.mainText }} />
                        <span className="w-4 h-4 rounded" style={{ backgroundColor: theme.colors.subtleText }} />
                        <span className="w-4 h-4 rounded" style={{ backgroundColor: theme.colors.lines }} />
                        <span className="w-4 h-4 rounded" style={{ backgroundColor: theme.colors.headerBg, border: "1px solid #ddd" }} />
                      </div>
                      <span className="text-[10px] text-gray-600 leading-tight block">{theme.name}</span>
                    </button>
                  );
                })}
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={unifyColors} onChange={(e) => {
                  setUnifyColors(e.target.checked);
                  if (e.target.checked) {
                    setColors({ ...colors, bodyBg: colors.headerBg, footerBg: colors.headerBg });
                  }
                }} className="rounded" />
                Single color for entire page
              </label>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {(Object.keys(DEFAULT_COLORS) as (keyof InvoiceColors)[]).map((key) => {
                  const isZone = ZONE_COLORS.includes(key);
                  if (unifyColors && isZone && key !== "headerBg") return null;
                  return (
                    <label key={key} className="flex items-center gap-1 cursor-pointer group">
                      <input type="color" value={colors[key]}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5 group-hover:ring-2 group-hover:ring-green-400 transition-shadow"
                        title={COLOR_LABELS[key]} />
                      <span className="text-[11px] text-gray-500">{COLOR_LABELS[key]}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Footer Section */}
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Invoice Footer</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thank You Text (optional)</label>
                <input type="text" value={footer.thankYouText} onChange={(e) => updateFooter("thankYouText", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="e.g. Thank you for your business" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font Style</label>
                  <select value={footer.thankYouFont} onChange={(e) => updateFooter("thankYouFont", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                    {THANK_YOU_FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={footer.thankYouColor} onChange={(e) => updateFooter("thankYouColor", e.target.value)}
                      className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0.5" />
                    <span className="text-xs text-gray-500">{footer.thankYouColor}</span>
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={footer.showContact} onChange={(e) => updateFooter("showContact", e.target.checked)} className="rounded" />
                Show business contact in footer
              </label>
              <div className="border-t pt-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Bank Details (optional)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Account Name</label>
                    <input type="text" value={footer.bankAccountName} onChange={(e) => updateFooter("bankAccountName", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Business name" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Bank Name</label>
                    <input type="text" value={footer.bankName} onChange={(e) => updateFooter("bankName", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="e.g. GTBank" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Account Number</label>
                    <input type="text" value={footer.accountNumber} onChange={(e) => updateFooter("accountNumber", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="0123456789" />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes & Terms */}
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Notes &amp; Terms</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Additional notes..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                <textarea value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Payment terms..." />
              </div>
            </div>
          </div>

          {/* PREVIEW */}
          <div className="space-y-6">
            <InvoicePreview
              businessName={businessName} businessEmail={businessEmail} businessPhone={businessPhone} logoUrl={logoUrl}
              clientName={clientName} clientEmail={clientEmail}
              invoiceNumber={invoiceNumber} invoiceDate={invoiceDate} dueDate={dueDate}
              currency={currency} items={items} taxPercent={taxPercent} discountPercent={discountPercent}
              calc={calc} notes={notes} paymentTerms={paymentTerms}
              colors={colors} footer={footer}
            />

            {paid ? (
              <div className="space-y-4">
                <button onClick={generatePDF}
                  className="w-full bg-green-700 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-lg font-semibold text-sm md:text-lg hover:bg-green-800 transition-colors">Download PDF Again</button>
                {showThankYouMsg && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <h3 className="text-xl font-bold text-green-800 mb-2">Thank You!</h3>
                    <p className="text-green-700">Your invoice has been created and downloaded successfully.</p>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={handlePayment} disabled={loading}
                className="w-full bg-green-700 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-lg font-semibold text-sm md:text-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {loading ? "Processing..." : "Download Invoice — ₦300"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
