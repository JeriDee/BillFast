import Link from "next/link";
import { BiReceipt, BiDollar, BiDownload, BiUserPlus, BiCheck } from "react-icons/bi";

const meshSvg = encodeURIComponent(`
<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    </pattern>
    <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.06)"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect width="100%" height="100%" fill="url(#dots)"/>
</svg>`);

const features = [
  {
    icon: BiUserPlus,
    title: "No Signup Required",
    desc: "Create an invoice right away as a guest. No account needed.",
  },
  {
    icon: BiDollar,
    title: "₦300 Per Invoice",
    desc: "One low fee. No subscriptions, no hidden charges. Pay via Paystack.",
  },
  {
    icon: BiDownload,
    title: "Download Instantly",
    desc: "Your professional PDF invoice downloads immediately after payment.",
  },
];

const checklist = [
  "Your business logo and details",
  "Professional itemized table",
  "Automatic tax & discount calculations",
  "Multiple currency support: ₦, $, £",
  "PDF download — no BillFast watermark",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #1a5c38 0%, #2d8653 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url("data:image/svg+xml,${meshSvg}")` }}
        />

        <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-20 md:pt-24 md:pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
              Nigerian invoicing, simplified
            </div>
            <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-[1.1] mb-4 tracking-tight">
              Professional
              <br />
              Invoices in
              <br />
              <span className="relative inline-block">
                Seconds
                <span
                  className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                  style={{ backgroundColor: "#F0A500" }}
                />
              </span>
            </h1>
            <p className="text-sm md:text-lg text-white/60 max-w-xl mx-auto mt-6 mb-8 md:mb-10 leading-relaxed">
              Create clean, professional Nigerian invoices instantly. No signup
              required. Pay only ₦300 per invoice.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-[#F0A500] text-[#1a5c38] px-5 py-2.5 md:px-10 md:py-4 rounded-xl font-bold text-sm md:text-lg hover:bg-[#FFB820] hover:-translate-y-0.5 transition-all shadow-lg shadow-[#F0A500]/30 hover:shadow-xl hover:shadow-[#F0A500]/40"
            >
              Create Your First Invoice
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Floating invoice preview */}
          <div className="mt-16 md:mt-20 max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden -mb-32 md:-mb-40 relative">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-[#1a5c38] to-[#2d8653] rounded flex items-center justify-center">
                        <BiReceipt className="text-white text-xs" />
                      </div>
                      <span className="font-bold text-gray-900 text-sm">Your Business</span>
                    </div>
                    <p className="text-xs text-gray-400">business@example.com</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Invoice #</p>
                    <p className="text-sm font-semibold text-gray-900">INV-001</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Invoice To</p>
                    <p className="text-sm font-medium text-gray-900">Client Name</p>
                    <p className="text-xs text-gray-400">client@example.com</p>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <p>Date: 12 Jun 2026</p>
                    <p>Due: 26 Jun 2026</p>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 space-y-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Website Design</span>
                    <span>₦150,000.00</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Logo Package</span>
                    <span>₦50,000.00</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500">Total</span>
                  <span className="text-base font-bold" style={{ color: "#1a5c38" }}>₦200,000.00</span>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-center gap-4 text-xs text-gray-400">
                <span>business@example.com</span>
                <span>+234 800 000 0000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="pt-36 md:pt-48 pb-12 md:pb-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="group text-center p-6 md:p-8 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a5c38] to-[#2d8653] flex items-center justify-center mx-auto mb-5 shadow-md group-hover:shadow-lg transition-shadow">
                  <f.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── DETAILS ───── */}
      <section className="py-12 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Looks Like You Mean Business
              </h2>
              <p className="text-base text-gray-500 mb-8 leading-relaxed">
                Your invoice should reflect your brand. Clean layout, your logo,
                professional formatting, everything a Nigerian business needs.
              </p>
              <ul className="space-y-3">
                {checklist.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-[#1a5c38]/10 flex items-center justify-center flex-shrink-0">
                      <BiCheck className="text-[#1a5c38] text-sm" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 mt-8 bg-[#1a5c38] text-white px-5 py-2.5 md:px-8 md:py-3 rounded-xl font-semibold text-sm md:text-base hover:bg-[#2d8653] transition-colors shadow-md"
              >
                Create Invoice Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
              <div className="border-b-2 pb-4 mb-4" style={{ borderColor: "#1a5c38" }}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-[#1a5c38] to-[#2d8653] rounded flex items-center justify-center">
                        <BiReceipt className="text-white text-xs" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm">Your Business</h3>
                    </div>
                    <p className="text-xs text-gray-400">business@example.com</p>
                  </div>
                  <p className="text-xs text-gray-400">INV-001</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Invoice To
                </p>
                <p className="text-sm font-medium text-gray-900">Client Name</p>
                <p className="text-xs text-gray-400">client@example.com</p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-500">Total:</span>
                  <span className="text-lg font-bold" style={{ color: "#1a5c38" }}>₦150,000.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="relative overflow-hidden py-16 md:py-20" style={{ background: "linear-gradient(135deg, #1a5c38 0%, #2d8653 100%)" }}>
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url("data:image/svg+xml,${meshSvg}")` }}
        />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Ready to Create Your Invoice?
          </h2>
          <p className="text-white/60 text-base mb-8 max-w-lg mx-auto">
            It takes less than a minute. No account, no hassle.
          </p>
          <Link
            href="/create"
              className="inline-flex items-center gap-2 bg-[#F0A500] text-[#1a5c38] px-5 py-2.5 md:px-10 md:py-4 rounded-xl font-bold text-sm md:text-lg hover:bg-[#FFB820] hover:-translate-y-0.5 transition-all shadow-lg shadow-[#F0A500]/30 hover:shadow-xl hover:shadow-[#F0A500]/40"
            >
              Get Started Free
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="bg-[#0f2b1d] text-gray-500 py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 bg-gradient-to-br from-[#1a5c38] to-[#2d8653] rounded flex items-center justify-center">
              <BiReceipt className="text-white text-xs" />
            </div>
            <span className="font-bold text-white">BillFast</span>
          </div>
          <div className="flex items-center justify-center gap-4 mb-3 text-xs">
            <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/refund" className="text-gray-500 hover:text-gray-300 transition-colors">Refund Policy</Link>
          </div>
          <p className="text-sm text-gray-500">
            Professional invoices in seconds. Made in Nigeria.
          </p>
        </div>
      </footer>
    </div>
  );
}
