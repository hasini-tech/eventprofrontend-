import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';

export default function PaymentFailedPage() {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '72px 20px 88px' }}>
      <div style={{ padding: '30px', borderRadius: '24px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-soft)', textAlign: 'center' }}>
        <AlertCircle size={64} color="#ff6584" style={{ margin: '0 auto 16px' }} />
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)', marginBottom: '10px', letterSpacing: '-0.04em' }}>Payment was not completed</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '22px' }}>
          No worries. Your booking was not finalized. You can try again from the event page or browse other events.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/events" style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--primary-color)', color: 'white', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Browse events
            <ArrowRight size={16} />
          </Link>
          <Link href="/dashboard?tab=tickets" style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.72)', fontWeight: 700 }}>
            My tickets
          </Link>
        </div>
      </div>
    </div>
  );
}
