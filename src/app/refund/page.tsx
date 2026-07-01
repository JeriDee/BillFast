import Link from "next/link";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <Link href="/" className="text-sm text-[#1a5c38] hover:underline mb-8 inline-block">&larr; Back to Home</Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Refund &amp; Cancellation Policy</h1>

        <div className="prose prose-gray max-w-none space-y-6 text-sm md:text-base leading-relaxed text-gray-700">
          <p>Last updated: July 1, 2026</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8">1. Service Fee</h2>
          <p>BillFast charges a one-time fee of ₦300 per invoice download. This fee grants you access to download a single PDF invoice.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8">2. Refund Policy</h2>
          <p>Due to the digital nature of our service, all sales are final once the invoice PDF has been successfully downloaded. However, we will consider refunds in the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Technical failure:</strong> If you are charged but unable to download your invoice due to a system error on our end, you are eligible for a full refund.</li>
            <li><strong>Duplicate charge:</strong> If you are charged multiple times for the same invoice, we will refund the duplicate charges.</li>
            <li><strong>Payment error:</strong> If an incorrect amount was charged.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mt-8">3. How to Request a Refund</h2>
          <p>To request a refund, contact us within 7 days of the transaction at <a href="mailto:support@billfast.ng" className="text-[#1a5c38] hover:underline">support@billfast.ng</a> with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your full name and email address</li>
            <li>The payment reference number</li>
            <li>The date and amount of the transaction</li>
            <li>A brief description of the issue</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mt-8">4. Refund Processing</h2>
          <p>Approved refunds will be processed within 5-10 business days. Refunds are issued to the original payment method used. Paystack may apply its own processing fees.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8">5. Cancellation</h2>
          <p>Since BillFast operates on a per-invoice fee model (no subscriptions), there is no recurring billing to cancel. You may stop using the Service at any time. If you have an account, you may delete it by contacting us.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8">6. Chargebacks</h2>
          <p>If you initiate a chargeback with your bank or payment provider before contacting us, you may be denied service. Please reach out to us first so we can resolve the issue.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8">7. Contact</h2>
          <p>For refund requests or questions: <a href="mailto:support@billfast.ng" className="text-[#1a5c38] hover:underline">support@billfast.ng</a></p>
        </div>
      </div>
    </div>
  );
}
