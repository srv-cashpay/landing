'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { AxiosError } from 'axios';

export default function PaypalSuccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      captureOrder(token);
    }
  }, [token]);

  const captureOrder = async (orderId: string) => {
    try {
      const res = await axios.post('https://cashpay.my.id:2358/paypal/capture', {
        order_id: orderId,
      });

      if (res.data.status === 'COMPLETED') {
        console.log('Payment completed!');
      } else {
        console.warn('Payment not completed.');
      }
    } catch (err: unknown) {
      const axiosErr = err as AxiosError;
      console.error('Capture failed:', axiosErr.response?.data || axiosErr.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black p-8">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Pembayaran Berhasil!</h1>
        <p className="text-lg mb-6">Terima kasih telah membayar dengan PayPal.</p>
        {token && <p className="text-sm text-gray-500">Order ID: <span className="font-mono">{token}</span></p>}
      </div>
    </div>
  );
}
