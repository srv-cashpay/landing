"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type VoucherGenerate = {
  id: string;
  merchant_id: string;
  voucher_name: string;
  voucher_link: string;
  voucher_qr: string;
  start_date: string;
  end_date: string;
  status: boolean;
  merchant_instagram?: string; // optional
};

export default function VoucherVerificationPage() {
  // safe typing untuk params
  const params = useParams() as { id: string; merchantId: string };
  const { id, merchantId } = params;

  const [loading, setLoading] = useState(true);
  const [voucher, setVoucher] = useState<VoucherGenerate | null>(null);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [followed, setFollowed] = useState(false);

  // Ambil data voucher
  useEffect(() => {
    async function fetchVoucher() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://cashpay.my.id:2358/voucher-verification/${id}/${merchantId}`
        );
        const json = await res.json();

        if (!res.ok) throw new Error(json.message || "Terjadi kesalahan");

        if (json.data?.voucher_generate?.length > 0) {
          setVoucher({
            ...json.data.voucher_generate[0],
            merchant_instagram: "https://instagram.com/cashpay", // sementara hardcode
          });
        } else {
          setError("Voucher tidak ditemukan.");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Gagal memuat voucher.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchVoucher();
  }, [id, merchantId]);

  // Gunakan voucher
  async function handleUseVoucher(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Kenalan dulu dong, tulis nama lengkap kamu.");
      return;
    }

    if (!followed) {
      setError("Anda harus follow Instagram merchant terlebih dahulu.");
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch("https://cashpay.my.id:2358/voucher-use", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          voucher_id: id,
          merchant_id: merchantId,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal gunakan voucher");

      if (json.ok) {
        setVoucher((prev) => (prev ? { ...prev, status: true } : prev));
      } else {
        setError(json.message || "Voucher tidak valid.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan saat gunakan voucher.");
      }
    } finally {
      setVerifying(false);
    }
  }

  // --- UI ---
  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md">
        Memuat data voucher...
      </div>
    );
  }

  if (error && !voucher) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md">
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md">
        <p className="text-gray-500 text-sm">Voucher tidak tersedia.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-2">
        Voucher: {voucher.voucher_name}
      </h2>

      <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700 text-sm">
        <p>
          <strong>Status: </strong>
          {voucher.status ? "Sudah digunakan" : "Belum digunakan"}
        </p>
        <p>
          <strong>Berlaku: </strong>
          {voucher.start_date} - {voucher.end_date}
        </p>
      </div>

      {/* Input nama + tombol gunakan voucher */}
      <form onSubmit={handleUseVoucher} className="mt-6 space-y-3">
        <label className="block text-sm font-medium">Nama Lengkap</label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Masukkan nama lengkap"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          disabled={verifying}
        />

        {/* Syarat follow Instagram */}
        {voucher.merchant_instagram && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">
              Untuk menggunakan voucher ini, silakan follow Instagram:
            </p>
            <a
              href={voucher.merchant_instagram}
              target="_blank"
              rel="noreferrer"
              onClick={() => setFollowed(true)}
              className="block w-full text-center px-4 py-2 rounded-lg bg-pink-600 text-white text-sm hover:bg-pink-700"
            >
              Follow Instagram
            </a>
          </div>
        )}

        <button
          type="submit"
          className={`w-full px-4 py-2 rounded-lg text-white text-sm shadow-sm ${
            verifying || !followed
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
          disabled={verifying || !followed}
        >
          {verifying ? "Memproses..." : "Gunakan Voucher"}
        </button>
      </form>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </div>
  );
}
