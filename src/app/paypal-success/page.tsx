import dynamic from 'next/dynamic';

const PaypalSuccessContent = dynamic(() => import('./PaypalSuccessContent'), {
  ssr: false, // ⛔ non-SSR (client-only)
});

export default function PaypalSuccessPage() {
  return <PaypalSuccessContent />;
}