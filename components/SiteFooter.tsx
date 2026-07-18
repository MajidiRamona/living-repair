export default function SiteFooter({ children }: { children: React.ReactNode }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.4rem' }}>Living Repair</div>
          <div className="small">{children}</div>
        </div>
      </div>
    </footer>
  );
}
