"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Currency, InvoiceColors, DEFAULT_COLORS, COLOR_LABELS, ZONE_COLORS, PRESET_THEMES } from "@/types";

interface SavedInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  total: number;
  currency: string;
  paid: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<SavedInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [colors, setColors] = useState<InvoiceColors>(DEFAULT_COLORS);
  const [unifyColors, setUnifyColors] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchInvoices();
      fetchProfile();
    }
  }, [status]);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      if (res.ok) {
        const data = await res.json();
        setInvoices(data);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/users/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.businessName) setBusinessName(data.businessName);
        if (data.businessEmail) setBusinessEmail(data.businessEmail);
        if (data.businessPhone) setBusinessPhone(data.businessPhone);
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

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, businessEmail, businessPhone, colors: JSON.stringify(colors) }),
      });
      if (res.ok) setSaved(true);
    } catch {} finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-900">Dashboard</h1>
          <Link
            href="/create"
            className="bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-800 transition-colors"
          >
            New Invoice
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Invoice History
            </h2>
            {loading ? (
              <p className="text-gray-600">Loading invoices...</p>
            ) : invoices.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-500 mb-4">No invoices yet</p>
                <Link
                  href="/create"
                  className="text-green-700 font-medium hover:underline"
                >
                  Create your first invoice
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Invoice #</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Client</th>
                      <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">Amount</th>
                      <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{inv.invoiceNumber}</td>
                        <td className="px-4 py-3 text-gray-700">{inv.clientName}</td>
                        <td className="px-4 py-3 text-right font-medium text-green-700">
                          {formatCurrency(inv.total, inv.currency as Currency)}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-500 text-sm">
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Business Profile
            </h2>
            <form onSubmit={saveProfile} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Phone
                </label>
                <input
                  type="text"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Default Invoice Colors</h3>
                <div className="grid grid-cols-4 gap-1.5 mb-3">
                  {PRESET_THEMES.map((theme) => {
                    const isActive = Object.keys(DEFAULT_COLORS).every(
                      (k) => colors[k as keyof InvoiceColors] === theme.colors[k as keyof InvoiceColors]
                    );
                    return (
                      <button key={theme.name} type="button"
                        onClick={() => { setColors({ ...theme.colors }); setUnifyColors(theme.colors.headerBg === theme.colors.bodyBg); }}
                        className={`p-1.5 rounded border-2 text-center ${isActive ? "border-green-600" : "border-gray-200 hover:border-gray-400"}`}
                        title={theme.name}>
                        <div className="flex gap-0.5 justify-center mb-0.5">
                          <span className="w-3 h-3 rounded" style={{ backgroundColor: theme.colors.mainText }} />
                          <span className="w-3 h-3 rounded" style={{ backgroundColor: theme.colors.subtleText }} />
                          <span className="w-3 h-3 rounded" style={{ backgroundColor: theme.colors.lines }} />
                          <span className="w-3 h-3 rounded" style={{ backgroundColor: theme.colors.headerBg, border: "1px solid #ddd" }} />
                        </div>
                        <span className="text-[9px] text-gray-600 block">{theme.name}</span>
                      </button>
                    );
                  })}
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-600 mb-2 cursor-pointer">
                  <input type="checkbox" checked={unifyColors} onChange={(e) => {
                    setUnifyColors(e.target.checked);
                    if (e.target.checked) setColors({ ...colors, bodyBg: colors.headerBg, footerBg: colors.headerBg });
                  }} className="rounded" />
                  Single color for entire page
                </label>
                <div className="flex gap-2 flex-wrap">
                  {(Object.keys(DEFAULT_COLORS) as (keyof InvoiceColors)[]).map((key) => {
                    if (unifyColors && ZONE_COLORS.includes(key) && key !== "headerBg") return null;
                    return (
                      <label key={key} className="flex items-center gap-1 cursor-pointer group">
                        <input type="color" value={colors[key]}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (unifyColors && ZONE_COLORS.includes(key)) {
                              setColors({ ...colors, headerBg: val, bodyBg: val, footerBg: val });
                            } else {
                              setColors({ ...colors, [key]: val });
                            }
                          }}
                          className="w-7 h-7 rounded border border-gray-300 cursor-pointer p-0.5 group-hover:ring-2 group-hover:ring-green-400 transition-shadow"
                          title={COLOR_LABELS[key]} />
                        <span className="text-[10px] text-gray-500">{COLOR_LABELS[key]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-green-700 text-white py-2 rounded-lg font-medium hover:bg-green-800 disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : saved ? "Saved ✓" : "Save Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
