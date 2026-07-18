/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/about-us', destination: '/about', permanent: true },
    ];
  },
  async headers() {
    // Baseline hardening headers. Note: no strict Content-Security-Policy here — Next.js's
    // App Router injects small inline scripts for hydration, which a strict CSP would need
    // a nonce (via middleware) to allow. This is a reasonable default, not a maximal one.
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    ];
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

module.exports = nextConfig;
