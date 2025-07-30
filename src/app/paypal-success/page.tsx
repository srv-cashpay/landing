'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function PaypalSuccessPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // order_id dari query param ?token=...

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [hasCaptured, setHasCaptured] = useState(false);

  useEffect(() => {
    if (token && !hasCaptured) {
      captureOrder(token);
      setHasCaptured(true);
    }
  }, [token, hasCaptured]);

useEffect(() => {
  if (status === 'success') {
    setTimeout(() => {
      window.location.href = 'cashpay://payment-success'; // ubah sesuai skema deep link aplikasi Android kamu
    }, 2000);
  }
}, [status]);

  const captureOrder = async (orderId: string) => {
    setStatus('loading');
    try {
      const res = await axios.post('https://cashpay.my.id:2358/paypal/capture', {
        order_id: orderId,
      });

      if (res.data.status === 'COMPLETED') {
        console.log('Payment completed!');
        setStatus('success');
      } else {
        console.warn('Payment not completed.');
        setStatus('error');
        setError('Pembayaran belum selesai. Silakan hubungi support.');
      }
    } catch (err: any) {
      console.error('Capture failed:', err.response?.data || err.message);
      setStatus('error');
      setError(err.response?.data?.message || 'Terjadi kesalahan saat memproses pembayaran.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black p-8">
      <div className="max-w-xl text-center">
        {status === 'loading' ? (
          <>
            <h1 className="text-xl font-semibold text-gray-700">Memproses pembayaran...</h1>
            <p className="text-sm text-gray-500 mt-2">Mohon tunggu sebentar.</p>
          </>
        ) : status === 'success' ? (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Pembayaran Berhasil!</h1>
            <p className="text-lg mb-6">Terima kasih telah membayar dengan PayPal.</p>
            {token && (
              <p className="text-sm text-gray-500">
                Order ID: <span className="font-mono">{token}</span>
              </p>
            )}
          </>
        ) : status === 'error' ? (
          <>
            <h1 className="text-3xl font-bold text-red-600 mb-4">Gagal Memproses</h1>
            <p className="text-lg text-gray-700 mb-4">{error}</p>
          </>
        ) : (
          <p className="text-gray-500">Menunggu token dari PayPal...</p>
        )}
      </div>
    </div>
  );
}
