import type { Metadata } from 'next';
import SubmissionForm from '@/components/SubmissionForm';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = { title: 'Submit an initiative' };

export default function SubmitPage() {
  return (
    <>
      <header className="hero" style={{ padding: '80px 0 40px' }}>
        <div className="container">
          <div className="eyebrow">Recommend an initiative</div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)' }}>Know an organization that does this work?</h1>
          <p className="lede">
            If you know a repair workshop, oral-memory project, foodways collective, or any other living-heritage
            initiative we should track — recommend it. The form takes about five minutes. Submissions are reviewed
            before publication; some information stays internal, and we&apos;ll always keep your contact email
            private unless you say otherwise.
          </p>
        </div>
      </header>

      <section className="section" style={{ padding: '40px 0 80px' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <SubmissionForm />
        </div>
      </section>

      <SiteFooter>An independent, non-commercial observatory of repair practices.</SiteFooter>
    </>
  );
}
