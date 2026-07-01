import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <Link href="/" className="text-sm text-[#1a5c38] hover:underline mb-8 inline-block">&larr; Back to Home</Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-gray max-w-none space-y-6 text-sm md:text-base leading-relaxed text-gray-700">
          <p>Last updated: July 1, 2026</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8">1. Information We Collect</h2>
          <p>We collect information you provide when using the Service, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Business name, email address, and phone number</li>
            <li>Client names and email addresses (for invoice creation)</li>
            <li>Invoice data including line items, amounts, and notes</li>
            <li>Account credentials (email and password) if you create an account</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mt-8">2. How We Use Your Information</h2>
          <p>Your information is used solely to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide and improve the invoicing service</li>
            <li>Process payments via Paystack</li>
            <li>Save your business profile and invoice history</li>
            <li>Communicate with you about your account or invoices</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mt-8">3. Data Storage and Security</h2>
          <p>Your data is stored securely using industry-standard encryption. We use PostgreSQL databases hosted on secure cloud infrastructure. Passwords are hashed using bcrypt before storage.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8">4. Payment Processing</h2>
          <p>Payments are processed by Paystack. We do not store credit card numbers or bank details. Paystack handles all sensitive payment data in compliance with PCI-DSS standards.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8">5. Data Sharing</h2>
          <p>We do not sell or share your personal information with third parties, except as required to operate the Service (e.g., Paystack for payment processing) or as required by law.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8">6. Data Retention</h2>
          <p>We retain your data for as long as your account is active or as needed to provide the Service. You may request deletion of your data by contacting us.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8">7. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at <a href="mailto:support@billfast.ng" className="text-[#1a5c38] hover:underline">support@billfast.ng</a>.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8">8. Changes to This Policy</h2>
          <p>We may update this policy from time to time. Changes will be posted on this page with an updated revision date.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8">9. Contact</h2>
          <p>For privacy-related inquiries: <a href="mailto:support@billfast.ng" className="text-[#1a5c38] hover:underline">support@billfast.ng</a></p>
        </div>
      </div>
    </div>
  );
}
