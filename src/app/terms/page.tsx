import { PublicNav, PublicFooter } from '@/components/PublicChrome';

export const metadata = {
  title: 'Terms of Service — CarbonGero',
  description: 'The terms governing use of the CarbonGero platform.',
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <PublicNav />
      <article className="max-w-3xl mx-auto px-5 pt-12 pb-16 prose-sm">
        <p className="tag text-clay">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-ink-faint">Last updated: 20 November 2026 · Operated by Xphora AI Technology Pvt. Ltd. (&ldquo;CarbonGero&rdquo;, &ldquo;we&rdquo;).</p>

        <div className="mt-8 space-y-6 text-sm text-ink-soft leading-relaxed">
          <section><h2 className="font-display text-lg font-bold text-ink">1. What CarbonGero is</h2>
            <p className="mt-2">CarbonGero is a Proof of Sustainability platform: you record environmental actions, we help verify them, and verified actions can produce voluntary reward tokens and (where offered) tradable records. CarbonGero is <b>not</b> a regulated financial service, securities exchange, or accredited carbon registry. See our <a href="/disclosures" className="text-forest">Disclosures</a>.</p></section>

          <section><h2 className="font-display text-lg font-bold text-ink">2. Eligibility & accounts</h2>
            <p className="mt-2">You must be able to form a binding contract in your jurisdiction. You are responsible for your account, your wallet keys, and activity under your account. Provide accurate information.</p></section>

          <section><h2 className="font-display text-lg font-bold text-ink">3. Evidence & verification</h2>
            <p className="mt-2">You must own or have the right to submit any evidence you upload, and it must be truthful and unaltered. Submitting fraudulent, duplicated, or misrepresented evidence may result in rejection, reversal of rewards, and account termination. AI assessment is advisory; human review decisions are final for platform purposes.</p></section>

          <section><h2 className="font-display text-lg font-bold text-ink">4. Reward tokens</h2>
            <p className="mt-2">Reward tokens (CGRO) are a <b>voluntary platform reward</b> and utility token. They are <b>not</b> an investment, security, deposit, or guarantee of value, and we make no promise that they will have or retain any monetary value. We may adjust reward rules prospectively.</p></section>

          <section><h2 className="font-display text-lg font-bold text-ink">5. Credits, marketplace & retirement</h2>
            <p className="mt-2">Credits issued by CarbonGero are voluntary-market and not registry-accredited unless expressly stated. Listing, buying, or transferring a credit does not by itself constitute a valid offset claim; retirement is explicit and separate. Payments, where applicable, are processed by licensed third-party providers under their terms.</p></section>

          <section><h2 className="font-display text-lg font-bold text-ink">6. No environmental or financial advice</h2>
            <p className="mt-2">Content is for information only and is not environmental, legal, tax, or financial advice. Estimates use documented factors and may differ from independently verified figures.</p></section>

          <section><h2 className="font-display text-lg font-bold text-ink">7. Acceptable use</h2>
            <p className="mt-2">Do not misuse the platform, attempt to defraud the verification system, infringe others&apos; rights, or use it unlawfully. We may suspend or terminate access for breach.</p></section>

          <section><h2 className="font-display text-lg font-bold text-ink">8. Disclaimers & liability</h2>
            <p className="mt-2">The platform is provided &ldquo;as is&rdquo; without warranties to the maximum extent permitted by law. To the extent permitted by law, our aggregate liability is limited, and we are not liable for indirect or consequential loss. Nothing limits liability that cannot be limited by law.</p></section>

          <section><h2 className="font-display text-lg font-bold text-ink">9. Changes</h2>
            <p className="mt-2">We may update these terms; material changes will be notified. Continued use means acceptance.</p></section>

          <section><h2 className="font-display text-lg font-bold text-ink">10. Contact</h2>
            <p className="mt-2">Questions: via the contact channel on our site.</p></section>

          <p className="text-xs text-ink-faint">This document is a plain-language template and should be reviewed by qualified counsel for your operating jurisdictions before a monetised launch.</p>
        </div>
      </article>
      <PublicFooter />
    </div>
  );
}
