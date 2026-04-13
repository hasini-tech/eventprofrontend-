import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '72px 20px 88px' }}>
      <div style={{ padding: '30px', borderRadius: '24px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-soft)', textAlign: 'center' }}>
        <CheckCircle2 size={64} color="var(--primary-color)" style={{ margin: '0 auto 16px' }} />
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)', marginBottom: '10px', letterSpacing: '-0.04em' }}>Payment successful</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '22px' }}>
          Your ticket is confirmed. We have updated your booking and the event host can now see your RSVP in the attendee dashboard.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/dashboard?tab=tickets" style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--primary-color)', color: 'white', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            View my tickets
            <ArrowRight size={16} />
          </Link>
          <Link href="/events" style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.72)', fontWeight: 700 }}>
            Explore more events
          </Link>
        </div>
      </div>
    </div>
  );
}
