import { PublicNav, PublicFooter } from '@/components/PublicChrome';

export const metadata = {
  title: 'Privacy Policy — CarbonGero',
  description: 'How CarbonGero collects, uses, and protects your data.',
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <PublicNav />
      <article className="max-w-3xl mx-auto px-5 pt-12 pb-16">
        <p className="tag text-clay">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-ink-faint">Last updated: 20 November 2026 · Operated by Xphora AI Technology Pvt. Ltd.</p>

        <div className="mt-8 space-y-6 text-sm text-ink-soft leading-relaxed">
          <section><h2 className="font-display text-lg font-bold text-ink">1. Our approach</h2>
            <p className="mt-2">We practise data minimisation: we collect only what we need to run the service, and we never sell your personal data.</p></section>

          <section><h2 className="font-display text-lg font-bold text-ink">2. What we collect</h2>
            <ul className="mt-2 space-y-1">
              <li>• <b>Account</b>: name, email, role, and (if you connect one) your public Algorand wallet address.</li>
              <li>• <b>Activity</b>: sustainability activities, evidence files and their cryptographic hashes, assessment and verification records.</li>
              <li>• <b>Community</b>: pledges and waitlist entries you submit.</li>
              <li>• <b>Technical</b>: basic logs and, if you consent, product analytics to improve the service.</li>
            </ul></section>

          <section><h2 className="font-display text-lg font-bold text-ink">3. How we use it</h2>
            <p className="mt-2">To verify actions, issue rewards, operate the marketplace, prevent fraud and abuse, comply with law, and improve the product. Evidence is held in controlled off-chain storage; only required proof references and hashes are written on-chain. We do not expose personal information through blockchain transactions.</p></section>

          <section><h2 className="font-display text-lg font-bold text-ink">4. Legal bases</h2>
            <p className="mt-2">We process data to perform our contract with you, for legitimate interests (security, product improvement), to comply with legal obligations, and — for analytics/marketing — on the basis of your consent, which you can withdraw.</p></section>

          <section><h2 className="font-display text-lg font-bold text-ink">5. Sharing</h2>
            <p className="mt-2">With service providers who process data on our behalf (hosting/database, authentication, analytics, and — where applicable — licensed payment/KYC providers), under contract. On-chain records are public by design, but contain no personal information.</p></section>

          <section><h2 className="font-display text-lg font-bold text-ink">6. Retention & your rights</h2>
            <p className="mt-2">We keep data only as long as needed for the purposes above or as required by law. Subject to applicable law, you may request access, correction, deletion, or export of your data, and object to or restrict certain processing. Note that on-chain anchors are immutable, but they contain only hashes and references, not personal data.</p></section>

          <section><h2 className="font-display text-lg font-bold text-ink">7. Cookies</h2>
            <p className="mt-2">We use essential cookies to run the site. Non-essential analytics cookies are used only with your consent, which you can manage via the consent banner.</p></section>

          <section><h2 className="font-display text-lg font-bold text-ink">8. Contact</h2>
            <p className="mt-2">For privacy requests, use the contact channel on our site.</p></section>

          <p className="text-xs text-ink-faint">This is a plain-language template and should be reviewed by qualified counsel for your operating jurisdictions (incl. GDPR/DPDP as applicable) before a monetised launch.</p>
        </div>
      </article>
      <PublicFooter />
    </div>
  );
}
