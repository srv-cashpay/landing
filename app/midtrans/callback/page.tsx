"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface PaymentResponse {
  status_message?: string;
  [key: string]: any;
}

export default function PaymentChecklist() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams?.get("order_id") ?? "";
  const statusCode = searchParams?.get("status_code") ?? "";
  const transactionStatus = searchParams?.get("transaction_status") ?? "";

  const [confirmationStatus, setConfirmationStatus] = useState<PaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasConfirmed, setHasConfirmed] = useState<boolean>(false);

  const handlePaymentConfirmation = async () => {
    setLoading(true);
    setError(null);
    setHasConfirmed(true); // cegah konfirmasi ganda

    try {
      const response = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          status_code: statusCode,
          transaction_status: transactionStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengonfirmasi pembayaran");
      }

      const data: PaymentResponse = await response.json();
      setConfirmationStatus(data);
      alert("Pembayaran berhasil dikonfirmasi!");

      // Auto back setelah 5 detik
      setTimeout(() => {
        router.back();
      }, 5000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan tak dikenal.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasConfirmed && orderId && statusCode && transactionStatus) {
        handlePaymentConfirmation();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasConfirmed, orderId, statusCode, transactionStatus]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Info</h2>

      <div className="text-sm text-gray-600 mb-6">
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Status Code:</strong> {statusCode}</p>
        <p><strong>Transaction Status:</strong> {transactionStatus}</p>
      </div>

      <button
        className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
        onClick={handlePaymentConfirmation}
        disabled={loading || hasConfirmed}
      >
        {loading ? "Mengonfirmasi..." : "Konfirmasi Pembayaran"}
      </button>

      {error && (
        <p className="mt-4 text-red-500 text-sm">❌ {error}</p>
      )}

      {confirmationStatus && (
        <div className="mt-4 text-green-600 text-sm">
          ✅ Pembayaran dikonfirmasi: {confirmationStatus?.status_message || "Berhasil"}
        </div>
      )}
    </div>
  );
}
