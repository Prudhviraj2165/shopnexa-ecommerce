import { Link } from 'react-router-dom';

const STEPS = [
  { label: 'Sign In', to: '/login' },
  { label: 'Address', to: '/shipping' },
  { label: 'Payment', to: '/payment' },
  { label: 'Review', to: '/placeorder' },
];

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const active = [step1, step2, step3, step4];
  const currentStep = active.lastIndexOf(true);

  return (
    <nav style={{ padding: '16px 20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0' }}>
      {STEPS.map((step, i) => {
        const isActive = active[i];
        const isCurrent = i === currentStep;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            {/* Step bubble */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              {isActive
                ? <Link to={step.to} style={{ width: '32px', height: '32px', borderRadius: '50%', background: isCurrent ? 'var(--primary-color)' : 'rgba(29,185,84,0.2)', border: `2px solid var(--primary-color)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: isCurrent ? 'white' : 'var(--primary-color)', textDecoration: 'none', transition: 'all 0.2s' }}>{i + 1}</Link>
                : <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--card-bg)', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>{i + 1}</span>
              }
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: isActive ? 'var(--primary-color)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {step.label}
              </span>
            </div>
            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div style={{ width: '60px', height: '2px', background: active[i + 1] ? 'var(--primary-color)' : 'var(--border-color)', margin: '0 4px', marginBottom: '20px', transition: 'background 0.3s' }} />
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default CheckoutSteps;
