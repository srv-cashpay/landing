'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';

export default function PaypalSuccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed' | 'error'>('idle');

  useEffect(() => {
    if (token) {
      setStatus('processing');
      captureOrder(token);
    }
  }, [token]);

  const captureOrder = async (orderId: string) => {
    try {
      const res = await axios.post('https://cashpay.my.id:2358/paypal/capture', {
        order_id: orderId,
      });

      if (res.data.status === 'COMPLETED') {
        setStatus('success');
        console.log('✅ Payment completed!');
      } else {
        setStatus('failed');
        console.warn('⚠️ Payment not completed.');
      }
    } catch (err: unknown) {
      const axiosErr = err as AxiosError;
      console.error('❌ Capture failed:', axiosErr.response?.data || axiosErr.message);
      setStatus('error');
    }
  };

  // 🔁 Redirect ke aplikasi Android setelah sukses
  useEffect(() => {
    if (status === 'success') {
      const timeout = setTimeout(() => {
        window.location.href = 'cashpay://payment-success'; // Ganti sesuai skema deeplink
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [status]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black p-8">
      <div className="max-w-xl text-center">
        {status === 'processing' && (
          <>
            <h1 className="text-2xl font-semibold text-gray-700 mb-4">Sedang memproses pembayaran...</h1>
            <p className="text-sm text-gray-500">Order ID: <span className="font-mono">{token}</span></p>
          </>
        )}
        {status === 'success' && (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Pembayaran Berhasil!</h1>
            <p className="text-lg mb-2">Terima kasih telah membayar dengan PayPal.</p>
            <p className="text-sm text-gray-500">Akan mengalihkan ke aplikasi...</p>
          </>
        )}
        {status === 'failed' && (
          <>
            <h1 className="text-2xl font-bold text-yellow-500 mb-4">Pembayaran belum selesai</h1>
            <p className="text-sm text-gray-600">Silakan coba lagi atau gunakan metode lain.</p>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold text-red-500 mb-4">Terjadi kesalahan</h1>
            <p className="text-sm text-gray-600">Tidak dapat memproses pembayaran saat ini.</p>
          </>
        )}
      </div>
    </div>
  );
}
