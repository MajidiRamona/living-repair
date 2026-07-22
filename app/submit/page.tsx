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
            This form collects information about repair initiatives so we can help promote your work on the
            platform — a repair workshop, oral-memory project, foodways collective, or anything in that spirit.
            It takes about five minutes, and it&apos;s entirely your choice whether any of it becomes public.
          </p>
        </div>
      </header>

      <section className="section" style={{ padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <article className="prose">
            <p>
              Repair, reuse, and upcycling are more than practical responses to material needs. They are cultural
              practices that reflect creativity, care, and resourcefulness, shaping how people relate to objects,
              communities, and the environment across the world.
            </p>
            <p>
              In many parts of the Global South, repair and reuse have long been essential strategies for living
              with limited resources, transforming constraints into opportunities through ingenuity and locally
              rooted knowledge. In Soviet societies, they also emerged from the material shortages, leaving a
              lasting legacy in collective memories, everyday skills, and relationships to consumption. In many
              industrialized societies, repair practices declined with the rise of mass production and disposable
              consumer culture. As concerns over climate change, waste, and resource depletion grow, repair is
              experiencing a remarkable revival and increasingly recognized as a cornerstone of the circular
              economy. A global right-to-repair movement is bringing together environmental activists, consumers,
              craftspeople, and policymakers to challenge planned obsolescence and to revalue repair not only as an
              ecological necessity but also as a cultural practice embedded in skills, knowledge, and social
              relationships.
            </p>
            <p>
              This platform explores repair both as a revitalised response to contemporary environmental challenges
              and as a longstanding practice that has continued uninterrupted in many societies. It documents repair
              practices, connects initiatives across countries and sectors, and highlights the diverse ways in which
              people care for, adapt, transform, and give new life to objects.
            </p>
            <p>
              Designed as both a research tool and a shared learning environment, the platform brings together
              students, researchers, practitioners, and communities across institutions and countries. Through
              collaborative documentation, comparative analysis, and the exchange of experiences, it contributes to
              a growing understanding of repair as a cultural practice, a social innovation, and a pathway toward
              more sustainable futures.
            </p>
            <p>
              Whether you are here to discover repair initiatives, contribute your own experiences, or learn from
              others, we invite you to join this collective exploration.
            </p>
            <p>
              <strong>Submissions are reviewed before publication.</strong> Please answer as concretely as possible
              — vague descriptions slow review. At the end of the form, you decide whether your information can be
              published on the site at all — if not, we still keep it on file, we simply won&apos;t publish it.
            </p>
          </article>
        </div>
      </section>

      <section className="section" style={{ padding: '0 0 80px' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <SubmissionForm />
        </div>
      </section>

      <SiteFooter>An independent, non-commercial observatory of repair practices.</SiteFooter>
    </>
  );
}
