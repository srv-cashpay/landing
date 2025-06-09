// pages/privacy.tsx
import React from 'react';
import Head from 'next/head';

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Kebijakan Privasi | Cashpay</title>
      </Head>

      <section className="min-h-screen bg-white text-black py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Kebijakan Privasi</h1>
          <p className="mb-4">
            Aplikasi Point of Sale (POS) kami menghargai privasi pengguna. Halaman ini menjelaskan cara kami mengelola dan melindungi data Anda.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Informasi yang Dikumpulkan</h2>
          <ul className="list-disc list-inside mb-4">
            <li>Nama bisnis</li>
            <li>Transaksi dan data penjualan</li>
            <li>Lokasi dan perangkat</li>
            <li>Informasi login</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">Penggunaan Data</h2>
          <p className="mb-4">
            Data digunakan untuk meningkatkan layanan, laporan penjualan, dan kepentingan keamanan.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Hak Pengguna</h2>
          <p>
            Anda dapat mengakses, memperbarui, atau menghapus data pribadi Anda dengan menghubungi kami.
          </p>

          <p className="mt-6 text-sm text-zinc-600 italic">Terakhir diperbarui: 28 Mei 2025</p>
        </div>
      </section>
    </>
  );
}
