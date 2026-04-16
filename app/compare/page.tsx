'use client';

const VARIANTS = [
  { href: '/', label: 'Home', desc: 'Violet Dark' },
  { href: '/home1', label: 'Home 1', desc: 'NBA Black' },
  { href: '/home2', label: 'Home 2', desc: 'ESPN Light' },
  { href: '/home3', label: 'Home 3', desc: 'Navy College' },
];

export default function ComparePage() {
  return (
    <div style={{ background: '#060608', minHeight: '100vh', padding: '32px 24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
          Design vergelijking
        </h1>
        <p style={{ color: '#555', fontSize: '0.8rem', margin: 0 }}>
          Klik op een design om het volledig te bekijken
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        {VARIANTS.map(v => (
          <div key={v.href}>
            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: '0.9rem', marginBottom: '2px' }}>{v.label}</div>
              <div style={{ color: '#555', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{v.desc}</div>
            </div>

            <a href={v.href} style={{ display: 'block', position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1a1a1a', textDecoration: 'none', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#444')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a1a1a')}
            >
              <div style={{ position: 'relative', width: '100%', paddingBottom: '185%', background: '#111' }}>
                <iframe
                  src={v.href}
                  title={v.label}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '400%',
                    height: '400%',
                    transform: 'scale(0.25)',
                    transformOrigin: 'top left',
                    border: 'none',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </a>

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <a href={v.href} style={{ color: '#666', fontSize: '0.75rem', textDecoration: 'none', fontWeight: 600 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#666')}
              >
                Volledig bekijken →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
