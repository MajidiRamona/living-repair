import Link from 'next/link';

export default function NotFound() {
  return (
    <header className="hero">
      <div className="container">
        <div className="eyebrow">404</div>
        <h1>That page doesn&apos;t exist.</h1>
        <p className="lede">
          The page you&apos;re looking for isn&apos;t here. <Link href="/">Back to the homepage</Link> or{' '}
          <Link href="/initiatives">see all initiatives</Link>.
        </p>
      </div>
    </header>
  );
}
