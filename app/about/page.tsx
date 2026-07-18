import Link from 'next/link';
import type { Metadata } from 'next';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Living Repair is a University of Geneva student-led observatory documenting repair, reuse, and upcycling as living cultural heritage and a pathway toward more sustainable futures.',
};

export default function AboutPage() {
  return (
    <>
      <header className="hero" style={{ padding: '80px 0 40px' }}>
        <div className="container">
          <div className="eyebrow">About · Geneva · 2026</div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)' }}>Repair as living heritage.</h1>
          <p className="lede">
            Repair, reuse, and upcycling are more than practical responses to material needs — they are cultural
            practices that reflect creativity, care, and resourcefulness in how people relate to objects, communities,
            and the environment.
          </p>
        </div>
      </header>

      <section className="section" style={{ padding: '60px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80 }}>
          <aside style={{ position: 'sticky', top: 100, height: 'fit-content' }}>
            <div className="label">In this page</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0', fontSize: '0.92rem', lineHeight: 2 }}>
              <li><a href="#welcome" style={{ textDecoration: 'none' }}>Welcome</a></li>
              <li><a href="#living-heritage" style={{ textDecoration: 'none' }}>Living heritage</a></li>
              <li><a href="#repair" style={{ textDecoration: 'none' }}>Repair as practice</a></li>
              <li><a href="#observatory" style={{ textDecoration: 'none' }}>An observatory</a></li>
              <li><a href="#geneva" style={{ textDecoration: 'none' }}>Why Geneva</a></li>
              <li><a href="#who" style={{ textDecoration: 'none' }}>Who we are</a></li>
              <li><a href="#how" style={{ textDecoration: 'none' }}>How we worked</a></li>
              <li><a href="#thanks" style={{ textDecoration: 'none' }}>Thanks</a></li>
              <li><a href="#cautions" style={{ textDecoration: 'none' }}>Cautions</a></li>
              <li><a href="#sources" style={{ textDecoration: 'none' }}>Sources</a></li>
              <li><a href="#contact" style={{ textDecoration: 'none' }}>Contact</a></li>
            </ul>
          </aside>

          <article className="prose">
            <h2 id="welcome">Welcome</h2>
            <p>
              Repair, reuse, and upcycling are more than practical responses to material needs. They are cultural
              practices that reflect creativity, care, and resourcefulness, shaping how people relate to objects,
              communities, and the environment across the world.
            </p>
            <p>
              In many parts of the Global South, repair and reuse have long been essential strategies for living
              with limited resources, transforming constraints into opportunities through ingenuity and locally
              rooted knowledge. In Soviet societies, they also emerged from material shortages, leaving a lasting
              legacy in collective memories, everyday skills, and relationships to consumption. In many
              industrialized societies, repair practices declined with the rise of mass production and disposable
              consumer culture. As concerns over climate change, waste, and resource depletion grow, repair is
              experiencing a remarkable revival and is increasingly recognized as a cornerstone of the circular
              economy and of the global right-to-repair movement.
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

            <h2 id="living-heritage">Living heritage</h2>
            <p>
              For most of the twentieth century, heritage meant things we tried to <em>protect</em> — buildings,
              manuscripts, monuments. Since the 2003 UNESCO Convention for the Safeguarding of the Intangible Cultural
              Heritage, that framing has inverted. The Convention recognised that some forms of heritage — songs,
              rituals, repair, cooking, ecological knowledge, water management — only exist when people <em>do</em>{' '}
              them. They are constantly recreated. They are alive.
            </p>
            <p>
              And once heritage is alive, it has agency. It can adapt, transmit knowledge across generations, and
              contribute to more sustainable ways of living — instead of waiting to be saved.
            </p>

            <h2 id="repair">Repair as practice</h2>
            <p>
              Repair is one of the most concrete expressions of this living heritage. Mending a garment, restoring
              an object, passing on a craft technique — these are not nostalgic gestures. They are active responses
              to overconsumption and waste, rooted in communities and transmitted through practice.
            </p>
            <p>
              Old and new repair traditions share a logic: extend the life of things, reduce dependence on
              extractive production, and keep knowledge alive by using it. A repair workshop that diverts textiles
              from landfill is not just an environmental initiative — it is a form of cultural transmission.
            </p>
            <p>
              The 2003 Convention and the 2030 Agenda for Sustainable Development increasingly recognise this
              overlap. Craftsmanship, slow fashion, and repair economies appear explicitly in UNESCO&apos;s
              sustainability framing as forms of living heritage with direct relevance to responsible consumption
              and livelihoods.
            </p>

            <h2 id="observatory">An observatory, not a database</h2>
            <p>
              This platform is not an attempt to catalogue everything. It is an observatory: a space through which
              different actors in the world of repair can become visible and connected — to each other, to
              researchers, to policymakers. It&apos;s meant to be skimmed in five minutes by a researcher, a
              practitioner, or anyone curious about why a repair workshop belongs in the same conversation as
              &quot;heritage&quot; and &quot;sustainability.&quot;
            </p>
            <p>
              We started with two Geneva-based initiatives because we knew them, because they agreed to be profiled,
              and because starting small keeps the descriptions honest. As the platform grows, the logic stays the
              same: depth over breadth, community-verified over algorithmically scraped.
            </p>

            <h2 id="geneva">Why Geneva</h2>
            <p>
              Geneva sits at the intersection of international diplomacy, the UN environment system, and a dense
              civil-society network. It is also home to{' '}
              <Link href="/initiatives/histoires-sans-chute">Histoires Sans Chute</Link>, which records and
              recirculates intergenerational oral memory, and <Link href="/initiatives/amak-bro">Amak-bro</Link>,
              which runs a repair and re-craft workshop — two initiatives doing tangible sustainability work without
              ever calling themselves &quot;sustainability projects.&quot;
            </p>
            <p>Geneva is where we started. It is where we could verify what we wrote. That was reason enough to start here.</p>

            <h2 id="who">Who we are</h2>
            <p>
              Living Repair started as a student initiative at the <strong>University of Geneva (UNIGE)</strong>,
              growing out of the seminar <em>Heritage for Sustainable Development</em>. The project is led by{' '}
              <strong>Mana Majidi</strong>, also a UNIGE student, who manages the platform and its ongoing
              development.
            </p>
            <p>
              Our backgrounds are mixed — international relations, environmental studies, anthropology, art history,
              and more. None of us set out as professional web developers; this site began as a coursework artefact
              and has since grown into an ongoing project. We made it because writing essays about heritage and
              sustainability felt insufficient — we wanted to build something visible and usable.
            </p>

            <h2 id="how">How we worked</h2>
            <p>
              We chose to feature only two initiatives at launch —{' '}
              <Link href="/initiatives/histoires-sans-chute">Histoires Sans Chute</Link> and{' '}
              <Link href="/initiatives/amak-bro">Amak bro</Link>. We did this on purpose. A long catalogue of every
              interesting project on Earth would have been easy to assemble and easy to ignore. We did fieldwork
              with both organisations — visiting, interviewing, verifying — and that takes time. Two well-described
              cases are more honest than a dozen scraped ones.
            </p>
            <p>
              The platform started as static HTML and vanilla JavaScript, no tracking, no accounts, hosted from a
              folder. It has since grown a native submission form and an admin review workflow so new initiatives
              can be added without editing files by hand — but the same principle still holds: depth over breadth,
              community-verified over algorithmically scraped.
            </p>

            <h2 id="thanks">Thanks</h2>
            <p>
              To the seminar instructor and teaching team for the framing and the freedom to take it in this
              direction. To Histoires Sans Chute and Amak bro for letting us write about their work, and for their
              time during fieldwork. To everyone in the Geneva repair and heritage communities who answered an
              email from a graduate student they had never heard of.
            </p>
            <p>Any errors of fact or framing on this site are ours alone, and we welcome corrections.</p>

            <h2 id="cautions">Cautions</h2>
            <p>
              Not all heritage is sustainable, and not all repair is emancipatory. Some traditions involve hierarchy,
              exclusion, or extraction. We apply a human-rights compatibility filter to everything we feature — the
              same standard embedded in the 2003 Convention itself. We also try to resist the temptation to turn
              living practice into a metric: the point is to give communities credit for work they were already
              doing, not to flatten that work into an indicator.
            </p>

            <h2 id="sources">Sources</h2>
            <ul>
              <li>
                Bortolotto, Chiara. <em>Will Heritage Save Us? Intangible Cultural Heritage and the Sustainable
                Development Turn.</em> Cambridge University Press, 2025.{' '}
                <a href="https://doi.org/10.1017/9781009509114">doi.org/10.1017/9781009509114</a>
              </li>
              <li>UNESCO. <em>Convention for the Safeguarding of the Intangible Cultural Heritage</em>, Paris, 2003.</li>
              <li>UNESCO. <em>Operational Directives</em>, chapter VI on ICH and sustainable development (2016 onwards).</li>
              <li>UN. <em>2030 Agenda for Sustainable Development</em>, 2015.</li>
            </ul>

            <h2 id="contact">Contact</h2>
            <p>
              If you&apos;d like to suggest an initiative we should track, the{' '}
              <Link href="/submit">recommendation form</Link> is the fastest way to reach us. For everything else —
              corrections, collaborations, or a polite disagreement about a section heading — please contact our
              project manager <a href="mailto:mana.majidi@etu.unige.ch">mana.majidi@etu.unige.ch</a>.
            </p>
          </article>
        </div>
      </section>

      <SiteFooter>An independent, non-commercial observatory of repair practices. Made by UNIGE students, 2026.</SiteFooter>
    </>
  );
}
